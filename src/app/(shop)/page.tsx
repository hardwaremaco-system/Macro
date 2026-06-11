// src/app/(shop)/page.tsx
import React from 'react';

// Strict relative imports for all our dynamic components
import HeroSection from '../../components/shop/HeroSection';
import PromotionsBanner from '../../components/shop/PromotionsBanner';
import LatestProducts from '../../components/shop/LatestProducts';
import ShopByCategory from '../../components/shop/ShopByCategory';
import FeaturedProducts from '../../components/shop/FeaturedProducts';
import NewsEventsPreview from '../../components/shop/NewsEventsPreview';
import TrustedBrands from '../../components/shop/TrustedBrands';
import Testimonials from '../../components/shop/Testimonials';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* 1. HERO SECTION */}
      <HeroSection />
{/* 7. TRUSTED BRANDS SCROLLER */}
      <TrustedBrands />

{/* 4. FEATURED PRODUCTS (Controlled by Admin Panel) */}
      <FeaturedProducts />

{/* 4. SHOP BY CATEGORY (2x3 Grid with Transparent Photos) */}
      <div className="bg-white border-y border-gray-200">
        <ShopByCategory />
      </div>

      {/* 2. PROMOTIONS BANNER */}
      <PromotionsBanner />



      {/* 3. LATEST ADDED PRODUCTS */}
      <LatestProducts />

      

      {/* 5. NEWS & EVENTS */}
      <div className="py-8 bg-gray-50">
        <NewsEventsPreview />
      </div>

      {/* 6. TESTIMONIALS */}
      <Testimonials />

      
      

    </div>
  );
}
