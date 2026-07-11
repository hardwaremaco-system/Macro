// src/app/(admin)/admin/products/edit/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, UploadCloud, CheckCircle, X, Star, Loader2, Plus, Trash2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';

// Strict relative paths (6 levels up to reach src/lib)
import { db } from '../../../../../../lib/firebase/client';
import { STORE_CATEGORIES } from '../../../../../../lib/categories';

// Helper type for variations
interface Variation {
  id: string; 
  value: string;
  price: string;
  stock: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(STORE_CATEGORIES[0].name);
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPromo, setIsPromo] = useState(false);

  // Standard Pricing (If NO Variations)
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('99');

  // --- VARIATIONS STATE ---
  const [hasVariations, setHasVariations] = useState(false);
  const [optionName, setOptionName] = useState(''); 
  const [variations, setVariations] = useState<Variation[]>([
    { id: '1', value: '', price: '', stock: '' }
  ]);

  // 1. Fetch Existing Product Data
  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || '');
          setCategory(data.category || STORE_CATEGORIES[0].name);
          setUnit(data.unit || '1 Unit');
          setDescription(data.description || '');
          
          setPrice(data.price?.toString() || '');
          setOriginalPrice(data.originalPrice?.toString() || '');
          setStock(data.stock?.toString() || '0');

          // Handle multi-image logic
          const fetchedImages = data.images && data.images.length > 0 
            ? data.images 
            : (data.image ? [data.image] : []);
          setImages(fetchedImages);

          setIsFeatured(data.isFeatured || false);
          setIsPromo(data.isPromo || false);

          // Populate Variations if they exist
          if (data.hasVariations) {
            setHasVariations(true);
            setOptionName(data.optionName || '');
            if (data.variations && Array.isArray(data.variations)) {
              // Add local IDs to the variations so React can map them properly
              setVariations(data.variations.map((v: any, index: number) => ({
                id: Date.now().toString() + index,
                value: v.value || '',
                price: v.price?.toString() || '',
                stock: v.stock?.toString() || ''
              })));
            }
          }
        } else {
          alert('Product not found!');
          router.push('/admin/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoadingInitial(false);
      }
    }
    fetchProduct();
  }, [productId, router]);

  // --- NATIVE IMAGE UPLOADER WITH COMPRESSION ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    const compressionOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp'
    };

    try {
      for (const file of files) {
        const compressedFile = await imageCompression(file, compressionOptions);
        
        const signResponse = await fetch('/api/cloudinary/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folder: 'macro_hardware/products' }),
        });

        if (!signResponse.ok) throw new Error('Signature generation failed');
        const { signature, timestamp, folder, cloudName, apiKey } = await signResponse.json();

        const uploadData = new FormData();
        uploadData.append('file', compressedFile);
        uploadData.append('api_key', apiKey);
        uploadData.append('timestamp', timestamp.toString());
        uploadData.append('signature', signature);
        uploadData.append('folder', folder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: uploadData,
        });

        const data = await uploadRes.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      }
      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (error: any) {
      console.error('Image upload failed:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  // --- VARIATION HANDLERS ---
  const handleAddVariationRow = () => {
    setVariations([...variations, { id: Date.now().toString(), value: '', price: '', stock: '' }]);
  };

  const handleRemoveVariationRow = (idToRemove: string) => {
    setVariations(variations.filter(v => v.id !== idToRemove));
  };

  const handleVariationChange = (id: string, field: keyof Variation, newValue: string) => {
    setVariations(variations.map(v => v.id === id ? { ...v, [field]: newValue } : v));
  };

  // --- UPDATE PRODUCT IN STORE ---
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return alert('Please upload at least one product image.');

    let finalPrice = 0;
    let finalStock = 0;
    let finalOriginalPrice = null;
    let cleanVariations: any[] = [];

    // Validation & Math Logic for Variations
    if (hasVariations) {
      if (!optionName.trim()) return alert("Please provide an Option Name (e.g., Size, Diameter).");
      if (variations.length === 0) return alert("Please add at least one variation row.");
      
      let minPrice = Infinity;
      let totalStock = 0;

      for (const v of variations) {
        if (!v.value || !v.price || !v.stock) {
          return alert("Please fill out all fields for every variation.");
        }
        const vPrice = Number(v.price);
        const vStock = Number(v.stock);
        
        if (vPrice < minPrice) minPrice = vPrice;
        totalStock += vStock;
        
        // Strip out the React 'id' before saving to database
        cleanVariations.push({ value: v.value, price: vPrice, stock: vStock });
      }

      finalPrice = minPrice; // Used for "From UGX..." sorting
      finalStock = totalStock;
    } else {
      // Standard Product Logic
      finalPrice = Number(price);
      finalStock = Number(stock);
      finalOriginalPrice = originalPrice ? Number(originalPrice) : null;
    }

    setIsSubmitting(true);
    try {
      const productData = {
        title,
        category,
        unit: unit || '1 Unit',
        price: finalPrice, 
        originalPrice: finalOriginalPrice,
        stock: finalStock, 
        description,
        image: images[0],
        images: images, 
        isFeatured,
        isPromo,
        hasVariations,
        ...(hasVariations ? {
          optionName: optionName.trim(),
          variations: cleanVariations
        } : {
          // Explicitly clear these if toggled off during an edit
          optionName: '',
          variations: []
        })
      };

      // 1. Update Firestore Document
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: serverTimestamp(),
      });

      // 2. Sync to Algolia
      try {
        await fetch('/api/algolia/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            objectID: productId,
            ...productData
          }),
        });
      } catch (algoliaError) {
        console.error('Algolia sync failed:', algoliaError);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);

    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
      setIsSubmitting(false);
    }
  };

  if (isLoadingInitial) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center mb-8">
        <button onClick={() => router.back()} className="mr-4 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-1">Update details, manage variations, or adjust pricing.</p>
        </div>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl flex items-center font-bold border border-green-200 shadow-sm">
          <CheckCircle size={20} className="mr-3" /> Product updated successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleUpdateProduct} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">

        {/* --- ROW 1: IMAGES --- */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Product Images (First image becomes the main thumbnail) *</label>
          <div className="flex flex-wrap gap-4 items-start">
            {images.map((img, idx) => (
              <div key={idx} className={`relative w-32 h-32 rounded-xl border-2 overflow-hidden bg-gray-50 group ${idx === 0 ? 'border-blue-500' : 'border-gray-200'}`}>
                <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                {idx === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-[10px] font-black uppercase text-center py-1 flex items-center justify-center">
                    <Star size={10} className="mr-1" /> Main Image
                  </div>
                )}
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600">
                  <X size={14} />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className={`w-32 h-32 border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors shrink-0 ${uploadingImages ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                {uploadingImages ? <Loader2 className="h-6 w-6 animate-spin mb-2 text-blue-600" /> : <><UploadCloud size={24} className="mb-2" /><span className="font-bold text-sm">Add Photos</span></>}
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImages} />
              </label>
            )}
          </div>
        </div>

        {/* --- ROW 2: BASIC INFO --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Title *</label>
            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
            <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500">
              {STORE_CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Unit / Size</label>
            <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 50kg, 1L, Pack of 12" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Product Description</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        {/* --- ROW 3: VARIATIONS TOGGLE & BUILDER --- */}
        <div className="border-t border-gray-200 pt-8 pb-4">
          <label className="flex items-center cursor-pointer mb-6 group">
            <input 
              type="checkbox" 
              checked={hasVariations} 
              onChange={(e) => setHasVariations(e.target.checked)} 
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">
              ☑ This product has variations
            </span>
          </label>

          {hasVariations ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="mb-6 w-full md:w-1/2">
                <label className="block text-sm font-bold text-slate-800 mb-2">Option Name *</label>
                <input 
                  type="text" 
                  value={optionName} 
                  onChange={(e) => setOptionName(e.target.value)} 
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white" 
                  placeholder="e.g. Size, Diameter, Colour, Length" 
                />
                <p className="text-xs text-slate-500 mt-2 font-medium">This will show as "Choose {optionName || '...'}" on the product page.</p>
              </div>

              <div className="overflow-x-auto mb-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200 text-xs font-black text-slate-600 uppercase">
                      <th className="pb-3 pr-4">Value (e.g. 1 inch)</th>
                      <th className="pb-3 pr-4">Price (UGX)</th>
                      <th className="pb-3 pr-4">Stock</th>
                      <th className="pb-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {variations.map((v) => (
                      <tr key={v.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 pr-4">
                          <input type="text" value={v.value} onChange={(e) => handleVariationChange(v.id, 'value', e.target.value)} className="w-full border border-slate-300 rounded-md p-2 text-sm bg-white" placeholder="Value" />
                        </td>
                        <td className="py-3 pr-4">
                          <input type="number" min="0" value={v.price} onChange={(e) => handleVariationChange(v.id, 'price', e.target.value)} className="w-full border border-slate-300 rounded-md p-2 text-sm bg-white" placeholder="0" />
                        </td>
                        <td className="py-3 pr-4">
                          <input type="number" min="0" value={v.stock} onChange={(e) => handleVariationChange(v.id, 'stock', e.target.value)} className="w-full border border-slate-300 rounded-md p-2 text-sm bg-white" placeholder="0" />
                        </td>
                        <td className="py-3 text-right">
                          <button type="button" onClick={() => handleRemoveVariationRow(v.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove Variation">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button type="button" onClick={handleAddVariationRow} className="flex items-center text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-lg transition-colors">
                <Plus size={16} className="mr-2" /> Add Variation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Selling Price (UGX) *</label>
                <input required={!hasVariations} type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white" placeholder="32000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Original Price (Optional)</label>
                <input type="number" min="0" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white" placeholder="e.g. 35000 (Crossed out)" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Available Stock *</label>
                <input required={!hasVariations} type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white" placeholder="99" />
              </div>
            </div>
          )}
        </div>

        {/* --- ROW 4: STORE SETTINGS TOGGLES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setIsFeatured(!isFeatured)}>
            <input type="checkbox" checked={isFeatured} readOnly className="h-5 w-5 rounded border-gray-300 text-blue-600 pointer-events-none" />
            <div className="ml-3">
              <span className="block font-bold text-gray-900 text-sm">Feature on Homepage</span>
              <span className="block text-xs text-gray-500">Displays this item in the "Featured" section.</span>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setIsPromo(!isPromo)}>
            <input type="checkbox" checked={isPromo} readOnly className="h-5 w-5 rounded border-gray-300 text-red-500 pointer-events-none" />
            <div className="ml-3">
              <span className="block font-bold text-gray-900 text-sm">Mark as Promotion</span>
              <span className="block text-xs text-gray-500">Highlights the item with a red discount badge.</span>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-6 border-t border-gray-100">
          <button type="submit" disabled={isSubmitting || success || uploadingImages} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition-colors disabled:opacity-50 text-lg shadow-md flex items-center justify-center">
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin h-5 w-5 mr-3" />
                Saving Changes...
              </span>
            ) : (
              'Save Product Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
