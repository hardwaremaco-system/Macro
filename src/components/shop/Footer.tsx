// src/components/shop/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-600 pt-16 pb-8 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div>
            <Link href="/" className="flex items-center mb-6">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-8 md:h-10 object-contain mr-3" 
              />
              <span className="text-xl font-black tracking-tight text-gray-900">
                MACRO <span className="text-amber-500">HARDWARE</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Your trusted partner for premium building materials, construction supplies, and hardware in the Western Region.
            </p>
            <div className="flex space-x-3">
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

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-black mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-blue-600 font-medium transition-colors">Home</Link></li>
              <li><Link href="/promotions" className="hover:text-blue-600 font-medium transition-colors">Special Offers</Link></li>
              <li><Link href="/gallery" className="hover:text-blue-600 font-medium transition-colors">Project Gallery</Link></li>
              <li><Link href="/news" className="hover:text-blue-600 font-medium transition-colors">News & Events</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-gray-900 font-black mb-4 uppercase tracking-wider text-sm">Customer Service</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/contact" className="hover:text-blue-600 font-medium transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-blue-600 font-medium transition-colors">FAQs</Link></li>
              <li><Link href="/shipping" className="hover:text-blue-600 font-medium transition-colors">Delivery Information</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 font-medium transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-gray-900 font-black mb-4 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>Kabale Town, Western Region,<br/>Uganda</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-amber-500 flex-shrink-0" />
                <span>+256 700 000 000</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-amber-500 flex-shrink-0" />
                <span>support@macrohardware.com</span>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 font-medium">
          <p>&copy; {currentYear} Macro Hardware. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span>Secure Payments</span>
            <span>Fast Delivery</span>
            <span>Genuine Products</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
