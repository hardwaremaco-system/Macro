// src/components/shop/PromotionsBanner.tsx
import React from 'react';
import Link from 'next/link';

export default function PromotionsBanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 text-white relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="z-10 text-center md:text-left mb-6 md:mb-0">
          <span className="inline-block bg-red-900 text-red-100 text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-widest mb-3">
            Limited Time Offer
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mb-2">Build More for Less!</h2>
          <p className="text-red-100 text-sm max-w-md">
            Get up to 15% off on all bulk cement and roofing sheet purchases this month. Ensure your project stays on budget.
          </p>
        </div>

        <div className="z-10 flex-shrink-0">
          <Link 
            href="/promotions" 
            className="bg-white text-red-700 px-6 py-3 rounded-full font-black text-sm uppercase tracking-wide hover:bg-red-50 transition-colors shadow-lg"
          >
            Shop Offers
          </Link>
        </div>
      </div>
    </div>
  );
}
