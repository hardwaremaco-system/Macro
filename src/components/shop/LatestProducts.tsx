// src/components/shop/LatestProducts.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { ArrowRight } from 'lucide-react';
import { db } from '../../lib/firebase/client';
import ProductCard, { ProductData } from './ProductCard';

export default function LatestProducts() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestProducts() {
      try {
        // Increased limit to 15 to match FeaturedProducts
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(15));
        const snapshot = await getDocs(q);
        const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProductData[];
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching latest products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestProducts();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-black text-gray-900">Latest Added</h2>
        <Link href="/products" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center transition-colors">
          View All <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      {loading ? (
        // Added matching skeleton loaders
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 aspect-[4/5] sm:aspect-square rounded-2xl"></div>
          ))}
        </div>
      ) : (
        // Updated responsive grid to match FeaturedProducts
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </section>
  );
}
