// src/app/(admin)/admin/products/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Plus, Edit, Trash2, Search, Package, X, AlertCircle, UploadCloud } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
// Strict relative path
import { db } from '../../../../lib/firebase/client';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const initialForm = {
    name: '',
    price: '',
    originalPrice: '',
    stock: '',
    category: 'Cement',
    image: '', 
    isPromo: false,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert('Please upload a product image first.');
      return;
    }
    setIsSubmitting(true);

    try {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await addDoc(collection(db, 'products'), {
        name: formData.name,
        slug: slug,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock),
        category: formData.category,
        image: formData.image,
        isPromo: formData.isPromo,
        createdAt: serverTimestamp(),
      });

      setIsModalOpen(false);
      setFormData(initialForm);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert('Failed to delete product.');
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Product Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your catalogue and stock levels.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center shadow-sm">
          <Plus size={18} className="mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price (UGX)</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    Loading inventory...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="px-6 py-12 text-center">
                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                       <Package size={24} />
                     </div>
                     <p className="text-gray-500 font-medium">Your inventory is empty.</p>
                   </td>
                 </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mr-3 border border-gray-200 flex-shrink-0">
                      {product.image.startsWith('http') ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">{product.image}</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 line-clamp-2">{product.name}</div>
                      {product.isPromo && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase rounded-sm tracking-wider">
                          On Promotion
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-gray-900">{product.price?.toLocaleString()}</div>
                    {product.originalPrice && (
                      <div className="text-xs text-gray-400 line-through">{product.originalPrice?.toLocaleString()}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded flex items-center w-max ${product.stock <= 0 ? 'bg-red-50 text-red-600' : product.stock < 10 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                      {product.stock <= 0 || product.stock < 10 ? <AlertCircle size={14} className="mr-1" /> : null}
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors title='Edit'">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id, product.name)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors title='Delete'">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-black text-gray-900">Add New Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Image Upload Widget Area using Secure Signature Endpoint */}
                <div className="md:col-span-2 mb-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                  {formData.image ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-blue-500 shadow-sm">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600 transition-colors">
                        <X size={12}/>
                      </button>
                    </div>
                  ) : (
                    <CldUploadWidget 
                      signatureEndpoint="/api/cloudinary/sign"
                      onSuccess={(result: any) => {
                        setFormData({ ...formData, image: result.info.secure_url });
                      }}
                    >
                      {({ open }) => (
                        <button 
                          type="button" 
                          onClick={() => open()} 
                          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                        >
                          <UploadCloud size={32} className="mb-2" />
                          <span className="text-sm font-bold">Click to securely upload image</span>
                        </button>
                      )}
                    </CldUploadWidget>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                  <input name="name" required value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Tororo Cement 50kg" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <select name="category" required value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="Cement">Cement</option>
                    <option value="Roofing">Roofing</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Tools">Tools</option>
                    <option value="Hardware">Hardware</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Stock Quantity</label>
                  <input name="stock" type="number" required min="0" value={formData.stock} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Selling Price (UGX)</label>
                  <input name="price" type="number" required min="0" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Original Price (For Discounts)</label>
                  <input name="originalPrice" type="number" min="0" value={formData.originalPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Leave blank if no discount" />
                </div>

                <div className="md:col-span-2 flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 mt-2">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Promotional Item</h4>
                    <p className="text-xs text-gray-500">Enable this to display the red discount badge on the product card.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isPromo" checked={formData.isPromo} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center transition-colors">
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
