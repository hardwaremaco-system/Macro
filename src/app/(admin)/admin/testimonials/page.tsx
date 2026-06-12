// src/app/(admin)/admin/testimonials/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { CheckCircle, XCircle, Trash2, Star, MessageSquare, Search } from 'lucide-react';
// Strict relative path
import { db } from '../../../../lib/firebase/client';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Added search state

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

  // Filter testimonials based on search input (checks name and message)
  const filteredTestimonials = testimonials.filter(review => 
    (review.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (review.message?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Customer Feedback</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve customer testimonials for the homepage.</p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name or message..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col">
        {/* MOBILE RESPONSIVE WRAPPER APPLIED HERE */}
        <div className="overflow-x-auto w-full rounded-xl">
          {/* MIN-WIDTH APPLIED HERE */}
          <table className="w-full min-w-[800px] text-left border-collapse">
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
              ) : filteredTestimonials.length === 0 ? (
                 <tr>
                   <td colSpan={4} className="px-6 py-12 text-center">
                     <MessageSquare size={24} className="mx-auto text-gray-400 mb-2" />
                     <p className="text-gray-500 font-medium">
                       {searchTerm ? 'No reviews match your search.' : 'No reviews submitted yet.'}
                     </p>
                   </td>
                 </tr>
              ) : filteredTestimonials.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
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
                        <button onClick={() => handleUpdateStatus(review.id, 'approved')} className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-600 hover:text-white transition-colors" title="Approve">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {review.status !== 'rejected' && (
                        <button onClick={() => handleUpdateStatus(review.id, 'rejected')} className="p-1.5 bg-amber-50 text-amber-600 rounded hover:bg-amber-600 hover:text-white transition-colors" title="Reject">
                          <XCircle size={16} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(review.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors" title="Delete">
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
