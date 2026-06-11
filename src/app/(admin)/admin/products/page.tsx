// src/app/(admin)/admin/products/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Plus, Edit, Trash2, Star, X, Image as ImageIcon } from 'lucide-react';
// Strict relative paths
import { db } from '../../../../lib/firebase/client';
import { STORE_CATEGORIES } from '../../../../lib/categories';

export default function AdminProductsList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // --- Quick Actions ---
  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'products', id), { isFeatured: !currentStatus });
      setProducts(products.map(p => p.id === id ? { ...p, isFeatured: !currentStatus } : p));
    } catch (error) {
      alert('Failed to update featured status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert('Failed to delete product.');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'products', editingProduct.id), {
        title: editingProduct.title,
        price: Number(editingProduct.price),
        category: editingProduct.category,
      });
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
    } catch (error) {
      alert('Failed to update product.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage pricing, stock, and featured items.</p>
        </div>
        <Link 
          href="/admin/products/upload" 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Add New Product
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price (UGX)</th>
                <th className="px-6 py-4 text-center">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading inventory...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No products found. Start by adding one!</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center mr-4 overflow-hidden shrink-0">
                        {product.image ? (
                          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={20} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{product.title}</div>
                        <div className="text-xs text-gray-500 max-w-[200px] truncate">{product.description || 'No description'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {Number(product.price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleToggleFeatured(product.id, product.isFeatured)}
                        className={`p-2 rounded-full transition-colors ${product.isFeatured ? 'bg-amber-100 text-amber-500' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                        title="Toggle Featured on Homepage"
                      >
                        <Star size={18} className={product.isFeatured ? "fill-amber-500" : ""} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => setEditingProduct(product)} className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-blue-600 hover:text-white transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black">Edit Product Details</h2>
              <button onClick={() => setEditingProduct(null)}><X size={24} className="text-gray-400 hover:text-red-500" /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Product Title</label>
                <input required value={editingProduct.title} onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price (UGX)</label>
                <input required type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                <select value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                  {STORE_CATEGORIES.map(cat => (
                    <option key={cat.slug} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={isUpdating} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 mt-4">
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
