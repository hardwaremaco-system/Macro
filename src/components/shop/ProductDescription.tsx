// src/components/shop/ProductDescription.tsx
'use client';

import React from 'react';

export interface ProductData {
  id: string;
  title: string; 
  description?: string;
  unit?: string; 
}

export default function ProductDescription({ product }: { product: ProductData }) {
  const handleWhatsAppShare = () => {
    // Grabs the current page URL safely on the client side
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out ${product.title} at Macro Hardware!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      
      {/* 1. Unit (Placed neatly above the description, price removed) */}
      <div className="mb-6">
        <div className="text-sm sm:text-base font-bold text-gray-400 mb-1 leading-none">
          {product.unit || '1 Unit'}
        </div>
      </div>

      {/* 2. Description Header */}
      <h2 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-wide">
        Product Description
      </h2>

      {/* 3. Description Content */}
      <div className="text-slate-600 leading-relaxed text-sm sm:text-base">
        {product.description ? (
          <div className="space-y-2.5">
            {product.description.split('\n').map((line, index) => {
              if (!line.trim()) return null; 

              return (
                <div key={index} className="flex items-start">
                  <span className="mr-2.5 text-slate-400 mt-0.5 text-xs">▪︎</span>
                  <span className="flex-1">{line.trim()}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 italic">No detailed description is available for this product at the moment.</p>
        )}
      </div>

      {/* 4. Edge-to-Edge WhatsApp Share (Slim Rectangle) */}
      <button 
        onClick={handleWhatsAppShare}
        // -mx-4 pulls it edge-to-edge on mobile, sm:mx-0 resets it for desktop. bg-[#E8F5E9] is a very clean, light WhatsApp green.
        className="w-[calc(100%+2rem)] sm:w-full -mx-4 sm:mx-0 mt-10 bg-[#E8F5E9] text-[#128C7E] hover:bg-[#C8E6C9] transition-colors py-3.5 px-4 flex items-center justify-center cursor-pointer"
      >
        {/* Custom SVG for the authentic WhatsApp Logo */}
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-2.5">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span className="font-bold text-sm uppercase tracking-widest">Share on WhatsApp</span>
      </button>

    </div>
  );
}
