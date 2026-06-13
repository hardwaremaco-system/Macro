import React from 'react';
import dynamic from 'next/dynamic';

import HeroSection from '../../components/shop/HeroSection';

const FeaturedProducts = dynamic(() => import('../../components/shop/FeaturedProducts'));
const ShopByCategory = dynamic(() => import('../../components/shop/ShopByCategory'));
const TrustedBrands = dynamic(() => import('../../components/shop/TrustedBrands'));
const Testimonials = dynamic(() => import('../../components/shop/Testimonials'));
const LatestProducts = dynamic(() => import('../../components/shop/LatestProducts'));
const BuildAndInvestBanner = dynamic(() => import('../../components/shop/BuildAndInvestBanner'));
const NewsEventsPreview = dynamic(() => import('../../components/shop/NewsEventsPreview'));

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeroSection />
<div className="bg-white border-y border-gray-200">
        <ShopByCategory />
      </div>


      <FeaturedProducts />

      
      <TrustedBrands />

      <Testimonials />

      <LatestProducts />

      <div className="bg-white border-b border-gray-200">
        <BuildAndInvestBanner />
      </div>

      <div className="py-8 bg-gray-50">
        <NewsEventsPreview />
      </div>
    </div>
  );
}
