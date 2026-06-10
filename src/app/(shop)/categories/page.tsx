// src/app/(shop)/categories/page.tsx
import React from 'react';
import Link from 'next/link';
import { Hammer, Zap, Droplet, ShieldPlus, Wrench, HardHat } from 'lucide-react';

export default function AllCategoriesPage() {
  const categories = [
    { name: 'Cement', slug: 'cement', icon: <HardHat size={40} className="mb-4 text-gray-400 group-hover:text-amber-500 transition-colors" />, desc: 'High-quality Portland and Pozzolana cement.' },
    { name: 'Roofing', slug: 'roofing', icon: <ShieldPlus size={40} className="mb-4 text-gray-400 group-hover:text-blue-500 transition-colors" />, desc: 'Iron sheets, nails, and complete roofing systems.' },
    { name: 'Plumbing', slug: 'plumbing', icon: <Droplet size={40} className="mb-4 text-gray-400 group-hover:text-blue-400 transition-colors" />, desc: 'PVC pipes, fittings, tanks, and bathroom fixtures.' },
    { name: 'Electrical', slug: 'electrical', icon: <Zap size={40} className="mb-4 text-gray-400 group-hover:text-yellow-500 transition-colors" />, desc: 'Wires, switches, conduits, and lighting.' },
    { name: 'Tools', slug: 'tools', icon: <Hammer size={40} className="mb-4 text-gray-400 group-hover:text-red-500 transition-colors" />, desc: 'Hand tools and power tools for every job.' },
    { name: 'Hardware', slug: 'hardware', icon: <Wrench size={40} className="mb-4 text-gray-400 group-hover:text-gray-900 transition-colors" />, desc: 'Nails, hinges, locks, and general fasteners.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Browse by Category</h1>
        <p className="text-gray-600">
          Find exactly what you need for your next construction project. We stock premium materials across all major hardware categories.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link 
            key={cat.slug} 
            href={`/categories/${cat.slug}`}
            className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all group flex flex-col items-center justify-center"
          >
            {cat.icon}
            <h2 className="text-xl font-black text-gray-900 mb-2">{cat.name}</h2>
            <p className="text-sm text-gray-500">{cat.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
