// src/app/(admin)/admin/brands/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, ShieldCheck, X, UploadCloud } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
// Strict relative path
import { db } from '../../../../lib/firebase/client';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({ name: '', logoUrl: '' });

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'brands'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setBrands(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.logoUrl) return alert('Please upload a brand logo.');
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'brands'), {
        name: formData.name,
        logoUrl: formData.logoUrl,
        createdAt: serverTimestamp(),
      });
      setIsModalOpen(false);
      setFormData({ name: '', logoUrl: '' });
      fetchBrands();
    } catch (error) {
      alert('Failed to add brand.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this brand logo?')) return;
    try {
      await deleteDoc(doc(db, 'brands', id));
      setBrands(brands.filter(b => b.id !== id));
    } catch (error) {
      alert('Failed to delete brand.');
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Trusted Brands</h1>
          <p className="text-sm text-gray-500 mt-1">Upload partner logos for the homepage scroller.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center">
          <Plus size={18} className="mr-2" /> Add Brand
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 flex-1">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading brands...</div>
        ) : brands.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No brands added yet.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {brands.map((brand) => (
              <div key={brand.id} className="relative rounded-xl border border-gray-200 p-4 flex flex-col items-center justify-center bg-gray-50 group">
                <img src={brand.logoUrl} alt={brand.name} className="h-16 object-contain mb-3" />
                <span className="text-xs font-bold text-gray-500">{brand.name}</span>
                <button onClick={() => handleDelete(brand.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black">Add Partner Brand</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddBrand} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Transparent Logo (PNG)</label>
                {formData.logoUrl ? (
                  <div className="w-full h-24 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-blue-500 relative">
                    <img src={formData.logoUrl} alt="Preview" className="h-16 object-contain" />
                    <button type="button" onClick={() => setFormData({ ...formData, logoUrl: '' })} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={12}/></button>
                  </div>
                ) : (
                  <CldUploadWidget signatureEndpoint="/api/cloudinary/sign" onSuccess={(result: any) => setFormData({ ...formData, logoUrl: result.info.secure_url })}>
                    {({ open }) => (
                      <button type="button" onClick={() => open()} className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 hover:bg-blue-50">
                        <UploadCloud size={24} className="mr-2" /> Upload Logo
                      </button>
                    )}
                  </CldUploadWidget>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Brand Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" placeholder="e.g. Tororo Cement" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700">
                {isSubmitting ? 'Saving...' : 'Save Brand'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
