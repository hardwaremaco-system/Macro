// src/components/shop/ProductCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
// Strict relative path to prevent Vercel alias errors
import { useCartStore } from '../../store/useCartStore';

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
  isPromo?: boolean;
}

export default function ProductCard({ product }: { product: ProductData }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the Link from navigating when clicking the button
    addItem({ ...product }, 1);
    alert(`${product.name} added to cart!`);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all relative">
      
      {/* Promotion Badge */}
      {product.isPromo && discountPercentage > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-wide shadow-sm">
          -{discountPercentage}%
        </div>
      )}

      {/* Image Container: Safely handles both Cloudinary URLs and Placeholder Emojis */}
      <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
        {product.image.startsWith('http') ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
            {product.image}
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight min-h-[40px]">
          {product.name}
        </h3>
        
        <div className="mt-2 flex-grow">
          <div className="text-lg font-black text-gray-900">
            UGX {product.price.toLocaleString()}
          </div>
          {product.originalPrice && (
            <div className="text-xs text-gray-400 line-through">
              UGX {product.originalPrice.toLocaleString()}
            </div>
          )}
        </div>

        {/* Stock Indicator & Action Button */}
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className={`text-[10px] font-bold uppercase ${product.stock > 10 ? 'text-emerald-500' : 'text-orange-500'}`}>
            {product.stock > 0 ? (product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`) : 'Out of Stock'}
          </span>
          
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-50 disabled:hover:text-blue-600"
          >
            <ShoppingCart size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </Link>
  );
}
