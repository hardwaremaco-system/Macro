// src/components/shop/ProductCard.tsx
import React from 'react';
import Link from 'next/link';

export interface ProductData {
  id: string;
  title: string; 
  category?: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock?: number;
  isPromo?: boolean;
  unit?: string; // Added to support unit/size (e.g., 50kg, 1L)
}

export default function ProductCard({ product }: { product: ProductData }) {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <Link href={`/product/${product.id}`} className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all relative">

      {/* Promotion Badge */}
      {product.isPromo && discountPercentage > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-wide shadow-sm">
          -{discountPercentage}%
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
        {product.image && product.image.startsWith('http') ? (
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
            {product.image || ''}
          </div>
        )}
      </div>

      {/* Product Content - Left aligned with balanced vertical spacing */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow text-left">

        {/* 1. Name */}
        <h3 className="text-sm sm:text-base font-bold text-slate-800 line-clamp-2 leading-snug">
          {product.title}
        </h3>

        {/* 2. Unit / Size */}
        <div className="text-[11px] sm:text-xs font-medium text-gray-500 mt-1 mb-2">
          {product.unit || '1 Unit'}
        </div>

        {/* 3. Divider Line - Pushes the price perfectly to the bottom */}
        <div className="border-t border-gray-100 w-full mt-auto mb-2.5"></div>

        {/* 4. Price (Largest emphasis) */}
        <div>
          <div className="text-lg sm:text-xl font-black text-slate-900 leading-none">
            UGX {Number(product.price).toLocaleString()}
          </div>
          {product.originalPrice && (
            <div className="text-[11px] text-gray-400 line-through mt-1.5 font-medium">
              UGX {Number(product.originalPrice).toLocaleString()}
            </div>
          )}
        </div>
        
      </div>
    </Link>
  );
}
