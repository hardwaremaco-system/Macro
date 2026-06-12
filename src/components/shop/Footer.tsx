// src/components/shop/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-white text-gray-600 pt-8 md:pt-16 pb-4 md:pb-8 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Layout: Stack on mobile, Grid on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-4 gap-6 md:gap-12 mb-6 md:mb-12">

          {/* 1. Brand Info & Description (Always First) */}
          <div className="order-1">
            <Link href="/" className="flex items-center mb-3 md:mb-6">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-8 md:h-10 object-contain mr-3" 
              />
              <span className="text-xl font-black tracking-tight text-gray-900">
                MACRO <span className="text-amber-500">HARDWARE</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed mb-1 md:mb-6">
              Your trusted partner for premium building materials, construction supplies, and hardware in the Western Region.
            </p>
            {/* Social Icons - Hidden on Mobile to save space */}
            <div className="hidden md:flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-400 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* 2. Mobile-Only Links (Stacked uniformly, light blue underline) */}
          <div className="order-2 md:hidden flex flex-col space-y-3 text-sm">
            <Link href="/profile" className="text-gray-600 underline decoration-blue-300 underline-offset-4 hover:text-blue-600">
              My Account
            </Link>
            <Link href="/contact" className="text-gray-600 underline decoration-blue-300 underline-offset-4 hover:text-blue-600">
              Contact Us
            </Link>
            <Link href="/terms" className="text-gray-600 underline decoration-blue-300 underline-offset-4 hover:text-blue-600">
              Terms & Conditions
            </Link>
          </div>

          {/* 2. Desktop-Only Quick Links */}
          <div className="hidden md:block order-2">
            <h3 className="text-gray-900 font-black mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
              <li><Link href="/profile" className="hover:text-blue-600 transition-colors">My Account</Link></li>
              <li><Link href="/gallery" className="hover:text-blue-600 transition-colors">Project Gallery</Link></li>
              <li><Link href="/news" className="hover:text-blue-600 transition-colors">News & Events</Link></li>
            </ul>
          </div>

          {/* 3. Desktop-Only Customer Service */}
          <div className="hidden md:block order-3">
            <h3 className="text-gray-900 font-black mb-4 uppercase tracking-wider text-sm">Customer Service</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-blue-600 transition-colors">FAQs</Link></li>
              <li><Link href="/delivery" className="hover:text-blue-600 transition-colors">Delivery Information</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* 4. Contact Details (Placed after links on mobile, uniform text, no icons, no line breaks) */}
          <div className="order-3 md:order-4 flex flex-col space-y-3 text-sm text-gray-600 mt-2 md:mt-0">
            <h3 className="hidden md:block text-gray-900 font-black mb-1 uppercase tracking-wider text-sm">Contact Us</h3>
            <div>Kabale Town, Western Region, Uganda</div>
            <div>+256 700 000 000</div>
            {/* Email hidden on mobile to keep it essential */}
            <div className="hidden md:block">support@macrohardware.com</div>
          </div>

        </div>

        {/* Footer Bottom: Reduced whitespace, uniform tracking */}
        <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 font-medium text-center md:text-left">
          <p className="tracking-wide">&copy; {currentYear} Macro Hardware. All rights reserved.</p>
          
          {/* Badges - Hidden on Mobile */}
          <div className="hidden md:flex space-x-4 mt-4 md:mt-0">
            <span>Secure Payments</span>
            <span>Fast Delivery</span>
            <span>Genuine Products</span>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
