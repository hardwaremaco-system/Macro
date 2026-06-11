// src/components/shop/ProductDescription.tsx
import React from 'react';

export default function ProductDescription({ description }: { description?: string }) {
  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-black text-gray-900 mb-4">Product Description</h2>
      <div className="prose max-w-none text-gray-600 leading-relaxed text-sm sm:text-base">
        {description ? (
          <p className="whitespace-pre-wrap">{description}</p>
        ) : (
          <p>No detailed description is available for this product at the moment.</p>
        )}
      </div>
    </div>
  );
}
