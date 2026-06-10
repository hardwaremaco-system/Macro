// src/app/(shop)/promotions/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Tag, ArrowRight } from 'lucide-react';
// Strict relative path
import { db } from '../../../lib/firebase/client';

export default function PublicPromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPromotions() {
      try {
        const q = query(collection(db, 'promotions'), where('isActive', '==', true));
        const snapshot = await getDocs(q);
        const promos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        promos.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        setPromotions(promos);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPromotions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 flex items-center justify-center">
          <Tag className="mr-3 text-amber-500" size={36} /> Special Offers
        </h1>
        <p className="text-gray-600">
          Take advantage of our current discounts and flash sales on premium building materials. Check back often as our offers change frequently!
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <Tag size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No active promotions right now</h3>
          <p className="text-gray-500 mb-6">Our next big sale is right around the corner!</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {promotions.map((promo) => (
            <div key={promo.id} className="relative rounded-2xl overflow-hidden shadow-md group min-h-[300px] flex items-center bg-gray-900">
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="relative z-10 p-8 md:p-12 w-full md:w-5/6">
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
                  {promo.title}
                </h3>
                <p className="text-gray-200 text-sm sm:text-base mb-6">
                  {promo.description}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link href={promo.buttonLink || '/'} className="bg-amber-500 text-white px-6 py-3 rounded-lg text-sm font-black uppercase tracking-wider hover:bg-amber-600 transition-colors shadow-sm flex items-center">
                    {promo.buttonText || 'Shop Now'} <ArrowRight size={16} className="ml-2" />
                  </Link>
                  {promo.discountCode && (
                    <div className="border border-dashed border-white bg-black/40 text-white px-4 py-2.5 rounded-lg text-sm font-mono font-bold backdrop-blur-sm">
                      CODE: {promo.discountCode}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
