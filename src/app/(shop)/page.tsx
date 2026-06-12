// src/app/(shop)/page.tsx
import React from 'react';
import dynamic from 'next/dynamic';

// 1. INSTANT IMPORTS (Above the fold)
// Both the Hero Section and Trusted Brands are visible immediately, 
// so we load them instantly to prevent any layout shift or visual popping.
import HeroSection from '../../components/shop/HeroSection';
import TrustedBrands from '../../components/shop/TrustedBrands';

// 2. DYNAMIC IMPORTS (Below the fold)
// Next.js will code-split these and load them in the background.
const FeaturedProducts = dynamic(() => import('../../components/shop/FeaturedProducts'));
const ShopByCategory = dynamic(() => import('../../components/shop/ShopByCategory'));
const LatestProducts = dynamic(() => import('../../components/shop/LatestProducts'));
const NewsEventsPreview = dynamic(() => import('../../components/shop/NewsEventsPreview'));
const Testimonials = dynamic(() => import('../../components/shop/Testimonials'));

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* 1. HERO SECTION (Loads instantly) */}
      <HeroSection />

      {/* 2. TRUSTED BRANDS SCROLLER (Now loads instantly alongside the Hero) */}
      <TrustedBrands />

      {/* 3. FEATURED PRODUCTS */}
      {/* (Will show the 5 animated wave skeletons while Firestore fetches data) */}
      <FeaturedProducts />

      {/* 4. SHOP BY CATEGORY */}
      <div className="bg-white border-y border-gray-200">
        <ShopByCategory />
      </div>

      {/* 5. LATEST ADDED PRODUCTS */}
      {/* (Will also show the 5 animated wave skeletons independently) */}
      <LatestProducts />

      {/* 6. NEWS & EVENTS */}
      <div className="py-8 bg-gray-50">
        <NewsEventsPreview />
      </div>

      {/* 7. TESTIMONIALS */}
      <Testimonials />

    </div>
  );
}
