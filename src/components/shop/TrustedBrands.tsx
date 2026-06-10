// src/components/shop/TrustedBrands.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/client';

export default function TrustedBrands() {
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    async function fetchBrands() {
      const snapshot = await getDocs(collection(db, 'brands'));
      setBrands(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchBrands();
  }, []);

  if (brands.length === 0) return null;

  return (
    <section className="py-8 bg-white border-y border-gray-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Trusted by industry leaders</h3>
      </div>
      
      {/* Inline styles for the infinite marquee animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="w-full overflow-hidden">
        <div className="animate-scroll flex items-center">
          {/* Render the list twice to create a seamless infinite loop */}
          {[...brands, ...brands].map((brand, index) => (
            <div key={`${brand.id}-${index}`} className="flex items-center justify-center w-40 sm:w-56 mx-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
              <img src={brand.logoUrl} alt={brand.name} className="h-12 sm:h-16 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
