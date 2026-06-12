// src/components/shop/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Strict relative paths
import { useCartStore } from '../../store/useCartStore';
import { useAuth } from '../../context/AuthContext';
import GlobalSearch from './GlobalSearch';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(false);

  const cartCount = useCartStore((state) => state.getCartCount());
  const { user, profile } = useAuth(); 

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
        {/* --- TIER 1: Main Header (Logo, Search, Links) --- */}
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

            {/* Right: User, Cart & Mobile Hamburger (Text Based) */}
            <div className="flex items-center space-x-6 md:space-x-8 text-gray-900">
              <Link 
                href={user ? "/profile" : "/login"} 
                className="hidden md:block text-sm font-bold hover:text-blue-600 transition-colors tracking-wide uppercase"
              >
                {user ? 'Account' : 'Login'}
              </Link>

              <Link 
                href="/cart" 
                className="text-sm font-bold hover:text-blue-600 transition-colors tracking-wide uppercase flex items-center"
              >
                Cart ({cartCount})
              </Link>

              {/* Mobile Hamburger Menu */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden text-2xl leading-none font-bold text-gray-900 hover:text-blue-600 transition-colors pb-1"
                aria-label="Open Menu"
              >
                &#9776; {/* Standard Unicode Hamburger Menu */}
              </button>
            </div>
          </div>

          {/* Mobile Global Search (Underneath Logo/Icons) */}
          <div className="md:hidden pb-4">
            <GlobalSearch />
          </div>
        </div>

        {/* --- TIER 2: Desktop Navigation Bar (Categories Dropdown + Links) --- */}
        <div className="hidden md:block bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-12 flex items-center justify-between">

            <div className="flex items-center gap-8 h-full">
              {/* "All Departments" Click Dropdown */}
              <div className="relative h-full flex items-center">
                <button 
                  onClick={() => setIsDepartmentsOpen(!isDepartmentsOpen)}
                  className="flex items-center gap-2 font-bold text-white hover:text-amber-400 transition-colors h-full px-2 uppercase text-sm tracking-wider"
                >
                  &#9776; All Departments
                  <span className={`text-[10px] ml-1 transition-transform duration-200 ${isDepartmentsOpen ? 'rotate-180' : ''}`}>
                    &#9660; {/* Downward Triangle */}
                  </span>
                </button>

                {/* Transparent Overlay to close dropdown when clicking outside */}
                {isDepartmentsOpen && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDepartmentsOpen(false)}
                  />
                )}

                {/* Dropdown Menu Box */}
                <div 
                  className={`absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-xl rounded-b-xl z-50 flex flex-col py-2 transition-all duration-200 origin-top ${
                    isDepartmentsOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-95'
                  }`}
                >
                  <Link href="/categories" onClick={() => setIsDepartmentsOpen(false)} className="px-5 py-3 text-sm font-black text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors uppercase tracking-wider">
                    Browse All Categories
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link href="/categories?filter=cement" onClick={() => setIsDepartmentsOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">Cement & Concrete</Link>
                  <Link href="/categories?filter=roofing" onClick={() => setIsDepartmentsOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">Roofing Materials</Link>
                  <Link href="/categories?filter=plumbing" onClick={() => setIsDepartmentsOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">Plumbing & Pipes</Link>
                  <Link href="/categories?filter=electrical" onClick={() => setIsDepartmentsOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">Electrical & Lighting</Link>
                  <Link href="/categories?filter=tools" onClick={() => setIsDepartmentsOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors">Tools & Hardware</Link>
                </div>
              </div>

              {/* Inline Navigation Links */}
              <nav className="flex items-center gap-8 text-sm font-bold text-gray-200 uppercase tracking-wider">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <Link href="/build-and-invest" className="hover:text-white transition-colors">Build & Invest</Link>
                <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
                <Link href="/news" className="hover:text-white transition-colors">News & Events</Link>
                <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>

                {/* Admin Link Check */}
                {profile?.role === 'admin' && (
                  <Link href="/admin" className="hover:text-white transition-colors">Admin Panel</Link>
                )}
              </nav>
            </div>

            {/* Right side support link */}
            <Link href="/contact" className="text-sm font-bold text-gray-200 hover:text-white transition-colors uppercase tracking-wider">
              Support
            </Link>

          </div>
        </div>
      </header>

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
            &#10005; {/* Standard Unicode X mark */}
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
            All Categories
          </Link>
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

          {/* Mobile Admin Link Check */}
          {profile?.role === 'admin' && (
            <Link href="/admin" onClick={closeMenu} className="py-4 text-sm font-black text-gray-900 border-b border-gray-50 hover:text-blue-600 transition-colors uppercase tracking-wider">
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
          <Link 
            href={user ? "/profile" : "/login"} 
            onClick={closeMenu} 
            className="flex items-center justify-center w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-md uppercase tracking-widest text-sm"
          >
            {user ? 'My Account' : 'Login / Register'}
          </Link>
        </div>
      </div>
    </>
  );
}
