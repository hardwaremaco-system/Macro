// src/app/products/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
// Strict relative paths
import { db } from '../../lib/firebase/client';
import ProductCard, { ProductData } from '../../components/shop/ProductCard';

export default function AllProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllProducts() {
      try {
        // Fetch ALL products, sorted strictly by newest first
        const q = query(
          collection(db, 'products'), 
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ProductData[];

        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching all products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Header Section */}
      <div className="bg-gray-50 py-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">All Products</h1>
          <p className="mt-2 text-gray-500">Browse our complete inventory of building materials and hardware.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 h-64 rounded-xl"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            No products available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
