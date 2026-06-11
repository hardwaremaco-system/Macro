// src/app/(shop)/categories/page.tsx
import React from 'react';
import Link from 'next/link';
// Strict relative path to the central file
import { STORE_CATEGORIES } from '../../../lib/categories';

export default function AllCategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Browse by Category</h1>
        <p className="text-gray-600">
          Find exactly what you need for your next construction project. We stock premium materials across all major hardware categories.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {STORE_CATEGORIES.map((category) => (
          <Link 
            key={category.slug} 
            href={`/categories/${category.slug}`}
            className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-lg hover:border-blue-300 transition-all group flex flex-col items-center justify-center"
          >
            {/* Transparent Category Image */}
            <div className="w-20 h-20 mb-4 relative z-10">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-1">{category.name}</h2>
            <p className="text-xs text-gray-500 line-clamp-2">{category.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
