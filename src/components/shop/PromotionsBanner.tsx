// src/components/shop/PromotionsBanner.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Tag } from 'lucide-react';
// Strict relative path
import { db } from '../../lib/firebase/client';

export default function PromotionsBanner() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivePromotions() {
      try {
        const q = query(
          collection(db, 'promotions'), 
          where('isActive', '==', true),
          // orderBy('createdAt', 'desc') // Note: Firestore requires a composite index to use where() and orderBy() together. For simplicity, we fetch active and sort locally if needed.
        );
        const snapshot = await getDocs(q);
        const promos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort locally to avoid needing immediate Firestore Index creation
        promos.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        
        setPromotions(promos);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivePromotions();
  }, []);

  if (loading) return null; // Hide while loading
  if (promotions.length === 0) return null; // Hide section entirely if no active promotions

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {promotions.slice(0, 2).map((promo) => ( // Display up to 2 active promotions
          <div key={promo.id} className="relative rounded-2xl overflow-hidden shadow-sm group min-h-[200px] sm:min-h-[250px] flex items-center bg-gray-900">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <img 
                src={promo.image} 
                alt={promo.title} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity duration-300"
              />
            </div>
            
            {/* Content Overlay */}
            <div className="relative z-10 p-6 sm:p-8 w-full md:w-3/4">
              <div className="flex items-center text-amber-400 text-xs font-black uppercase tracking-widest mb-2">
                <Tag size={14} className="mr-1" /> Special Offer
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                {promo.title}
              </h3>
              <p className="text-gray-200 text-sm mb-4 line-clamp-2">
                {promo.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-3">
                <Link href={promo.buttonLink || '/categories'} className="bg-white text-gray-900 px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors shadow-sm">
                  {promo.buttonText || 'Shop Now'}
                </Link>
                {promo.discountCode && (
                  <div className="border border-dashed border-amber-400 bg-black/30 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-mono font-bold backdrop-blur-sm">
                    CODE: {promo.discountCode}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
