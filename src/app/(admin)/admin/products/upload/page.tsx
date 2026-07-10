// src/app/(admin)/admin/products/upload/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, UploadCloud, CheckCircle, X, Star, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
// Strict relative paths
import { db } from '../../../../../lib/firebase/client';
import { STORE_CATEGORIES } from '../../../../../lib/categories';

export default function UploadProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(STORE_CATEGORIES[0].name);
  const [unit, setUnit] = useState(''); 
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('99');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPromo, setIsPromo] = useState(false);

  // --- NATIVE IMAGE UPLOADER WITH COMPRESSION ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    // Compression Settings
    const compressionOptions = {
      maxSizeMB: 1,            // Compress to maximum 1MB
      maxWidthOrHeight: 1920,  // Resize ultra-huge camera photos down to 1920px max
      useWebWorker: true,      // Keeps the UI from freezing during compression
      fileType: 'image/webp'   // Converts heavy PNGs/JPGs to modern WebP format
    };

    try {
      for (const file of files) {
        
        // 1. Compress the image before doing anything else
        console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
        const compressedFile = await imageCompression(file, compressionOptions);
        console.log(`Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

        // 2. Fetch secure signature for each file
        const signResponse = await fetch('/api/cloudinary/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folder: 'macro_hardware/products' }),
        });

        if (!signResponse.ok) throw new Error('Signature generation failed');
        const { signature, timestamp, folder, cloudName, apiKey } = await signResponse.json();

        // 3. Direct Upload to Cloudinary API (Using the COMPRESSED file)
        const uploadData = new FormData();
        uploadData.append('file', compressedFile); // <-- Uploading the small file!
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

      // Append new images to the existing array
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

  // --- PUBLISH PRODUCT TO STORE ---
  const handleUploadProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return alert('Please upload at least one product image.');

    setIsSubmitting(true);
    try {
      const mainImage = images[0]; 

      const productData = {
        title,
        category,
        unit: unit || '1 Unit', 
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        stock: Number(stock),
        description,
        image: mainImage,
        images: images, 
        isFeatured,
        isPromo,
      };

      // 1. Save to Firestore
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: serverTimestamp(),
      });

      // 2. Sync to Algolia
      try {
        await fetch('/api/algolia/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            objectID: docRef.id,
            ...productData
          }),
        });
      } catch (algoliaError) {
        console.error('Product saved to Firestore, but Algolia sync failed:', algoliaError);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);

    } catch (error) {
      console.error('Error uploading product:', error);
      alert('Failed to upload product. Check console.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={() => router.back()} className="mr-4 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-1">Upload a comprehensive product listing with gallery and stock tracking.</p>
        </div>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl flex items-center font-bold border border-green-200 shadow-sm">
          <CheckCircle size={20} className="mr-3" /> Product uploaded & synced successfully! Redirecting...
        </div>
      )}

      {/* Main Upload Form */}
      <form onSubmit={handleUploadProduct} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">

        {/* Row 1: Native Multi-Image Uploader */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Product Images (First image becomes the main thumbnail) *</label>
          <div className="flex flex-wrap gap-4 items-start">

            {/* Render Uploaded Images */}
            {images.map((img, idx) => (
              <div key={idx} className={`relative w-32 h-32 rounded-xl border-2 overflow-hidden bg-gray-50 group ${idx === 0 ? 'border-blue-500' : 'border-gray-200'}`}>
                <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />

                {/* Main Image Badge */}
                {idx === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-[10px] font-black uppercase text-center py-1 flex items-center justify-center">
                    <Star size={10} className="mr-1" /> Main Image
                  </div>
                )}

                {/* Remove Button */}
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600">
                  <X size={14} />
                </button>
              </div>
            ))}

            {/* Native Upload Input */}
            {images.length < 5 && (
              <label className={`w-32 h-32 border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors shrink-0 ${uploadingImages ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                {uploadingImages ? (
                  <Loader2 className="h-6 w-6 animate-spin mb-2 text-blue-600" />
                ) : (
                  <>
                    <UploadCloud size={24} className="mb-2" />
                    <span className="font-bold text-sm">Add Photos</span>
                  </>
                )}
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                  disabled={uploadingImages} 
                />
              </label>
            )}
          </div>
        </div>

        {/* Row 2: Title, Category, & Unit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Title *</label>
            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Tororo Cement" />
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

        {/* Row 3: Pricing & Inventory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Selling Price (UGX) *</label>
            <input required type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="32000" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Original Price (Optional)</label>
            <input type="number" min="0" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 35000 (Crossed out)" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Available Stock *</label>
            <input required type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="99" />
          </div>
        </div>

        {/* Row 4: Description */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Product Description</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Detail the specifications, grade, or best use cases..." />
        </div>

        {/* Row 5: Store Settings Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Publishing to Store...
              </span>
            ) : (
              'Publish Product to Store'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
