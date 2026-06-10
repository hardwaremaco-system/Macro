// src/components/shop/TrustedBrands.tsx
import React from 'react';

// Hardcoded placeholders until we add real brand logo images to Cloudinary
const brands = [
  { id: 1, name: 'Tororo Cement' },
  { id: 2, name: 'Hima Cement' },
  { id: 3, name: 'Roofings Ltd' },
  { id: 4, name: 'Sadolin Paints' },
  { id: 5, name: 'Chint Electricals' },
  { id: 6, name: 'Makita Tools' },
];

export default function TrustedBrands() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8">
      <h2 className="text-xl font-black text-gray-900 mb-4 text-center md:text-left">Brands We Trust</h2>
      
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
        {brands.map((brand) => (
          <div 
            key={brand.id}
            className="flex-shrink-0 w-32 h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center snap-start hover:border-blue-300 transition-colors"
          >
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center px-2">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
