// src/app/(shop)/cart/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Image as ImageIcon, Lock } from 'lucide-react';
// Strict relative path
import { useCartStore } from '../../../store/useCartStore';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 border border-gray-100 shadow-sm">
          <ShoppingBag size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm sm:text-base">Looks like you haven't added any building materials to your cart yet.</p>
        <Link href="/" className="bg-slate-900 text-white px-8 py-3.5 rounded-sm font-bold hover:bg-slate-800 transition-colors inline-flex items-center uppercase tracking-wider text-sm shadow-md">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8 tracking-tight">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <ul className="divide-y divide-gray-100">
              {items.map((item) => {
                // Safeguard stock in case it's missing from older cart items
                const currentStock = item.stock !== undefined ? item.stock : 99;

                return (
                  // Using flex-row and items-center forces everything into a single row bounded by the image height
                  <li key={item.id} className="p-4 sm:p-5 flex flex-row items-center gap-4 sm:gap-6 group hover:bg-gray-50 transition-colors">

                    {/* 1. Left: Product Image Thumbnail */}
                    <Link href={`/product/${item.id}`} className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200 overflow-hidden relative">
                      {item.image?.startsWith('http') ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <ImageIcon size={28} className="text-gray-300" />
                      )}
                    </Link>

                    {/* 2. Middle: Title & Price */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <Link href={`/product/${item.id}`} className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 hover:text-amber-500 transition-colors leading-snug">
                        {item.name}
                      </Link>
                      <p className="text-base sm:text-lg font-black text-amber-500 mt-1">
                        UGX {Number(item.price).toLocaleString()}
                      </p>
                      
                      {/* Stock warning */}
                      {item.quantity >= currentStock && (
                        <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-1 bg-amber-50 px-2 py-0.5 rounded w-fit">
                          Max Stock
                        </span>
                      )}
                    </div>

                    {/* 3. Right: Quantity & Remove Action */}
                    <div className="flex flex-col items-end justify-center gap-2 sm:gap-2.5 flex-shrink-0">
                      
                      {/* Square Quantity Selector */}
                      <div className="flex items-center border border-gray-300 rounded-sm bg-white h-8 sm:h-9 w-24 sm:w-28">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="flex-1 flex justify-center text-gray-500 hover:text-slate-900 transition-colors disabled:opacity-30 text-lg font-medium"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-slate-900 text-sm">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= currentStock}
                          className="flex-1 flex justify-center text-gray-500 hover:text-slate-900 transition-colors disabled:opacity-30 text-lg font-medium"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Word */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-gray-400 font-bold hover:text-red-500 transition-colors uppercase tracking-widest"
                      >
                        Remove
                      </button>

                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-wide">Order Summary</h2>

            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span className="font-bold text-slate-900">UGX {getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Delivery</span>
                <span className="text-amber-500 font-bold">Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <span className="text-base font-black text-slate-900 uppercase">Total</span>
                <span className="text-2xl font-black text-amber-500 leading-none">UGX {getCartTotal().toLocaleString()}</span>
              </div>
            </div>

            <Link href="/checkout" className="w-full bg-slate-900 text-white py-3.5 rounded-sm font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center shadow-md uppercase tracking-widest">
              Proceed to Checkout <ArrowRight size={18} className="ml-2" />
            </Link>

            <div className="mt-5 text-xs text-center text-gray-400 flex items-center justify-center gap-1.5 font-medium">
              <Lock size={14} className="text-gray-400" /> Safe & Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
