// src/app/(shop)/page.tsx
import React from 'react';
import dynamic from 'next/dynamic';

// 1. INSTANT IMPORT (Above the fold)
// We keep the Hero Section as a standard import so it loads instantly 
// the millisecond the user visits the site. This is crucial for a fast-feeling website.
import HeroSection from '../../components/shop/HeroSection';

// 2. DYNAMIC IMPORTS (Below the fold)
// Next.js will code-split these and load them in the background.
// They won't block the initial page load anymore!
const TrustedBrands = dynamic(() => import('../../components/shop/TrustedBrands'));
const FeaturedProducts = dynamic(() => import('../../components/shop/FeaturedProducts'));
const ShopByCategory = dynamic(() => import('../../components/shop/ShopByCategory'));
const LatestProducts = dynamic(() => import('../../components/shop/LatestProducts'));
const NewsEventsPreview = dynamic(() => import('../../components/shop/NewsEventsPreview'));
const Testimonials = dynamic(() => import('../../components/shop/Testimonials'));
const BuildAndInvestBanner = dynamic(() => import('../../components/shop/BuildAndInvestBanner'));

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* 1. HERO SECTION (Loads instantly) */}
      <HeroSection />

      {/* 2. SHOP BY CATEGORY */}
      <div className="bg-white border-y border-gray-200">
        <ShopByCategory />
      </div>

      {/* 3. FEATURED PRODUCTS */}
      {/* (Will show the 5 animated wave skeletons while Firestore fetches data) */}
      <FeaturedProducts />

      {/* 4. BUILD & INVEST BANNER (New Service Promotion) */}
      <div className="bg-white border-b border-gray-200">
        <BuildAndInvestBanner />
      </div>

      {/* 5. TRUSTED BRANDS SCROLLER */}
      <TrustedBrands />

      {/* 6. LATEST ADDED PRODUCTS */}
      {/* (Will also show the 5 animated wave skeletons independently) */}
      <LatestProducts />

      {/* 7. NEWS & EVENTS */}
      <div className="py-8 bg-gray-50">
        <NewsEventsPreview />
      </div>

      {/* 8. TESTIMONIALS */}
      <Testimonials />

    </div>
  );
}
