// src/components/shop/FeaturedProducts.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/client';
import ProductCard, { ProductData } from './ProductCard';
import { Star } from 'lucide-react';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        // Query products where isFeatured is true, capped at a reasonable grid size (e.g., 5 items)
        const q = query(
          collection(db, 'products'),
          where('isFeatured', '==', true),
          limit(5)
        );
        
        const snapshot = await getDocs(q);
        const featuredData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ProductData[];

        setProducts(featuredData);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  // If there are no featured products set by the admin, hide the section completely
  if (!loading && products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-2 mb-8">
        <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
          <Star size={20} fill="currentColor" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Featured Materials</h2>
          <p className="text-sm text-gray-500">Handpicked top-quality recommendations for your projects</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
