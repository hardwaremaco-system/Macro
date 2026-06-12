// src/components/shop/HeroSection.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-gray-900 text-white pt-10 pb-12 sm:pt-20 sm:pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="/macro.png" 
          alt="Construction Materials Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 via-gray-900/10 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4 sm:mb-6 max-w-3xl">
          Building the Future of the <span className="text-amber-500">Western Region.</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-300 mb-2 sm:mb-10 max-w-2xl leading-relaxed">
          Premium paint, cement, roofing, plumbing, and construction materials. Order online and pick at the store with ease.
        </p>

        <div className="hidden sm:flex flex-row gap-4 w-auto">
          <Link href="/products" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center">
            Shop Materials <ArrowRight size={20} className="ml-2" />
          </Link>
          <Link href="/news" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-black text-lg hover:bg-white/20 transition-colors flex items-center justify-center">
            Read The News
          </Link>
        </div>
      </div>
    </section>
  );
}
