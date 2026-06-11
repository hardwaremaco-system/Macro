// src/components/shop/ProductGallery.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function ProductGallery({ image, images, title }: { image: string, images?: string[], title: string }) {
  const allImages = images && images.length > 0 ? images : [image];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open so the background page doesn't move
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      
      // Auto-scroll the modal to the currently selected thumbnail index instantly
      if (scrollContainerRef.current) {
        const width = scrollContainerRef.current.clientWidth;
        scrollContainerRef.current.scrollTo({ left: width * activeIndex, behavior: 'instant' as ScrollBehavior });
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen, activeIndex]);

  // Update active index based on actual swipe position in the modal
  const handleModalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < allImages.length) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main Large Image (Now Clickable) */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="w-full aspect-[4/5] sm:aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center relative cursor-zoom-in group"
        >
          {allImages[activeIndex]?.startsWith('http') ? (
            <img 
              src={allImages[activeIndex]} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="text-[120px] sm:text-[180px] group-hover:scale-105 transition-transform">{allImages[activeIndex] || '📦'}</div>
          )}

          {/* Image Counter Badge */}
          <div className="absolute bottom-3 right-3 bg-gray-900/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
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
                  activeIndex === idx ? 'border-blue-500' : 'border-transparent opacity-60 hover:opacity-100'
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

      {/* Full Screen Photo Gallery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
          
          {/* Top Bar with Counter and Close Button */}
          <div className="flex justify-between items-center p-4 sm:p-6 text-white absolute top-0 w-full z-10 bg-gradient-to-b from-black/50 to-transparent">
            <span className="font-bold text-sm tracking-widest">
              {activeIndex + 1} / {allImages.length}
            </span>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
            >
              <X size={24} />
            </button>
          </div>

          {/* Swipeable Image Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleModalScroll}
            className="flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          >
            {allImages.map((img, idx) => (
              <div key={idx} className="min-w-full h-full flex items-center justify-center snap-center p-4">
                {img?.startsWith('http') ? (
                  <img 
                    src={img} 
                    alt={`Gallery Image ${idx + 1}`} 
                    className="max-w-full max-h-full object-contain" 
                  />
                ) : (
                  <div className="text-[150px]">{img || '📦'}</div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}
    </>
  );
}
