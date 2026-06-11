// src/components/shop/ProductDescription.tsx
'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function ProductDescription({ description }: { description?: string }) {
  const [openSection, setOpenSection] = useState<'description' | 'additional' | 'reviews'>('description');

  const toggleSection = (section: 'description' | 'additional' | 'reviews') => {
    setOpenSection(openSection === section ? null as any : section);
  };

  return (
    <div className="mt-8 border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
      
      {/* Description Accordion */}
      <div className="border-b border-gray-100 last:border-0">
        <button 
          onClick={() => toggleSection('description')}
          className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
        >
          <span className={`text-xs font-bold ${openSection === 'description' ? 'text-emerald-600' : 'text-gray-900'}`}>
            Description
          </span>
          {openSection === 'description' ? <ChevronUp size={16} className="text-emerald-600" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        
        {openSection === 'description' && (
          <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed">
            {description ? (
              <p className="whitespace-pre-wrap">{description}</p>
            ) : (
              <p>No detailed description is available for this product.</p>
            )}
          </div>
        )}
      </div>

      {/* Additional Information Accordion */}
      <div className="border-b border-gray-100 last:border-0">
        <button 
          onClick={() => toggleSection('additional')}
          className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
        >
          <span className={`text-xs font-bold ${openSection === 'additional' ? 'text-emerald-600' : 'text-gray-900'}`}>
            Additional Information
          </span>
          {openSection === 'additional' ? <ChevronUp size={16} className="text-emerald-600" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        
        {openSection === 'additional' && (
          <div className="px-5 pb-5 pt-1">
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 border-b border-gray-50 pb-2">
                <span className="text-gray-500">Condition</span>
                <span className="col-span-2 text-gray-900">New</span>
              </div>
              <div className="grid grid-cols-3 border-b border-gray-50 pb-2">
                <span className="text-gray-500">Location</span>
                <span className="col-span-2 text-gray-900">Available locally in Kabale</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-500">Sold By</span>
                <span className="col-span-2 font-bold text-gray-900 flex items-center">
                  Kabale Online Official <CheckCircle2 size={12} className="ml-1 text-blue-600 fill-blue-100" />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Reviews Accordion */}
      <div className="border-b border-gray-100 last:border-0">
        <button 
          onClick={() => toggleSection('reviews')}
          className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
        >
          <span className={`text-xs font-bold ${openSection === 'reviews' ? 'text-emerald-600' : 'text-gray-900'}`}>
            Customer Reviews
          </span>
          {openSection === 'reviews' ? <ChevronUp size={16} className="text-emerald-600" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        
        {openSection === 'reviews' && (
          <div className="px-5 pb-5 pt-1 text-xs text-gray-500 italic">
            No reviews yet for this product.
          </div>
        )}
      </div>

    </div>
  );
}
