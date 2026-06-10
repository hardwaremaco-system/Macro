// src/app/(admin)/admin/testimonials/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { CheckCircle, XCircle, Trash2, Star, MessageSquare } from 'lucide-react';
// Strict relative path
import { db } from '../../../../lib/firebase/client';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'testimonials', id), { status: newStatus });
      setTestimonials(testimonials.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (error) {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this feedback permanently?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (error) {
      alert('Failed to delete testimonial.');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Customer Feedback</h1>
        <p className="text-sm text-gray-500 mt-1">Review and approve customer testimonials for the homepage.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Rating & Feedback</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading feedback...</td></tr>
              ) : testimonials.length === 0 ? (
                 <tr>
                   <td colSpan={4} className="px-6 py-12 text-center">
                     <MessageSquare size={24} className="mx-auto text-gray-400 mb-2" />
                     <p className="text-gray-500 font-medium">No reviews submitted yet.</p>
                   </td>
                 </tr>
              ) : testimonials.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{review.name}</div>
                    <div className="text-xs text-gray-500">{review.role}</div>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <div className="flex text-amber-500 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? "fill-amber-500" : "text-gray-300"} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 italic">"{review.message}"</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      review.status === 'approved' ? 'bg-green-100 text-green-800' :
                      review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {review.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {review.status !== 'approved' && (
                        <button onClick={() => handleUpdateStatus(review.id, 'approved')} className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-600 hover:text-white" title="Approve">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {review.status !== 'rejected' && (
                        <button onClick={() => handleUpdateStatus(review.id, 'rejected')} className="p-1.5 bg-amber-50 text-amber-600 rounded hover:bg-amber-600 hover:text-white" title="Reject">
                          <XCircle size={16} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(review.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white" title="Delete">
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
    </div>
  );
}
