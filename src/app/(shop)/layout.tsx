// src/app/(shop)/layout.tsx
import React from 'react';
import Header from '@/components/shop/Header';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Customer Top Alert Notification Banner */}
      <div className="bg-blue-900 text-white text-center py-2 px-4 text-xs font-medium tracking-wide">
        📦 Same-day store pick-up & region-wide delivery services available!
      </div>

      {/* The Dynamic Navigation & Cart Header */}
      <Header />

      {/* Dynamic Content Mount point */}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>

      {/* Global Structural Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">MACRO HARDWARE</h3>
            <p className="text-xs leading-relaxed">Your trusted partner in building and construction. Supplying top-quality materials across the region.</p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">Quick Links</h4>
            <ul className="text-xs space-y-2">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">Legal</h4>
            <ul className="text-xs space-y-2">
              <li><a href="/terms" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">Contact Info</h4>
            <ul className="text-xs space-y-3">
              <li className="flex items-start"><span className="mr-2">📍</span> Kabale, Western Region, Uganda</li>
              <li className="flex items-center"><span className="mr-2">📞</span> +256 700 000 000</li>
              <li className="flex items-center"><span className="mr-2">✉️</span> info@macrohardware.com</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-gray-800 text-center text-xs">
          <p>© {new Date().getFullYear()} Macro Hardware Engine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
