// src/app/(shop)/cart/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
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
                  <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 group hover:bg-gray-50 transition-colors">
                    
                    {/* Product Image Thumbnail */}
                    <Link href={`/product/${item.id}`} className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-lg flex items-center justify-center text-4xl flex-shrink-0 border border-gray-200 overflow-hidden relative">
                      {item.image?.startsWith('http') ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="opacity-50">{item.image || '📦'}</div>
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col sm:flex-row justify-between w-full h-full py-1">
                      <div className="mb-4 sm:mb-0 flex flex-col justify-between">
                        <div>
                          <Link href={`/product/${item.id}`} className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors leading-snug">
                            {item.name}
                          </Link>
                          <p className="text-lg font-black text-blue-600 mt-2">UGX {Number(item.price).toLocaleString()}</p>
                        </div>
                        
                        {/* Stock warning if trying to buy max stock */}
                        {item.quantity >= currentStock && (
                          <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-2 bg-amber-50 px-2 py-0.5 rounded w-fit">
                            Max Stock Reached
                          </span>
                        )}
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4 mt-2 sm:mt-0">
                        
                        {/* Square Quantity Selector (Matches Product Details Page) */}
                        <div className="flex items-center border border-gray-300 rounded-sm bg-white h-10 w-28 shrink-0">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="flex-1 flex justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-30 text-lg font-medium"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-gray-900 text-sm">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= currentStock}
                            className="flex-1 flex justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-30 text-lg font-medium"
                          >
                            +
                          </button>
                        </div>

                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-xs sm:text-sm text-red-500 font-bold hover:text-red-700 flex items-center transition-colors uppercase tracking-wider bg-red-50 sm:bg-transparent px-3 py-1.5 sm:px-0 sm:py-0 rounded"
                        >
                          <Trash2 size={14} className="mr-1.5 sm:mr-1" /> Remove
                        </button>
                      </div>
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
            <h2 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-wide">Order Summary</h2>

            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span className="font-bold text-gray-900">UGX {getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Delivery</span>
                <span className="text-blue-600 font-bold">Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <span className="text-base font-black text-gray-900 uppercase">Total</span>
                <span className="text-2xl font-black text-slate-900 leading-none">UGX {getCartTotal().toLocaleString()}</span>
              </div>
            </div>

            <Link href="/checkout" className="w-full bg-blue-600 text-white py-3.5 rounded-sm font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center shadow-md uppercase tracking-widest">
              Proceed to Checkout <ArrowRight size={18} className="ml-2" />
            </Link>

            <div className="mt-5 text-xs text-center text-gray-400 flex items-center justify-center gap-1.5 font-medium">
              🔒 Safe & Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
