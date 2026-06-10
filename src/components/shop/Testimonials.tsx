// src/components/shop/Testimonials.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { Star, MessageSquareQuote, X } from 'lucide-react';
import { db } from '../../lib/firebase/client';

export default function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', role: '', rating: 5, message: '' });

  useEffect(() => {
    async function fetchReviews() {
      const q = query(collection(db, 'testimonials'), where('status', '==', 'approved'));
      const snapshot = await getDocs(q);
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'testimonials'), {
        ...formData,
        status: 'pending', // Requires admin approval!
        createdAt: serverTimestamp()
      });
      alert('Thank you! Your review has been submitted and is pending approval.');
      setIsModalOpen(false);
      setFormData({ name: '', role: '', rating: 5, message: '' });
    } catch (error) {
      alert('Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-900 py-16 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">What our customers say</h2>
            <p className="text-gray-400 text-sm">Don't just take our word for it. Read reviews from contractors and homeowners.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-amber-500 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-amber-600 transition-colors whitespace-nowrap shadow-md">
            Leave a Review
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl">
            <MessageSquareQuote size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">Be the first to review Macro Hardware!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < review.rating ? "fill-amber-500" : "text-gray-600"} />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-6 leading-relaxed">"{review.message}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-lg font-black mr-3">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{review.name}</h4>
                    <p className="text-xs text-gray-400">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white text-gray-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black">Rate Your Experience</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400" /></button>
            </div>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setFormData({...formData, rating: star})} className="p-1 focus:outline-none">
                    <Star size={32} className={`transition-colors ${star <= formData.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" placeholder="e.g. John Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Role / Location (Optional)</label>
                <input value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" placeholder="e.g. Homeowner in Kabale" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Your Review</label>
                <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" placeholder="Tell us about the quality of materials and delivery..." />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 mt-2">
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
