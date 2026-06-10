// src/components/shop/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
// Strict relative paths
import { useCartStore } from '../../store/useCartStore';
import { useAuth } from '../../context/AuthContext';
import GlobalSearch from './GlobalSearch';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const cartCount = useCartStore((state) => state.getCartCount());
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Logo */}
        <div className="flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden mr-3 p-1 text-gray-600"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="text-xl font-black text-blue-900 tracking-tight flex items-center">
            MACRO <span className="text-amber-500 ml-1">HARDWARE</span>
          </Link>
        </div>

        {/* Center: Algolia Global Search (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <GlobalSearch />
        </div>

        {/* Right: User & Cart Actions */}
        <div className="flex items-center space-x-4 md:space-x-6 text-gray-700">
          <Link href={user ? "/profile" : "/login"} className="hidden md:flex flex-col items-center hover:text-blue-600 transition-colors">
            <User size={22} />
            <span className="text-[10px] font-bold mt-1">
              {user ? 'Account' : 'Login'}
            </span>
          </Link>
          
          <Link href="/cart" className="relative flex flex-col items-center hover:text-blue-600 transition-colors">
            <ShoppingCart size={22} />
            <span className="hidden md:block text-[10px] font-bold mt-1">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 md:-top-1 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <nav className="flex flex-col px-4 pt-2 pb-4 space-y-2">
            {/* Inject search into mobile menu for now */}
            <div className="py-2">
              <GlobalSearch />
            </div>
            <Link href="/categories" className="py-2 text-sm font-medium text-gray-700 border-b border-gray-100">All Categories</Link>
            <Link href="/promotions" className="py-2 text-sm font-medium text-gray-700 border-b border-gray-100">Promotions & Offers</Link>
            <Link href="/news" className="py-2 text-sm font-medium text-gray-700 border-b border-gray-100">News & Events</Link>
            <Link href={user ? "/profile" : "/login"} className="py-2 text-sm font-medium text-blue-600">
              {user ? 'My Account' : 'Login / Register'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
