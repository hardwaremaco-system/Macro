// src/components/shop/HeroSection.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-gray-900 text-white pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1580810734898-5e1753f23337?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29uc3RydWN0aW9uJTIwaGFyZHdhcmUlMjBtYXRlcmlhbHN8ZW58MHx8MHx8fDA%3D" 
          alt="Construction Materials Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 max-w-3xl">
          Building the Future of the <span className="text-amber-500">Western Region.</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
          Premium cement, roofing, plumbing, and construction materials delivered directly to your site. Order online and pick at the store with ease.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/categories" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center">
            Shop Materials <ArrowRight size={20} className="ml-2" />
          </Link>
          <Link href="/promotions" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-black text-lg hover:bg-white/20 transition-colors flex items-center justify-center">
            View Special Offers
          </Link>
        </div>
      </div>
    </section>
  );
}
