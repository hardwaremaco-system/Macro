// src/components/shop/ProductGallery.tsx
'use client';

import React, { useState } from 'react';

export default function ProductGallery({ image, images, title }: { image: string, images?: string[], title: string }) {
  // If no array of images exists yet, fallback to the single main image
  const allImages = images && images.length > 0 ? images : [image];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main Large Image */}
      <div className="w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center relative">
         {allImages[activeIndex]?.startsWith('http') ? (
           <img 
             src={allImages[activeIndex]} 
             alt={title} 
             className="w-full h-full object-cover" 
           />
         ) : (
           <div className="text-[120px] sm:text-[180px]">{allImages[activeIndex] || '📦'}</div>
         )}
      </div>

      {/* Thumbnails Row (Only visible if there is more than 1 image) */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === idx ? 'border-blue-600' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              {img?.startsWith('http') ? (
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-3xl">{img}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
