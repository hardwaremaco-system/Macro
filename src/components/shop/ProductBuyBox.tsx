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

      {/* Product Title - Doubled in size and made gray */}
      <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-500 leading-none mb-6 tracking-tighter">
        {product.title}
      </h1>

      {/* Price - Kept at its original size */}
      <div className="flex items-end gap-3 mb-8">
        <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          UGX {Number(product.price).toLocaleString()}
        </span>
        {product.originalPrice && (
          <span className="text-base sm:text-lg text-gray-400 line-through font-bold mb-1.5">
            UGX {Number(product.originalPrice).toLocaleString()}
          </span>
        )}
      </div>

      {/* Inline Quantity and Add to Cart Button */}
      <div className="flex items-center gap-3">
        {/* Square Quantity Selector */}
        <div className="flex items-center border border-gray-300 rounded-sm bg-white h-14 w-32 shrink-0">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={currentStock <= 0}
            className="flex-1 flex justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-50 text-xl font-medium"
          >
            -
          </button>
          <span className="w-10 text-center font-bold text-gray-900 text-base">
            {quantity}
          </span>
          <button 
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            disabled={currentStock <= 0}
            className="flex-1 flex justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-50 text-xl font-medium"
          >
            +
          </button>
        </div>

        {/* Square Dark Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          disabled={currentStock <= 0}
          className="flex-1 bg-slate-900 text-white h-14 rounded-sm font-bold text-sm sm:text-base uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {currentStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>

    </div>
  );
}
