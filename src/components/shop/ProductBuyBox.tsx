// src/components/shop/ProductBuyBox.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../store/useCartStore';

export default function ProductBuyBox({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const currentStock = product.stock !== undefined ? product.stock : 99;

  // Handle the 3-second auto-close timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showPopup) {
      timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
    // Cleanup the timer if the component unmounts or popup closes early
    return () => clearTimeout(timer);
  }, [showPopup]);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      stock: product.stock,
    }, quantity);
    
    // Trigger the custom popup instead of the alert
    setShowPopup(true);
  };

  return (
    <div className="flex flex-col justify-center pt-2 sm:pt-0 relative">

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

      {/* Custom Auto-Closing Popup */}
      {showPopup && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 sm:bottom-auto sm:top-24 sm:right-8 sm:left-auto sm:translate-x-0 z-50 w-[90%] max-w-sm bg-white border border-gray-200 shadow-2xl rounded-lg p-5 transition-all duration-300 ease-out">
          
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center text-green-600 font-bold text-sm uppercase tracking-wide">
              <span className="text-lg mr-2">✓</span> Added to Cart
            </div>
            <button 
              onClick={() => setShowPopup(false)}
              className="text-gray-400 hover:text-gray-800 transition-colors"
            >
              ✕
            </button>
          </div>

          <p className="text-gray-800 font-medium text-base mb-5 line-clamp-1">
            {quantity}x {product.title}
          </p>

          <div className="flex items-center gap-3">
            <Link 
              href="/cart"
              className="flex-1 bg-yellow-500 text-slate-900 text-center py-2.5 rounded-sm text-sm font-bold hover:bg-yellow-400 transition-colors"
            >
              View Cart
            </Link>
            <button 
              onClick={() => setShowPopup(false)}
              className="flex-1 bg-gray-100 text-gray-800 py-2.5 rounded-sm text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
