// src/components/shop/CategoryRow.tsx
import React from 'react';
import Link from 'next/link';
import { Settings, Droplet, Zap, Hammer, Shield, PaintBucket, Home } from 'lucide-react';

// Hardcoded for now. Later, this will be fetched from Firestore.
const categories = [
  { id: '1', name: 'Cement', icon: Home, color: 'bg-gray-100 text-gray-600' },
  { id: '2', name: 'Roofing', icon: Home, color: 'bg-red-50 text-red-600' },
  { id: '3', name: 'Plumbing', icon: Droplet, color: 'bg-blue-50 text-blue-600' },
  { id: '4', name: 'Electrical', icon: Zap, color: 'bg-yellow-50 text-yellow-600' },
  { id: '5', name: 'Tools', icon: Hammer, color: 'bg-orange-50 text-orange-600' },
  { id: '6', name: 'Paints', icon: PaintBucket, color: 'bg-purple-50 text-purple-600' },
  { id: '7', name: 'Safety', icon: Shield, color: 'bg-emerald-50 text-emerald-600' },
  { id: '8', name: 'Hardware', icon: Settings, color: 'bg-slate-50 text-slate-600' },
];

export default function CategoryRow() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-gray-900">Top Categories</h2>
        <Link href="/categories" className="text-sm font-bold text-blue-600 hover:underline">
          See All
        </Link>
      </div>
      
      {/* Horizontal scroll container with hidden scrollbar for smooth mobile swiping */}
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link 
              href={`/categories/${category.name.toLowerCase()}`} 
              key={category.id}
              className="flex flex-col items-center gap-2 min-w-[80px] snap-start"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 ${category.color}`}>
                <Icon size={28} strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
