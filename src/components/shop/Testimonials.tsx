// src/components/shop/Testimonials.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { Star, MessageSquareQuote, X } from 'lucide-react';
// Strict relative path
import { db } from '../../lib/firebase/client';

export default function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({ name: '', role: '', rating: 5, message: '' });

  useEffect(() => {
    async function fetchReviews() {
      try {
        // Fetch only 5 approved reviews to save space and bandwidth
        const q = query(
          collection(db, 'testimonials'), 
          where('status', '==', 'approved'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'testimonials'), {
        ...formData,
        status: 'pending',
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
    <section className="bg-gray-900 py-12 border-y border-gray-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Header */}
        <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Customer Reviews</h2>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="text-xs sm:text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-wider mb-1"
          >
            Leave a Review &rarr;
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-gray-800 rounded-xl">
            <MessageSquareQuote size={32} className="mx-auto text-gray-700 mb-2" />
            <p className="text-sm text-gray-500">Be the first to review our materials!</p>
          </div>
        ) : (
          /* Native Horizontal Snap Scroll (Hides scrollbar, enables swipe) */
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="snap-center shrink-0 w-[280px] sm:w-[320px] bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex text-amber-500 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? "fill-amber-500" : "text-gray-600"} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 italic mb-5 leading-relaxed line-clamp-3">"{review.message}"</p>
                </div>
                
                <div className="flex items-center mt-auto">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-black mr-3 shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-xs truncate">{review.name}</h4>
                    <p className="text-[10px] text-gray-400 truncate">{review.role || 'Verified Customer'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black tracking-tight">Rate Your Experience</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500 hover:text-red-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setFormData({...formData, rating: star})} className="p-1.5 focus:outline-none hover:scale-110 transition-transform">
                    <Star size={32} className={`transition-colors ${star <= formData.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Your Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="e.g. John Doe" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Role / Location (Optional)</label>
                <input value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="e.g. Homeowner in Kabale" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Your Review</label>
                <textarea required rows={3} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none" placeholder="Tell us about the quality of materials and delivery..." />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black hover:bg-blue-700 transition-colors mt-4 shadow-md disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
