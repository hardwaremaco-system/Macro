// src/components/shop/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, User, ChevronDown } from 'lucide-react';
// Strict relative paths
import { useCartStore } from '../../store/useCartStore';
import { useAuth } from '../../context/AuthContext';
import GlobalSearch from './GlobalSearch';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const cartCount = useCartStore((state) => state.getCartCount());
  const { user, profile } = useAuth(); 

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setIsDepartmentsOpen(false);
    setIsMoreOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm flex flex-col">
        {/* --- TIER 1: Main Header (Logo, Search, Icons) --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="h-16 md:h-20 flex items-center justify-between">

            {/* Left: Logo + Text */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center" onClick={closeMenu}>
                <img src="/logo.png" alt="Logo" className="h-8 md:h-10 object-contain mr-3" />
                <span className="text-xl md:text-2xl font-black tracking-tight whitespace-nowrap">
                  <span className="text-blue-600">MACRO</span> <span className="text-amber-500">HARDWARE</span>
                </span>
              </Link>
            </div>

            {/* Center: Desktop Global Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <GlobalSearch />
            </div>

            {/* Right: User, Cart & Mobile Hamburger */}
            <div className="flex items-center space-x-6 md:space-x-8 text-gray-900">

              {/* Account / Login (Desktop) */}
              <Link 
                href={user ? "/profile" : "/login"} 
                className="hidden md:flex items-center text-sm font-bold hover:text-blue-600 transition-colors tracking-wide uppercase"
              >
                <User size={18} className="mr-1.5" />
                {user ? 'Account' : 'Login'}
              </Link>

              {/* Cart Icon with Red Badge */}
              <Link 
                href="/cart" 
                className="relative flex items-center text-gray-900 hover:text-blue-600 transition-colors"
                onClick={closeMenu}
              >
                <ShoppingCart size={26} strokeWidth={2.5} />
                <span className="absolute -top-2 -right-2.5 bg-red-600 text-white text-[10px] font-black h-[20px] min-w-[20px] px-1.5 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                  {cartCount || 0}
                </span>
              </Link>

              {/* Mobile Hamburger Menu */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden text-gray-900 hover:text-blue-600 transition-colors"
                aria-label="Open Menu"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>

          {/* Mobile Global Search (Underneath Logo/Icons) */}
          <div className="md:hidden pb-4">
            <GlobalSearch />
          </div>
        </div>

        {/* --- TIER 2: Desktop Navigation Bar --- */}
        <div className="hidden md:block bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-12 flex items-center justify-between">

            <div className="flex items-center gap-8 h-full">

              {/* "Categories" Click Dropdown (Modernized) */}
              <div className="relative h-full flex items-center">
                <button 
                  onClick={() => {
                    setIsDepartmentsOpen(!isDepartmentsOpen);
                    setIsMoreOpen(false);
                  }}
                  className={`font-black uppercase text-sm tracking-widest transition-colors h-full ${
                    isDepartmentsOpen ? 'text-blue-400' : 'text-white hover:text-gray-300'
                  }`}
                >
                  Categories
                </button>

                {/* Dropdown Menu Box */}
                <div 
                  className={`absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-xl rounded-b-xl z-50 flex flex-col py-2 transition-all duration-200 origin-top ${
                    isDepartmentsOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-95'
                  }`}
                >
                  <Link href="/categories" onClick={closeMenu} className="px-5 py-3 text-sm font-black text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors uppercase tracking-wider">
                    Browse All
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link href="/categories?filter=cement" onClick={closeMenu} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">Cement & Concrete</Link>
                  <Link href="/categories?filter=roofing" onClick={closeMenu} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">Roofing Materials</Link>
                  <Link href="/categories?filter=plumbing" onClick={closeMenu} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">Plumbing & Pipes</Link>
                  <Link href="/categories?filter=electrical" onClick={closeMenu} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">Electrical & Lighting</Link>
                  <Link href="/categories?filter=tools" onClick={closeMenu} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">Tools & Hardware</Link>
                </div>
              </div>

              {/* Primary Navigation Links */}
              <nav className="flex items-center gap-8 text-sm font-bold text-gray-300 uppercase tracking-wider">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <Link href="/build-and-invest" className="hover:text-white transition-colors">Build & Invest</Link>
                {user && (
                  <Link href="/orders" className="hover:text-white transition-colors">Orders</Link>
                )}

                {/* "More" Dropdown for secondary links */}
                <div className="relative h-full flex items-center group">
                  <button 
                    onClick={() => {
                      setIsMoreOpen(!isMoreOpen);
                      setIsDepartmentsOpen(false);
                    }}
                    className="flex items-center hover:text-white transition-colors uppercase tracking-wider gap-1"
                  >
                    More <ChevronDown size={16} className={`transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  <div 
                    className={`absolute top-full left-0 w-48 bg-white border border-gray-200 shadow-xl rounded-b-xl z-50 flex flex-col py-2 transition-all duration-200 origin-top ${
                      isMoreOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-95'
                    }`}
                  >
                    <Link href="/gallery" onClick={closeMenu} className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">Project Gallery</Link>
                    <Link href="/news" onClick={closeMenu} className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">News & Events</Link>
                    <Link href="/faq" onClick={closeMenu} className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">Help & FAQ</Link>
                    <Link href="/contact" onClick={closeMenu} className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">Contact Support</Link>
                  </div>
                </div>

                {/* Admin Link Check - Updated to include Editor role */}
                {(profile?.role === 'admin' || profile?.role === 'editor') && (
                  <Link href="/admin" className="text-amber-400 hover:text-amber-300 transition-colors">Admin</Link>
                )}
              </nav>
            </div>

          </div>
        </div>
      </header>

      {/* Transparent Overlays to close dropdowns when clicking outside */}
      {(isDepartmentsOpen || isMoreOpen) && (
        <div className="fixed inset-0 z-30" onClick={closeMenu} />
      )}

      {/* Spacer to prevent content from hiding behind the fixed header */}
      <div className="h-[120px] md:h-[128px] w-full shrink-0"></div>

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
             <img src="/logo.png" alt="Logo" className="h-6 object-contain mr-2" />
             <span className="text-base font-black tracking-tight whitespace-nowrap">
               <span className="text-blue-600">MACRO</span> <span className="text-amber-500">HARDWARE</span>
             </span>
          </div>
          <button 
            onClick={closeMenu}
            className="text-2xl leading-none text-gray-400 hover:text-red-500 transition-colors font-bold pb-1"
          >
            &#10005;
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-6 flex flex-col">
          <Link href="/" onClick={closeMenu} className="py-4 text-sm font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors uppercase tracking-wider">
            Home
          </Link>
          <Link href="/build-and-invest" onClick={closeMenu} className="py-4 text-sm font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors uppercase tracking-wider">
            Build & Invest
          </Link>
          <Link href="/categories" onClick={closeMenu} className="py-4 text-sm font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors uppercase tracking-wider">
            Categories
          </Link>

          {/* User Orders Link on Mobile */}
          {user && (
            <Link href="/orders" onClick={closeMenu} className="py-4 text-sm font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors uppercase tracking-wider">
              My Orders
            </Link>
          )}

          <Link href="/gallery" onClick={closeMenu} className="py-4 text-sm font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors uppercase tracking-wider">
            Project Gallery
          </Link>
          <Link href="/news" onClick={closeMenu} className="py-4 text-sm font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors uppercase tracking-wider">
            News & Events
          </Link>
          <Link href="/faq" onClick={closeMenu} className="py-4 text-sm font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors uppercase tracking-wider">
            Help & FAQ
          </Link>
          <Link href="/contact" onClick={closeMenu} className="py-4 text-sm font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors uppercase tracking-wider">
            Contact Us
          </Link>

          {/* Mobile Admin Link - Updated to include Editor role */}
          {(profile?.role === 'admin' || profile?.role === 'editor') && (
            <Link href="/admin" onClick={closeMenu} className="py-4 text-sm font-black text-amber-600 border-b border-gray-50 hover:text-amber-500 transition-colors uppercase tracking-wider">
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
          <Link 
            href={user ? "/profile" : "/login"} 
            onClick={closeMenu} 
            className="flex items-center justify-center w-full bg-slate-900 text-white py-3.5 rounded-none font-bold hover:bg-slate-800 transition-colors shadow-md uppercase tracking-widest text-sm"
          >
            {user ? 'My Account' : 'Login / Register'}
          </Link>
        </div>
      </div>
    </>
  );
}
