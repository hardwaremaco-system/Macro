// src/components/shop/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, ChevronDown, Tag, PhoneCall } from 'lucide-react';
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
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm flex flex-col">
        {/* --- TIER 1: Main Header (Logo, Search, Icons) --- */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 w-full">
          <div className="h-14 md:h-16 flex items-center justify-between">
            
            {/* Left: Logo + Text */}
            <div className="flex items-center pl-1 md:pl-0">
              <Link href="/" className="flex items-center" onClick={closeMenu}>
                <img src="/logo.png" alt="Logo" className="h-6 md:h-8 object-contain mr-2" />
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
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full border border-white shadow-sm">
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

          {/* Mobile Global Search (Underneath Logo/Icons) */}
          <div className="md:hidden pb-3 px-1">
            <GlobalSearch />
          </div>
        </div>

        {/* --- TIER 2: Desktop Navigation Bar (Categories Dropdown + Links) --- */}
        <div className="hidden md:block bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-12 flex items-center justify-between">
            
            <div className="flex items-center gap-8 h-full">
              {/* "All Departments" Hover Dropdown */}
              <div className="relative group h-full flex items-center">
                <button className="flex items-center gap-2 font-bold text-white hover:text-amber-400 transition-colors h-full px-2 cursor-default">
                  <Menu size={18} />
                  All Departments
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Dropdown Menu Box */}
                <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-xl rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col py-2">
                  <Link href="/categories" className="px-4 py-2.5 text-sm font-black text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center uppercase tracking-wider">
                    Browse All Categories
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link href="/categories?filter=cement" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">Cement & Concrete</Link>
                  <Link href="/categories?filter=roofing" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">Roofing Materials</Link>
                  <Link href="/categories?filter=plumbing" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">Plumbing & Pipes</Link>
                  <Link href="/categories?filter=electrical" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">Electrical & Lighting</Link>
                  <Link href="/categories?filter=tools" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">Tools & Hardware</Link>
                </div>
              </div>

              {/* Inline Navigation Links */}
              <nav className="flex items-center gap-6 text-sm font-bold text-gray-200">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <Link href="/promotions" className="hover:text-amber-400 transition-colors flex items-center"><Tag size={14} className="mr-1.5"/> Promotions</Link>
                <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
                <Link href="/news" className="hover:text-white transition-colors">News & Events</Link>
                <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
              </nav>
            </div>

            {/* Right side support link */}
            <Link href="/contact" className="flex items-center text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors">
              <PhoneCall size={16} className="mr-1.5" /> Support
            </Link>
            
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding behind the fixed header */}
      {/* Mobile: ~104px height | Desktop: 64px (main) + 48px (nav) = 112px */}
      <div className="h-[104px] md:h-[112px] w-full shrink-0"></div>

      {/* --- MOBILE DRAWER OVERLAY --- */}
      <div 
        className={`fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      />

      {/* --- MOBILE DRAWER MENU (Slide-in from Right) --- */}
      <div 
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 shrink-0 bg-gray-50">
          <div className="flex items-center">
             <img src="/logo.png" alt="Logo" className="h-5 object-contain mr-2" />
             <span className="text-sm font-black tracking-tight text-gray-900">
               MACRO <span className="text-amber-500">HARDWARE</span>
             </span>
          </div>
          <button 
            onClick={closeMenu}
            className="p-1.5 bg-white rounded-full text-gray-400 hover:text-red-500 border border-gray-200 transition-colors transform hover:rotate-90 duration-200 shadow-sm"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-6 flex flex-col space-y-1">
          <Link href="/" onClick={closeMenu} className="py-3.5 text-[15px] font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors flex items-center justify-between group">
            Home
          </Link>
          <Link href="/categories" onClick={closeMenu} className="py-3.5 text-[15px] font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors flex items-center justify-between group">
            All Categories
          </Link>
          <Link href="/promotions" onClick={closeMenu} className="py-3.5 text-[15px] font-black text-amber-600 border-b border-gray-50 hover:text-amber-500 transition-colors flex items-center justify-between group">
            Promotions & Offers
          </Link>
          <Link href="/gallery" onClick={closeMenu} className="py-3.5 text-[15px] font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors flex items-center justify-between group">
            Project Gallery
          </Link>
          <Link href="/news" onClick={closeMenu} className="py-3.5 text-[15px] font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors flex items-center justify-between group">
            News & Events
          </Link>
          <Link href="/faq" onClick={closeMenu} className="py-3.5 text-[15px] font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors flex items-center justify-between group">
            Help & FAQ
          </Link>
          <Link href="/contact" onClick={closeMenu} className="py-3.5 text-[15px] font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors flex items-center justify-between group">
            Contact Us
          </Link>
        </nav>

        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
          <Link 
            href={user ? "/profile" : "/login"} 
            onClick={closeMenu} 
            className="flex items-center justify-center w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-md uppercase tracking-wider text-sm"
          >
            <User size={18} className="mr-2" />
            {user ? 'My Account' : 'Login / Register'}
          </Link>
        </div>
      </div>
    </>
  );
}
