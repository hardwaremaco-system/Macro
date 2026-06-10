// src/app/(shop)/page.tsx
import React from 'react';
import HeroSection from '@/components/shop/HeroSection';
import TrustStrip from '@/components/shop/TrustStrip';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* 1. Hero Banner Slider / Bento */}
      <HeroSection />

      {/* 2. Product Search Bar (Mobile focus - Desktop will have it in the header) */}
      <div className="md:hidden px-4">
        <div className="bg-white border border-gray-200 rounded-lg p-2 flex items-center shadow-sm">
          <span className="text-gray-400 mx-2">🔍</span>
          <input 
            type="text" 
            placeholder="Search products, brands, and categories..." 
            className="w-full outline-none text-sm bg-transparent"
          />
        </div>
      </div>

      {/* 3. Trust Strip */}
      <TrustStrip />

      {/* 4. Product Categories (Placeholder) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-xl font-black text-gray-900 mb-4">Top Categories</h2>
        <div className="h-32 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 border border-dashed border-gray-300">
          [Categories Component Pending]
        </div>
      </section>

      {/* 5. Featured Products (Placeholder) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-xl font-black text-gray-900 mb-4">Featured Products</h2>
        <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 border border-dashed border-gray-300">
          [Product Grid Component Pending]
        </div>
      </section>

    </div>
  );
}
