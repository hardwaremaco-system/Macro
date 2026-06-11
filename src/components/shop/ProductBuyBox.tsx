// src/components/shop/ProductBuyBox.tsx
'use client';

import React, { useState } from 'react';
import { ShoppingCart, ShieldCheck, Truck, AlertCircle, Plus, Minus } from 'lucide-react';
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
    <div className="flex flex-col justify-center">
      <div className="mb-2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
          {product.category || 'Hardware'}
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-2">
        {product.title}
      </h1>

      <div className="flex items-end gap-3 mb-6 border-b border-gray-100 pb-6">
        <span className="text-3xl sm:text-4xl font-black text-blue-600">
          UGX {Number(product.price).toLocaleString()}
        </span>
        {product.originalPrice && (
          <span className="text-lg text-gray-400 line-through font-bold mb-1">
            UGX {Number(product.originalPrice).toLocaleString()}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 mb-8">
        <div className="flex items-center text-sm text-gray-700">
          <ShieldCheck size={18} className="text-green-500 mr-2" />
          <span className="font-bold">100% Genuine</span> — Sourced directly from manufacturers.
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <Truck size={18} className="text-blue-500 mr-2" />
          <span className="font-bold">Fast Delivery</span> — Available across the Western Region.
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-gray-700">Quantity</span>
          {currentStock <= 0 ? (
            <span className="text-red-600 flex items-center text-xs font-bold bg-red-50 px-2 py-1 rounded">
              <AlertCircle size={14} className="mr-1" /> Out of Stock
            </span>
          ) : currentStock < 10 ? (
            <span className="text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded">
              Only {currentStock} left in stock
            </span>
          ) : (
            <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">
              In Stock
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg bg-white h-12 w-full sm:w-32">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={currentStock <= 0}
              className="flex-1 flex justify-center text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50"
            >
              <Minus size={18} />
            </button>
            <span className="w-12 text-center font-black text-gray-900">{quantity}</span>
            <button 
              onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
              disabled={currentStock <= 0}
              className="flex-1 flex justify-center text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50"
            >
              <Plus size={18} />
            </button>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={currentStock <= 0}
            className="flex-1 bg-blue-600 text-white h-12 rounded-lg font-black hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
          >
            <ShoppingCart size={20} className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
