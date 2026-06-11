// src/components/shop/ProductBuyBox.tsx
'use client';

import React, { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';

export default function ProductBuyBox({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const currentStock = product.stock !== undefined ? product.stock : 99;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      stock: product.stock,
    }, quantity);
    alert(`${quantity}x ${product.title} added to your cart!`);
  };

  return (
    <div className="flex flex-col justify-center pt-2 sm:pt-0">
      
      {/* Exact Scarcity Badge */}
      {currentStock > 0 && currentStock < 10 && (
        <div className="bg-red-100 text-red-500 text-[11px] font-bold px-2.5 py-1 rounded-sm w-fit mb-3 lowercase tracking-wide">
          only {currentStock} left
        </div>
      )}
      {currentStock <= 0 && (
        <div className="bg-gray-200 text-gray-600 text-[11px] font-bold px-2.5 py-1 rounded-sm w-fit mb-3 uppercase tracking-wide">
          Out of Stock
        </div>
      )}

      {/* Product Title */}
      <h1 className="text-2xl sm:text-3xl font-black text-slate-700 leading-tight mb-3">
        {product.title}
      </h1>

      {/* Price */}
      <div className="flex items-end gap-3 mb-6">
        <span className="text-2xl sm:text-3xl font-black text-slate-900">
          UGX {Number(product.price).toLocaleString()}
        </span>
        {product.originalPrice && (
          <span className="text-sm text-gray-400 line-through font-bold mb-1">
            UGX {Number(product.originalPrice).toLocaleString()}
          </span>
        )}
      </div>

      {/* Inline Quantity and Add to Cart Button */}
      <div className="flex items-center gap-3">
        {/* Square Quantity Selector */}
        <div className="flex items-center border border-gray-300 rounded-sm bg-white h-12 w-28 shrink-0">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={currentStock <= 0}
            className="flex-1 flex justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-50 text-lg font-medium"
          >
            -
          </button>
          <span className="w-8 text-center font-bold text-gray-900 text-sm">
            {quantity}
          </span>
          <button 
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            disabled={currentStock <= 0}
            className="flex-1 flex justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-50 text-lg font-medium"
          >
            +
          </button>
        </div>

        {/* Square Dark Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          disabled={currentStock <= 0}
          className="flex-1 bg-slate-900 text-white h-12 rounded-sm font-bold text-xs sm:text-sm uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          Add to Cart
        </button>
      </div>

      <div className="mt-4 text-[10px] text-gray-400">+ More options</div>
    </div>
  );
}
