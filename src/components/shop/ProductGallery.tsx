// src/components/shop/ProductGallery.tsx
'use client';

import React, { useState } from 'react';

export default function ProductGallery({ image, images, title }: { image: string, images?: string[], title: string }) {
  const allImages = images && images.length > 0 ? images : [image];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main Large Image */}
      <div className="w-full aspect-[4/5] sm:aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center relative">
         {allImages[activeIndex]?.startsWith('http') ? (
           <img 
             src={allImages[activeIndex]} 
             alt={title} 
             className="w-full h-full object-cover" 
           />
         ) : (
           <div className="text-[120px] sm:text-[180px]">{allImages[activeIndex] || '📦'}</div>
         )}
         
         {/* Image Counter Badge */}
         <div className="absolute bottom-3 right-3 bg-gray-900/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
           {activeIndex + 1} / {allImages.length}
         </div>
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === idx ? 'border-blue-400' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              {img?.startsWith('http') ? (
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-2xl">{img}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lighting Disclaimer */}
      <p className="text-[10px] text-gray-400 italic mt-1 text-center sm:text-left">
        * Note: Actual color variations may occur due to lighting or screen settings.
      </p>
    </div>
  );
}
