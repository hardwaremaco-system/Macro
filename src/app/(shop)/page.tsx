// src/app/(shop)/page.tsx
import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

// Strict relative imports for all our dynamic components
import PromotionsBanner from '../../components/shop/PromotionsBanner';
import LatestProducts from '../../components/shop/LatestProducts';
import NewsEventsPreview from '../../components/shop/NewsEventsPreview';
import TrustedBrands from '../../components/shop/TrustedBrands';
import Testimonials from '../../components/shop/Testimonials';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* 1. HERO SECTION (Cleaned up, Search Removed) */}
      <section className="relative bg-gray-900 text-white pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1541888086225-eb9533f81156?q=80&w=2070&auto=format&fit=crop" 
            alt="Construction Materials Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 max-w-3xl">
            Building the Future of the <span className="text-amber-500">Western Region.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
            Premium cement, roofing, plumbing, and electrical materials delivered directly to your site. Order online and pay on delivery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/categories" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center">
              Shop Materials <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link href="/promotions" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-black text-lg hover:bg-white/20 transition-colors flex items-center justify-center">
              View Special Offers
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PROMOTIONS BANNER (Hidden if empty) */}
      <PromotionsBanner />

      {/* 3. LATEST ADDED PRODUCTS */}
      <LatestProducts />

      {/* 4. NEWS & EVENTS */}
      <div className="bg-white border-y border-gray-200 py-8">
        <NewsEventsPreview />
      </div>

      {/* 5. TESTIMONIALS */}
      <Testimonials />

      {/* 6. TRUSTED BRANDS SCROLLER */}
      <TrustedBrands />

      {/* 7. LIVE MAP & LOCATION SECTION (Replaces old CTA) */}
      <section className="bg-white py-16 lg:py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Text & Details Context */}
            <div>
              <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6">
                <MapPin size={14} className="mr-1.5" /> Visit Our Store
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-6">
                Locate us in the heart of Kabale.
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Prefer to view your materials in person before making a bulk order? Visit our physical hardware branch. Our experts are on standby to help you calculate your material estimates.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-gray-100 p-3 rounded-lg mr-4">
                    <MapPin className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Physical Address</h4>
                    <p className="text-gray-600">Main Street, Kabale Town, Uganda</p>
                  </div>
                </div>
              </div>
            </div>

                        {/* Interactive Google Map Embedded */}
            <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative group">
              <iframe
                src="https://maps.app.goo.gl/8BkGudV5rNpvXmQ9A"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
              ></iframe>
            </div>


          </div>
        </div>
      </section>

    </div>
  );
}
