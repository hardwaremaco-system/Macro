// src/components/shop/ProductDescription.tsx
import React from 'react';

export default function ProductDescription({ description }: { description?: string }) {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-wide">
        Product Description
      </h2>
      
      <div className="text-slate-600 leading-relaxed text-sm sm:text-base">
        {description ? (
          <div className="space-y-2.5">
            {description.split('\n').map((line, index) => {
              // Skip rendering empty lines if there are double spaces
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
    </div>
  );
}
