// src/app/(admin)/admin/products/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Plus, Edit, Trash2, Star, Image as ImageIcon } from 'lucide-react';
// Strict relative paths
import { db } from '../../../../lib/firebase/client';

export default function AdminProductsList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage pricing, stock, and featured items.</p>
        </div>
        <Link 
          href="/admin/products/upload" 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center shadow-sm transition-colors"
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
                        {/* Changed this button into a Link pointing directly to the new edit page */}
                        <Link 
                          href={`/admin/products/edit/${product.id}`} 
                          className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-blue-600 hover:text-white transition-colors inline-flex" 
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button onClick={() => handleDelete(product.id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors inline-flex" title="Delete">
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
    </div>
  );
}
