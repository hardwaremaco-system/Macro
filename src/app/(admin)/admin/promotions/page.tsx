// src/app/(admin)/admin/promotions/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, Tag, X, UploadCloud, CheckCircle, XCircle } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
// Strict relative path
import { db } from '../../../../lib/firebase/client';

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialForm = {
    title: '',
    description: '',
    discountCode: '',
    buttonText: 'Shop Now',
    buttonLink: '/promotions',
    image: '',
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'promotions'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setPromotions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPromotions(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert('Please upload a promotion banner image.');
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'promotions'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setIsModalOpen(false);
      setFormData(initialForm);
      fetchPromotions();
    } catch (error) {
      console.error('Error adding promotion:', error);
      alert('Failed to add promotion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'promotions', id), { isActive: !currentStatus });
      setPromotions(promotions.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
    } catch (error) {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;
    try {
      await deleteDoc(doc(db, 'promotions', id));
      setPromotions(promotions.filter(p => p.id !== id));
    } catch (error) {
      alert('Failed to delete promotion.');
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Promotions & Offers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage homepage banners and active discount campaigns.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center shadow-sm">
          <Plus size={18} className="mr-2" /> Create Promotion
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Banner Preview</th>
                <th className="px-6 py-4">Campaign Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
              ) : promotions.length === 0 ? (
                 <tr>
                   <td colSpan={4} className="px-6 py-12 text-center">
                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                       <Tag size={24} />
                     </div>
                     <p className="text-gray-500 font-medium">No active promotions.</p>
                   </td>
                 </tr>
              ) : promotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-32 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{promo.title}</div>
                    {promo.discountCode && (
                      <div className="text-xs mt-1 font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded inline-block">
                        Code: {promo.discountCode}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleStatus(promo.id, promo.isActive)}
                      className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${promo.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {promo.isActive ? <><CheckCircle size={14} className="mr-1"/> Active</> : <><XCircle size={14} className="mr-1"/> Inactive</>}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(promo.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Promotion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-black text-gray-900">Create Promotion</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddPromotion} className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Image Upload Area */}
                <div className="md:col-span-2 mb-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Banner Image (Landscape recommended)</label>
                  {formData.image ? (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-blue-500 shadow-sm">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                        <X size={16}/>
                      </button>
                    </div>
                  ) : (
                    <CldUploadWidget 
                      signatureEndpoint="/api/cloudinary/sign"
                      onSuccess={(result: any) => setFormData({ ...formData, image: result.info.secure_url })}
                    >
                      {({ open }) => (
                        <button type="button" onClick={() => open()} className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600">
                          <UploadCloud size={32} className="mb-2" />
                          <span className="text-sm font-bold">Upload Banner Image</span>
                        </button>
                      )}
                    </CldUploadWidget>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Campaign Title</label>
                  <input name="title" required value={formData.title} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" placeholder="e.g. Huge Discounts on Roofing!" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Short Description</label>
                  <textarea name="description" rows={2} required value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" placeholder="Tell customers what the offer is..." />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Discount Code (Optional)</label>
                  <input name="discountCode" value={formData.discountCode} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm uppercase" placeholder="e.g. ROOF20" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Button Link</label>
                  <input name="buttonLink" required value={formData.buttonLink} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" placeholder="e.g. /categories/roofing" />
                </div>

                <div className="md:col-span-2 flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50 mt-2">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                  <label className="ml-3 block text-sm font-bold text-gray-900">
                    Set Active Immediately
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  {isSubmitting ? 'Saving...' : 'Publish Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
