// src/components/shop/ProductDescription.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Updated interface to include stock and category based on your upload page
export interface ProductData {
  id: string;
  title: string; 
  description?: string;
  unit?: string; 
  stock?: number;
  category?: string;
}

export default function ProductDescription({ product }: { product: ProductData }) {
  // Accordion state: General Specifications open by default
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleWhatsAppShare = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out ${product.title} at Macro Hardware!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="mt-12 pt-2 border-t border-gray-200 divide-y divide-gray-100">
      
      {/* 1. GENERAL SPECIFICATIONS ACCORDION */}
      <div className="py-4">
        <button 
          onClick={() => setIsSpecsOpen(!isSpecsOpen)}
          className="w-full flex items-center justify-between focus:outline-none group"
        >
          <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
            General Specifications
          </h2>
          <ChevronDown 
            size={20} 
            className={`text-gray-400 transition-transform duration-300 ${isSpecsOpen ? 'rotate-180' : 'rotate-0'}`} 
          />
        </button>
        
        {/* Expandable Content: Specs Table */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSpecsOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-1 sm:p-2">
            <table className="w-full text-left text-sm sm:text-base border-collapse">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <th className="py-3 px-3 sm:px-4 text-gray-500 font-medium w-[45%]">Unit / Quantity</th>
                  <td className="py-3 px-3 sm:px-4 font-bold text-gray-900">{product.unit || '1 Unit'}</td>
                </tr>
                <tr>
                  <th className="py-3 px-3 sm:px-4 text-gray-500 font-medium">Stock Left</th>
                  <td className="py-3 px-3 sm:px-4 font-bold text-gray-900">
                    {product.stock !== undefined ? (
                      product.stock > 0 ? `${product.stock} Available` : <span className="text-red-500">Out of Stock</span>
                    ) : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <th className="py-3 px-3 sm:px-4 text-gray-500 font-medium">Category</th>
                  <td className="py-3 px-3 sm:px-4 font-bold text-gray-900">{product.category || 'General'}</td>
                </tr>
                <tr>
                  <th className="py-3 px-3 sm:px-4 text-gray-500 font-medium">Seller</th>
                  <td className="py-3 px-3 sm:px-4 font-bold text-blue-600">Macro Hardware</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. PRODUCT DETAILS ACCORDION */}
      <div className="py-4">
        <button 
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="w-full flex items-center justify-between focus:outline-none group"
        >
          <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
            Product Details
          </h2>
          <ChevronDown 
            size={20} 
            className={`text-gray-400 transition-transform duration-300 ${isDetailsOpen ? 'rotate-180' : 'rotate-0'}`} 
          />
        </button>
        
        {/* Expandable Content: Description */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDetailsOpen ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="text-slate-600 leading-relaxed text-sm sm:text-base pt-2 pb-4 px-2">
            {product.description ? (
              <div className="space-y-3">
                {product.description.split('\n').map((line, index) => {
                  if (!line.trim()) return null; 
                  return (
                    <div key={index} className="flex items-start">
                      <span className="mr-3 text-amber-500 mt-1 text-xs">▪︎</span>
                      <span className="flex-1">{line.trim()}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 italic">No detailed description is available for this product at the moment.</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. SHARE THIS PRODUCT ACCORDION */}
      <div className="py-4 border-b border-gray-100">
        <button 
          onClick={() => setIsShareOpen(!isShareOpen)}
          className="w-full flex items-center justify-between focus:outline-none group"
        >
          <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
            Share This Product
          </h2>
          <ChevronDown 
            size={20} 
            className={`text-gray-400 transition-transform duration-300 ${isShareOpen ? 'rotate-180' : 'rotate-0'}`} 
          />
        </button>
        
        {/* Expandable Content: WhatsApp Button */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isShareOpen ? 'max-h-[200px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="pt-2 pb-4">
            <button 
              onClick={handleWhatsAppShare}
              // -mx-4 pulls it edge-to-edge on mobile, sm:mx-0 resets it for desktop. Slim rectangle with light green background.
              className="w-[calc(100%+2rem)] sm:w-full -mx-4 sm:mx-0 bg-[#E8F5E9] text-[#128C7E] hover:bg-[#C8E6C9] transition-colors py-3.5 px-4 flex items-center justify-center cursor-pointer shadow-sm sm:rounded-sm"
            >
              {/* Custom SVG for the authentic WhatsApp Logo */}
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-2.5">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span className="font-bold text-sm uppercase tracking-widest">Share on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
