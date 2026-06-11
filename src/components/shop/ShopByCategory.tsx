// src/components/shop/ShopByCategory.tsx
import React from 'react';
import Link from 'next/link';
// Strict relative path
import { STORE_CATEGORIES } from '../../lib/categories';

export default function ShopByCategory() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      
      {/* Compact Header */}
      <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-3">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          Shop by Category
        </h2>
        <Link href="/categories" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
          View All Directory &rarr;
        </Link>
      </div>

      {/* Ultra-Compact Grid: 3 columns on mobile, 6 columns on desktop (1 single row) */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
        {STORE_CATEGORIES.map((category) => (
          <Link 
            key={category.slug} 
            href={`/categories/${category.slug}`}
            className="bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-center hover:bg-white hover:border-blue-200 hover:shadow-md transition-all group"
          >
            {/* Smaller, tighter image container */}
            <div className="w-10 h-10 sm:w-14 sm:h-14 mb-2 sm:mb-3 relative">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            {/* Text only, no descriptions */}
            <h3 className="text-[10px] sm:text-xs font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-wider leading-tight">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>

    </section>
  );
}
