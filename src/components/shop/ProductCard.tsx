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
  unit?: string; 
  hasVariations?: boolean;
  optionName?: string;
  variations?: any[];
}

export default function ProductCard({ product }: { product: ProductData }) {
  // Calculate discount only if it's a promo and there's an original price
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

      {/* Product Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow text-left">

        {product.hasVariations ? (
          /* =========================================
             LAYOUT A: PRODUCT WITH VARIATIONS
             ========================================= */
          <>
            {/* Top Row: Unit on the Left, Variations Badge on the Right */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="text-xs sm:text-sm font-bold text-gray-400 leading-none">
                {product.unit || '1 Unit'}
              </div>
              <div className="text-[10px] font-bold text-blue-600 leading-none bg-blue-50 px-2 py-1 rounded-md">
                {product.variations?.length || 0} {product.optionName || 'Option'}s
              </div>
            </div>
            
            <h3 className="text-base sm:text-lg font-black text-slate-800 line-clamp-2 leading-snug">
              {product.title}
            </h3>
            
            <div className="mt-auto pt-3">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                From
              </div>
              <div className="text-lg sm:text-xl font-black text-amber-500 leading-none">
                UGX {Number(product.price).toLocaleString()}
              </div>
            </div>
          </>
        ) : (
          /* =========================================
             LAYOUT B: STANDARD PRODUCT (NO VARIATIONS)
             ========================================= */
          <>
            <div className="text-xs sm:text-sm font-bold text-gray-400 mb-2 leading-none">
              {product.unit || '1 Unit'}
            </div>
            
            <h3 className="text-base sm:text-lg font-black text-slate-800 line-clamp-2 leading-snug">
              {product.title}
            </h3>
            
            <div className="mt-auto pt-3">
              <div className="text-lg sm:text-xl font-black text-amber-500 leading-none">
                UGX {Number(product.price).toLocaleString()}
              </div>
              {product.originalPrice && (
                <div className="text-xs text-gray-400 line-through mt-1 font-medium">
                  UGX {Number(product.originalPrice).toLocaleString()}
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </Link>
  );
}
