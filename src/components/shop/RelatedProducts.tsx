// src/components/shop/RelatedProducts.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/client';
import ProductCard, { ProductData } from './ProductCard';

export default function RelatedProducts({ category, currentProductId }: { category?: string, currentProductId: string }) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      if (!category) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'products'), where('category', '==', category), limit(6));
        const snapshot = await getDocs(q);
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }) as ProductData)
          .filter(p => p.id !== currentProductId)
          .slice(0, 5); 

        setProducts(data);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRelated();
  }, [category, currentProductId]);

  if (loading || products.length === 0) return null;

  return (
    // Gray background container with yellow top border divider
    <div className="mt-16 bg-gray-50 border-t-[3px] border-yellow-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Yellow heading */}
        <h2 className="text-lg font-black text-yellow-500 mb-6 uppercase tracking-wide">
          You Might Also Like
        </h2>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
          {products.map(product => (
            <div key={product.id} className="w-[160px] sm:w-[220px] shrink-0 snap-start flex">
              <div className="w-full">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
