// src/components/shop/ProductCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
// Strict relative path to prevent Vercel alias errors
import { useCartStore } from '../../store/useCartStore';

// 1. Fixed Interface: Swapped 'name' to 'title' to match Firestore
export interface ProductData {
  id: string;
  title: string; 
  category?: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock?: number; // Made optional
  isPromo?: boolean;
}

export default function ProductCard({ product }: { product: ProductData }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the Link from navigating when clicking the button
    
    // We pass 'name: product.title' just in case the cart store still expects a 'name' property
    addItem({ ...product, name: product.title }, 1);
    alert(`${product.title} added to cart!`);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  // Since we don't upload stock amounts yet, we default to showing "In Stock" (e.g., 99)
  const currentStock = product.stock !== undefined ? product.stock : 99;

  return (
    {/* 2. Fixed Routing: Using product.id instead of product.slug */}
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
            {product.image || '📦'}
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-3 flex flex-col flex-grow">
        
        {/* 3. Fixed Display: Using product.title */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight min-h-[40px]">
          {product.title}
        </h3>

        <div className="mt-2 flex-grow">
          <div className="text-lg font-black text-gray-900">
            UGX {Number(product.price).toLocaleString()}
          </div>
          {product.originalPrice && (
            <div className="text-xs text-gray-400 line-through">
              UGX {Number(product.originalPrice).toLocaleString()}
            </div>
          )}
        </div>

        {/* Stock Indicator & Action Button */}
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className={`text-[10px] font-bold uppercase ${currentStock > 10 ? 'text-emerald-500' : 'text-orange-500'}`}>
            {currentStock > 0 ? (currentStock > 10 ? 'In Stock' : `Only ${currentStock} left`) : 'Out of Stock'}
          </span>

          <button 
            onClick={handleAddToCart}
            disabled={currentStock === 0}
            className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-50 disabled:hover:text-blue-600"
          >
            <ShoppingCart size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </Link>
  );
}
