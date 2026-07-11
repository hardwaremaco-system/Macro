// src/components/shop/ProductBuyBox.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../store/useCartStore';
import { X, LayoutGrid } from 'lucide-react';

export default function ProductBuyBox({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  // --- Standard Product State ---
  const [quantity, setQuantity] = useState(1);
  const currentStock = product.stock !== undefined ? product.stock : 99;

  // --- Variations State ---
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // Track quantities for each variation by its value (e.g. { "2 inch": 5, "4 inch": 2 })
  const [varQtys, setVarQtys] = useState<Record<string, number>>({});

  // Reset variation quantities when sheet opens
  useEffect(() => {
    if (isSheetOpen && product.variations) {
      const initialQtys: Record<string, number> = {};
      product.variations.forEach((v: any) => {
        initialQtys[v.value] = 0;
      });
      setVarQtys(initialQtys);
    }
  }, [isSheetOpen, product]);

  // Handle the 3-second auto-close timer for the Success Popup
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessPopup) {
      timer = setTimeout(() => setShowSuccessPopup(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessPopup]);

  // --- HANDLERS: STANDARD PRODUCT ---
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) setQuantity(1);
    else setQuantity(Math.min(currentStock, value));
  };

  const handleAddStandardToCart = () => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      stock: product.stock,
      unit: product.unit,
    }, quantity);
    setShowSuccessPopup(true);
  };

  // --- HANDLERS: VARIATIONS ---
  const handleVarQtyChange = (value: string, delta: number, maxStock: number) => {
    setVarQtys(prev => {
      const current = prev[value] || 0;
      const next = Math.max(0, Math.min(maxStock, current + delta));
      return { ...prev, [value]: next };
    });
  };

  const handleAddVariationsToCart = () => {
    let itemsAdded = 0;
    product.variations.forEach((v: any) => {
      const qty = varQtys[v.value] || 0;
      if (qty > 0) {
        // Crucial: Create a UNIQUE ID for the variation so it doesn't overwrite other sizes
        addItem({
          id: `${product.id}_${v.value}`,
          name: `${product.title} (${v.value})`,
          price: v.price,
          image: product.image,
          stock: v.stock,
          unit: product.unit, // Or we could use the optionName
        }, qty);
        itemsAdded++;
      }
    });

    if (itemsAdded > 0) {
      setIsSheetOpen(false);
      setShowSuccessPopup(true);
    }
  };

  // Calculate totals for the Bottom Sheet Footer
  const totalVarItems = Object.values(varQtys).reduce((sum, q) => sum + q, 0);
  const totalVarPrice = product.variations?.reduce((sum: number, v: any) => {
    return sum + (v.price * (varQtys[v.value] || 0));
  }, 0) || 0;

  return (
    <div className="flex flex-col justify-center pt-2 sm:pt-0 relative">
      
      {/* Product Category & Unit */}
      <div className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-3 tracking-wide uppercase">
        <span>{product.category}</span>
        <span>•</span>
        <span>{product.unit || '1 Unit'}</span>
      </div>

      {/* Product Title */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
        {product.title}
      </h1>

      {/* --- RENDER LOGIC BASED ON VARIATIONS --- */}
      {product.hasVariations ? (
        <>
          {/* Variations Price Block */}
          <div className="mb-8">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-1">
              From
            </span>
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-500 tracking-tight">
              UGX {Number(product.price).toLocaleString()}
            </span>
            <div className="mt-3 text-sm font-bold text-blue-600 bg-blue-50 w-max px-3 py-1.5 rounded-md">
              {product.variations?.length || 0} {product.optionName || 'Option'}s Available
            </div>
          </div>

          {/* Open Bottom Sheet Button */}
          <button 
            onClick={() => setIsSheetOpen(true)}
            className="w-full sm:w-2/3 bg-slate-900 text-white h-14 rounded-sm font-black text-base uppercase tracking-widest hover:bg-blue-600 transition-colors flex items-center justify-center shadow-lg"
          >
            <LayoutGrid size={20} className="mr-3" />
            Choose {product.optionName || 'Type'}
          </button>
        </>
      ) : (
        <>
          {/* Standard Price Block */}
          <div className="flex items-end gap-3 mb-8">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-500 tracking-tight">
              UGX {Number(product.price).toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-base sm:text-lg text-gray-400 line-through font-bold mb-1.5">
                UGX {Number(product.originalPrice).toLocaleString()}
              </span>
            )}
          </div>

          {/* Inline Quantity and Add to Cart Button */}
          <div className="flex items-center gap-3 w-full sm:w-2/3">
            <div className="flex items-center border border-gray-300 rounded-sm bg-white h-14 w-32 shrink-0">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={currentStock <= 0}
                className="flex-1 flex justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-50 text-xl font-medium"
              >
                -
              </button>
              <input 
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-12 text-center font-bold text-gray-900 text-base outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button 
                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                disabled={currentStock <= 0}
                className="flex-1 flex justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-50 text-xl font-medium"
              >
                +
              </button>
            </div>
            <button 
              onClick={handleAddStandardToCart}
              disabled={currentStock <= 0}
              className="flex-1 bg-slate-900 text-white h-14 rounded-sm font-bold text-sm sm:text-base uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {currentStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 1. BOTTOM SHEET OVERLAY (VARIATIONS) */}
      {/* ========================================================= */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          {/* Dark Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSheetOpen(false)}
          />
          
          {/* Bottom Sheet Container */}
          <div className="relative w-full sm:w-[500px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:fade-in-100 duration-300">
            
            {/* Sheet Header */}
            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 bg-white z-10">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Choose {product.optionName || 'Type'}
                </h3>
                <p className="text-xs text-gray-500 font-bold mt-1">
                  Adjust quantities below. Any items > 0 will be added.
                </p>
              </div>
              <button 
                onClick={() => setIsSheetOpen(false)}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Variations List */}
            <div className="overflow-y-auto p-5 sm:p-6 flex-grow bg-gray-50/50">
              <div className="space-y-4">
                {product.variations?.map((v: any, index: number) => {
                  const qty = varQtys[v.value] || 0;
                  const isOutOfStock = Number(v.stock) <= 0;

                  return (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-4 rounded-xl border ${qty > 0 ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 bg-white'} ${isOutOfStock ? 'opacity-50 grayscale' : ''} transition-colors`}
                    >
                      {/* Left: Info */}
                      <div className="flex-1 pr-4">
                        <div className="font-black text-slate-900 text-lg leading-none mb-1.5">
                          {v.value}
                        </div>
                        <div className="text-amber-500 font-bold text-sm mb-1">
                          UGX {Number(v.price).toLocaleString()}
                        </div>
                        <div className={`text-[10px] font-bold uppercase tracking-wider ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                          {isOutOfStock ? 'Out of Stock' : `Stock: ${v.stock}`}
                        </div>
                      </div>

                      {/* Right: Quantity Selector */}
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white h-10 w-28 shrink-0 overflow-hidden shadow-sm">
                        <button 
                          onClick={() => handleVarQtyChange(v.value, -1, v.stock)}
                          disabled={isOutOfStock || qty === 0}
                          className="flex-1 flex justify-center items-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50 text-lg font-bold h-full"
                        >
                          -
                        </button>
                        <div className="w-8 text-center font-black text-slate-900 text-sm">
                          {qty}
                        </div>
                        <button 
                          onClick={() => handleVarQtyChange(v.value, 1, v.stock)}
                          disabled={isOutOfStock || qty >= v.stock}
                          className="flex-1 flex justify-center items-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50 text-lg font-bold h-full"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="p-5 sm:p-6 border-t border-gray-200 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Items</div>
                  <div className="text-xl font-black text-slate-900">{totalVarItems}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Price</div>
                  <div className="text-xl font-black text-amber-500">UGX {totalVarPrice.toLocaleString()}</div>
                </div>
              </div>

              <button 
                onClick={handleAddVariationsToCart}
                disabled={totalVarItems === 0}
                className="w-full bg-slate-900 text-white h-14 rounded-lg font-black text-base uppercase tracking-widest hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:hover:bg-slate-900 shadow-md flex items-center justify-center"
              >
                Add Selected to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. SUCCESS POPUP TOAST */}
      {/* ========================================================= */}
      {showSuccessPopup && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 sm:bottom-auto sm:top-24 sm:right-8 sm:left-auto sm:translate-x-0 z-[80] w-[90%] max-w-sm bg-white border border-gray-200 shadow-2xl rounded-lg p-5 transition-all duration-300 ease-out">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center text-green-600 font-bold text-sm uppercase tracking-wide">
              <span className="text-lg mr-2">✓</span> Added to Cart
            </div>
            <button onClick={() => setShowSuccessPopup(false)} className="text-gray-400 hover:text-gray-800 transition-colors">✕</button>
          </div>
          <p className="text-gray-800 font-medium text-base mb-5 line-clamp-2">
            Successfully added {product.title} to your cart.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/cart" className="flex-1 bg-amber-500 text-slate-900 text-center py-2.5 rounded-sm text-sm font-bold hover:bg-amber-400 transition-colors">
              View Cart
            </Link>
            <button onClick={() => setShowSuccessPopup(false)} className="flex-1 bg-gray-100 text-gray-800 py-2.5 rounded-sm text-sm font-bold hover:bg-gray-200 transition-colors">
              Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
