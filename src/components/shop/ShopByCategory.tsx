// src/components/shop/ShopByCategory.tsx
import React from 'react';
import Link from 'next/link';

// Disconnected local array to perfectly control the homepage UI colors and layout
const HOMEPAGE_CATEGORIES = [
  { 
    name: 'Cement', 
    slug: 'cement', 
    image: '/categories/cement.png', 
    bgColor: 'bg-gray-200', // Matches the light gray
  },
  { 
    name: 'Roofing', 
    slug: 'roofing', 
    image: '/categories/roofing.png', 
    bgColor: 'bg-[#EEDBCE]', // Matches the peach/tan
  },
  { 
    name: 'Steel & Mesh', 
    slug: 'steel-and-mesh', 
    image: '/categories/steel.png', 
    bgColor: 'bg-[#9BA8B8]', // Matches the slate blue
  },
  { 
    name: 'Plumbing', 
    slug: 'plumbing', 
    image: '/categories/plumbing.png', 
    bgColor: 'bg-[#5D9DF5]', // Matches the bright blue
  },
  { 
    name: 'Tools', 
    slug: 'tools', 
    image: '/categories/tools.png', 
    bgColor: 'bg-[#F2C5D6]', // Matches the light pink
  },
  { 
    name: 'Materials and Paint', 
    slug: 'hardware', 
    image: '/categories/hardware.png', 
    bgColor: 'bg-[#FAF7C8]', // Matches the pale yellow
  },
];

export default function ShopByCategory() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

      {/* Header with Heading on Left and "View All" Link on Right */}
      <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-2">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Buy by Category
        </h2>
        <Link 
          href="/categories" 
          className="text-sm font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider mb-1"
        >
          View All &rarr;
        </Link>
      </div>

      {/* 2 Rows x 3 Columns on Mobile -> 1 Row x 6 Columns on Desktop */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-8 sm:gap-6">
        {HOMEPAGE_CATEGORIES.map((cat) => (
          <Link 
            key={cat.name} 
            href={`/categories/${cat.slug}`}
            className="flex flex-col items-center group cursor-pointer"
          >
            {/* The Colored Box (Square) */}
            <div className={`w-full aspect-square ${cat.bgColor} relative flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:-translate-y-2 shadow-sm`}>

              {/* The Image 
                w-[120%] and h-[120%] forces the image to be larger than the box.
                absolute positioning lets it break outside the boundaries for that 3D pop effect.
              */}
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute w-[120%] h-[120%] object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-300"
              />

            </div>

            {/* The Text Separated Below */}
            <h3 className="text-[11px] sm:text-sm md:text-base font-black text-gray-900 text-center tracking-tight group-hover:text-blue-600 transition-colors">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>

    </section>
  );
}
