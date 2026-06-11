// src/components/shop/TrustedBrands.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
// Import Swiper core styles
import 'swiper/css';
// Strict relative path
import { db } from '../../lib/firebase/client';

export default function TrustedBrands() {
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const snapshot = await getDocs(collection(db, 'brands'));
        setBrands(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    }
    fetchBrands();
  }, []);

  if (brands.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        {/* Colored Heading */}
        <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest">
          Trusted by Industry Leaders
        </h3>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          slidesPerGroup={1} // Swipes exactly one card at a time
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            480: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 24 },
            1024: { slidesPerView: 5, spaceBetween: 32 },
            1280: { slidesPerView: 6, spaceBetween: 32 },
          }}
          className="w-full pb-2"
        >
          {brands.map((brand, index) => (
            <SwiperSlide key={`${brand.id}-${index}`}>
              {/* Individual Rectangle Backgrounds with full color */}
              <div className="flex items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl p-4 sm:p-6 h-28 sm:h-32 hover:bg-white hover:shadow-md hover:border-blue-100 transition-all duration-300 cursor-pointer">
                <img 
                  src={brand.logoUrl} 
                  alt={brand.name} 
                  className="max-h-16 w-full object-contain" 
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
