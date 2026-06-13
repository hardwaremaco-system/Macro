// src/components/shop/Footer.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
// Strict relative path
import { db } from '../../lib/firebase/client';

export default function Footer() {
  const currentYear = new Date().getFullYear(); // Automatically updates the year!

  const [socials, setSocials] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    tiktok: '',
  });

  useEffect(() => {
    async function fetchSocials() {
      try {
        const settingsRef = doc(db, 'settings', 'global');
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists() && settingsSnap.data().socials) {
          setSocials(settingsSnap.data().socials);
        }
      } catch (error) {
        console.error("Failed to load footer socials:", error);
      }
    }
    fetchSocials();
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-400 pt-8 md:pt-16 pb-6 md:pb-8 border-t border-slate-800 mt-auto">
      {/* Dark Slate Background: #0f172a */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Layout: Stack on mobile, Grid on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">

          {/* 1. Brand Info & Description */}
          <div className="order-1">
            <Link href="/" className="flex items-center mb-4 md:mb-6">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-8 md:h-10 object-contain mr-3" 
              />
              <span className="text-xl font-black tracking-tight whitespace-nowrap">
                {/* White and Orange for high contrast on dark background */}
                <span className="text-white font-black">MACRO</span> <span className="text-orange-500 font-black">HARDWARE</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Your trusted partner for premium building materials, construction supplies, and hardware in the Western Region.
            </p>

            {/* Social Icons - Industrial blocky look (rounded-lg instead of full circles) */}
            <div className="flex space-x-3">
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-slate-900 transition-colors shadow-sm">
                  <Facebook size={18} />
                </a>
              )}

              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-slate-900 transition-colors shadow-sm">
                  <Twitter size={18} />
                </a>
              )}

              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-slate-900 transition-colors shadow-sm">
                  <Instagram size={18} />
                </a>
              )}

              {socials.tiktok && (
                <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-slate-900 transition-colors shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="order-2">
            <h3 className="text-white font-black mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
              <li><Link href="/build-and-invest" className="hover:text-orange-500 transition-colors">Build & Invest</Link></li>
              <li><Link href="/profile" className="hover:text-orange-500 transition-colors">My Account</Link></li>
              <li><Link href="/gallery" className="hover:text-orange-500 transition-colors">Project Gallery</Link></li>
              <li><Link href="/news" className="hover:text-orange-500 transition-colors">News & Events</Link></li>
            </ul>
          </div>

          {/* 3. Customer Service */}
          <div className="order-3">
            <h3 className="text-white font-black mb-4 uppercase tracking-wider text-sm">Customer Service</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-orange-500 transition-colors">FAQs</Link></li>
              <li><Link href="/delivery" className="hover:text-orange-500 transition-colors">Delivery Information</Link></li>
              <li><Link href="/terms" className="hover:text-orange-500 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* 4. Contact Details */}
          <div className="order-4 flex flex-col space-y-3 text-sm text-slate-400">
            <h3 className="text-white font-black mb-1 uppercase tracking-wider text-sm">Contact Us</h3>
            <div className="hover:text-orange-500 transition-colors cursor-default">Kabale Town, Western Region, Uganda</div>
            <a href="tel:0778522222" className="hover:text-orange-500 transition-colors font-bold">0778522222</a>
            <a href="mailto:cs@macrohardwarekabale.com" className="hover:text-orange-500 transition-colors font-bold">cs@macrohardwarekabale.com</a>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-medium text-center md:text-left gap-4">
          <p className="tracking-wide">
            &copy; {currentYear} <strong className="font-black text-white">Macro Hardware</strong>. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <span className="hover:text-orange-500 transition-colors cursor-pointer">Secure Payments</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="hover:text-orange-500 transition-colors cursor-pointer">Fast Delivery</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="hover:text-orange-500 transition-colors cursor-pointer">Genuine Products</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
