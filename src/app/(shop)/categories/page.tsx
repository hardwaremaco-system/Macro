// src/app/(shop)/categories/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
// Strict relative path to the central file
import { STORE_CATEGORIES } from '../../../lib/categories';

export default function AllCategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Modern Hero Section with Blurred Background */}
      <div className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1763950865631-4ca11bebe017?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0ZWVsJTIwcHJvZHVjdHN8ZW58MHx8MHx8fDA%3D" 
            alt="Hardware Background" 
            className="w-full h-full object-cover blur-sm scale-105"
          />
          {/* Dark gradient overlay to ensure the white text is readable */}
          <div className="absolute inset-0 bg-gray-900/70"></div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Browse by Category
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">
            Find exactly what you need for your next construction project. We stock premium materials across all major hardware categories.
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-30px] sm:mt-[-40px] relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {STORE_CATEGORIES.map((category) => (
            <Link 
              key={category.slug} 
              href={`/categories/${category.slug}`}
              className="group bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle top accent line on hover */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Floating Image Container */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 p-5 border border-gray-100 shadow-inner">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Text Content */}
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
                {category.name}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-8 flex-grow leading-relaxed px-2">
                {category.desc}
              </p>

              {/* Action Button */}
              <div className="mt-auto w-full flex items-center justify-center text-sm font-bold text-blue-600 bg-blue-50 py-3.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                Explore Items <ArrowRight size={18} className="ml-2" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
