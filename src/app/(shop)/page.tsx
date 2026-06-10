// src/app/(shop)/page.tsx
import React from 'react';
import Link from 'next/link';
import HeroSection from '@/components/shop/HeroSection';
import TrustStrip from '@/components/shop/TrustStrip';
import CategoryRow from '@/components/shop/CategoryRow';
import ProductCard, { ProductData } from '@/components/shop/ProductCard';
import PromotionsBanner from '@/components/shop/PromotionsBanner';
import TrustedBrands from '@/components/shop/TrustedBrands';
import WhyChooseUs from '@/components/shop/WhyChooseUs';
import NewsEventsPreview from '@/components/shop/NewsEventsPreview';
import Testimonials from '@/components/shop/Testimonials';

// Temporary mock data. Later, this will fetch from the Algolia index or Firestore.
const featuredProducts: ProductData[] = [
  { id: 'p1', name: 'Tororo Cement 50kg (CEM IV/B)', slug: 'tororo-cement-50kg', price: 35000, image: '🧱', stock: 150 },
  { id: 'p2', name: 'Supermatch Roofing Iron Sheets (Gauge 28)', slug: 'supermatch-iron-sheets', price: 42000, originalPrice: 45000, image: '🏠', stock: 50, isPromo: true },
  { id: 'p3', name: 'PVC Pipe Heavy Duty (1.5 inch x 6m)', slug: 'pvc-pipe-1-5-inch', price: 18000, image: '🚰', stock: 5 },
  { id: 'p4', name: 'Veto Electrical Cable (1.5mm Twin)', slug: 'veto-cable-1-5mm', price: 120000, image: '⚡', stock: 20 },
  { id: 'p5', name: 'Heavy Duty Galvanized Wheelbarrow', slug: 'heavy-duty-wheelbarrow', price: 150000, image: '🛒', stock: 12 },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 pb-0 overflow-hidden">
      
      {/* 1. Hero Banner Slider / Bento */}
      <HeroSection />

      {/* 2. Product Search Bar (Mobile Focus - Desktop search is in the Header) */}
      <div className="md:hidden px-4 mt-2">
        <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center shadow-sm">
          <span className="text-gray-400 mx-2">🔍</span>
          <input 
            type="text" 
            placeholder="Search products, brands..." 
            className="w-full outline-none text-sm bg-transparent"
          />
        </div>
      </div>

      {/* 3. Trust Strip */}
      <TrustStrip />

      {/* 4. Product Categories */}
      <CategoryRow />

      {/* 5. Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-gray-900">Featured Products</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Promotions & Special Offers */}
      <PromotionsBanner />

      {/* 7. Trusted Brands */}
      <TrustedBrands />

      {/* 8. Why Choose Macro Hardware */}
      <WhyChooseUs />

      {/* 9. News & Events Preview */}
      <NewsEventsPreview />

      {/* 10. Testimonials */}
      <Testimonials />

      {/* 11. Contact Call-to-Action */}
      <section className="bg-amber-500 py-12 sm:py-16 text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-black mb-4">Ready to start your next project?</h2>
          <p className="text-amber-100 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Get a free quote for bulk orders or speak to one of our hardware experts today. We are locally based right here in Kabale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="bg-white text-amber-600 px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg hover:bg-gray-50 transition-all w-full sm:w-auto">
              Contact Us Now
            </Link>
            <a href="https://wa.me/256700000000" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg hover:bg-green-700 transition-all w-full sm:w-auto flex items-center justify-center">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
