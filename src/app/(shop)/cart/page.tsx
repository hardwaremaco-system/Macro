// src/app/(shop)/cart/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
// Strict relative path
import { useCartStore } from '../../../store/useCartStore';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <ShoppingBag size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any building materials to your cart yet.</p>
        <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors inline-flex items-center">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Product Image Placeholder */}
                  <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center text-4xl flex-shrink-0 border border-gray-100">
                    {item.image}
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 flex flex-col sm:flex-row justify-between w-full">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="text-base font-bold text-gray-900 line-clamp-2">{item.name}</h3>
                      <p className="text-sm font-black text-blue-600 mt-1">UGX {item.price.toLocaleString()}</p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-l-lg transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-r-lg transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-500 font-bold hover:text-red-700 flex items-center transition-colors"
                      >
                        <Trash2 size={14} className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-black text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold text-gray-900">UGX {getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="text-amber-600 font-bold">Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between">
                <span className="text-base font-black text-gray-900">Total</span>
                <span className="text-xl font-black text-blue-600">UGX {getCartTotal().toLocaleString()}</span>
              </div>
            </div>

            <Link href="/checkout" className="w-full bg-amber-500 text-white py-3 rounded-lg font-black hover:bg-amber-600 transition-colors flex items-center justify-center shadow-md">
              Proceed to Checkout <ArrowRight size={18} className="ml-2" />
            </Link>
            
            <div className="mt-4 text-xs text-center text-gray-500 flex items-center justify-center gap-2">
              🔒 Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
