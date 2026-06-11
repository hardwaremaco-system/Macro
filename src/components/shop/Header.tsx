// src/components/shop/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          
          <div className="h-12 md:h-16 flex items-center justify-between">
            
            {/* Left: Logo + Text */}
            <div className="flex items-center pl-1 md:pl-0">
              <Link href="/" className="flex items-center" onClick={closeMenu}>
                <img src="/logo.png" alt="Logo" className="h-6 md:h-9 object-contain mr-2" />
                <span className="text-[14px] md:text-lg font-black tracking-tight text-gray-900 whitespace-nowrap">
                  MACRO <span className="text-amber-500">HARDWARE</span>
                </span>
              </Link>
            </div>

            {/* Center: Desktop Global Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <GlobalSearch />
            </div>

            {/* Right: User, Cart & Mobile Hamburger */}
            <div className="flex items-center space-x-4 md:space-x-6 text-gray-700 pr-1 md:pr-0">
              <Link href={user ? "/profile" : "/login"} className="hidden md:flex flex-col items-center hover:text-blue-600 transition-colors">
                <User size={20} />
                <span className="text-[10px] font-bold mt-1">
                  {user ? 'Account' : 'Login'}
                </span>
              </Link>
              
              <Link href="/cart" className="relative flex flex-col items-center hover:text-blue-600 transition-colors">
                <ShoppingCart size={22} />
                <span className="hidden md:block text-[10px] font-bold mt-1">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full border border-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Hamburger Menu */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-1.5 text-gray-900 hover:text-blue-600 transition-colors"
                aria-label="Open Menu"
              >
                <Menu size={24} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="md:hidden pb-2 px-1">
            <GlobalSearch />
          </div>

        </div>
      </header>

      <div className="h-[88px] md:h-16 w-full shrink-0"></div>
      
      <div 
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      />

      {/* Slide-in Drawer from RIGHT */}
      <div 
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center">
             <img src="/logo.png" alt="Logo" className="h-5 object-contain mr-2" />
             <span className="text-sm font-black tracking-tight text-gray-900">
               MACRO <span className="text-amber-500">HARDWARE</span>
             </span>
          </div>
          <button 
            onClick={closeMenu}
            className="p-1 text-gray-500 hover:text-red-500 transition-colors transform hover:rotate-90 duration-200"
          >
            <X size={26} strokeWidth={2.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-6 flex flex-col space-y-1">
          <Link href="/" onClick={closeMenu} className="py-3 text-[15px] font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/categories" onClick={closeMenu} className="py-3 text-[15px] font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors">
            All Categories
          </Link>
          <Link href="/promotions" onClick={closeMenu} className="py-3 text-[15px] font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors">
            Promotions & Offers
          </Link>
          <Link href="/gallery" onClick={closeMenu} className="py-3 text-[15px] font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors">
            Project Gallery
          </Link>
          <Link href="/news" onClick={closeMenu} className="py-3 text-[15px] font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors">
            News & Events
          </Link>
          <Link href="/faq" onClick={closeMenu} className="py-3 text-[15px] font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors">
            Help & FAQ
          </Link>
          <Link href="/contact" onClick={closeMenu} className="py-3 text-[15px] font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors">
            Contact Us
          </Link>
        </nav>

        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
          <Link 
            href={user ? "/profile" : "/login"} 
            onClick={closeMenu} 
            className="flex items-center justify-center w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <User size={18} className="mr-2" />
            {user ? 'My Account' : 'Login / Register'}
          </Link>
        </div>
      </div>
    </>
  );
}
