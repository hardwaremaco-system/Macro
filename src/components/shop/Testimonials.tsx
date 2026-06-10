// src/components/shop/Testimonials.tsx
import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Samuel M.',
    role: 'Contractor',
    content: 'Macro Hardware is my go-to for all bulk materials. Deliveries are always on time and the materials are genuine.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Grace K.',
    role: 'Homeowner',
    content: 'I bought all my plumbing fixtures here. The customer service helped me pick the exact right sizes over WhatsApp.',
    rating: 5,
  },
  {
    id: 3,
    name: 'David O.',
    role: 'Site Engineer',
    content: 'Very competitive prices on roofing sheets and the quality is unmatched. Highly recommend for large projects.',
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <div className="bg-blue-900 mt-12 py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black">Trusted by Builders</h2>
          <p className="mt-2 text-sm text-blue-200">Hear from our satisfied customers across the region.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white/10 rounded-xl p-6 border border-white/20 backdrop-blur-sm">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-400"} 
                  />
                ))}
              </div>
              <p className="text-sm text-blue-50 italic mb-4">"{review.content}"</p>
              <div>
                <h4 className="text-sm font-bold">{review.name}</h4>
                <span className="text-xs text-blue-300">{review.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
