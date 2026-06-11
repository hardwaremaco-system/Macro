// src/components/shop/ShopByCategory.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
// Strict relative path to the central file
import { STORE_CATEGORIES } from '../../lib/categories';

export default function ShopByCategory() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Shop by Category</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our extensive inventory of premium building materials, structured to help you find exactly what you need for your project.
        </p>
      </div>

      {/* 2 Rows x 3 Columns Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
        {STORE_CATEGORIES.map((category) => (
          <Link 
            key={category.slug} 
            href={`/categories/${category.slug}`}
            className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col items-center justify-center relative overflow-hidden"
          >
            {/* Transparent Product Photo */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 mb-4 relative z-10">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-1 relative z-10 group-hover:text-blue-600 transition-colors">
              {category.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 relative z-10 hidden sm:block">
              {category.desc}
            </p>
            
            {/* Subtle background highlight on hover */}
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
          </Link>
        ))}
      </div>

      {/* View All Products Button */}
      <div className="flex justify-center">
        <Link 
          href="/categories" 
          className="bg-gray-900 text-white px-8 py-3.5 rounded-lg font-black hover:bg-gray-800 transition-colors flex items-center shadow-md"
        >
          View all products <ArrowRight size={18} className="ml-2" />
        </Link>
      </div>
    </section>
  );
}
