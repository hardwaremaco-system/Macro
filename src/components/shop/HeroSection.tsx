// src/components/shop/HeroSection.tsx
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Placeholder data for our banners (In the future, this will be fetched from Firestore)
const banners = [
  { id: 1, title: 'Massive Cement Sale', bg: 'bg-blue-600', img: '🧱' },
  { id: 2, title: 'New Roofing Sheets', bg: 'bg-red-600', img: '🏠' },
  { id: 3, title: 'Plumbing Essentials', bg: 'bg-emerald-600', img: '🚰' },
];

export default function HeroSection() {
  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pt-4">
      {/* MOBILE VIEW: Swiper Carousel (Hidden on medium screens and up) */}
      <div className="block md:hidden">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="w-full h-[200px] rounded-none sm:rounded-xl"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className={`w-full h-full ${banner.bg} flex items-center justify-center text-white text-3xl font-bold p-6`}>
                <span className="mr-4 text-5xl">{banner.img}</span>
                {banner.title}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* DESKTOP VIEW: Bento Grid (Hidden on mobile) */}
      <div className="hidden md:grid grid-cols-3 gap-4 h-[400px]">
        {/* Main large banner */}
        <div className={`col-span-2 rounded-xl overflow-hidden ${banners[0].bg} flex flex-col justify-center p-12 text-white shadow-sm hover:shadow-md transition-shadow`}>
          <span className="text-7xl mb-4">{banners[0].img}</span>
          <h2 className="text-4xl font-black mb-2">{banners[0].title}</h2>
          <p className="text-blue-100">Premium quality for your construction needs.</p>
        </div>
        
        {/* Side stacked banners */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className={`flex-1 rounded-xl overflow-hidden ${banners[1].bg} flex items-center p-6 text-white shadow-sm hover:shadow-md transition-shadow`}>
             <span className="text-4xl mr-4">{banners[1].img}</span>
             <h3 className="text-xl font-bold">{banners[1].title}</h3>
          </div>
          <div className={`flex-1 rounded-xl overflow-hidden ${banners[2].bg} flex items-center p-6 text-white shadow-sm hover:shadow-md transition-shadow`}>
             <span className="text-4xl mr-4">{banners[2].img}</span>
             <h3 className="text-xl font-bold">{banners[2].title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
