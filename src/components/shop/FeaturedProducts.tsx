// src/components/shop/FeaturedProducts.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/client';
import ProductCard, { ProductData } from './ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        // Increased limit to 15 products
        const q = query(collection(db, 'products'), where('isFeatured', '==', true), limit(15));
        const snapshot = await getDocs(q);
        const featuredData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProductData[];
        setProducts(featuredData);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedProducts();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Featured Materials</h2>
        <p className="text-sm text-gray-500 mt-1">Handpicked top-quality recommendations for your projects</p>
      </div>
      
      {loading ? (
        // Loading Skeletons: Updated grid classes and array size to match the new 15 limit
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 aspect-[4/5] sm:aspect-square rounded-2xl"></div>
          ))}
        </div>
      ) : (
        // Products Grid: 2 on mobile, 3 on tablet, 4 on small desktop, 5 on large screens
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
