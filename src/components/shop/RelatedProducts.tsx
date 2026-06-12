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
    <div className="w-full mt-8 bg-gray-50 border-t-[3px] border-blue-600 py-6">
      {/* Removed horizontal padding from this wrapper so the scroller can bleed */}
      <div className="max-w-7xl mx-auto">

        {/* Applied padding to the heading to keep it aligned with the page */}
        <h2 className="text-lg font-black text-black mb-4 uppercase tracking-wide px-4 sm:px-6 lg:px-8">
          You Might Also Like
        </h2>

        {/* Applied padding inside the scroll container.
          This ensures the first card aligns with the text, but the right side bleeds to the screen edge.
        */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-4 sm:px-6 lg:px-8">
          {products.map(product => (
            // Adjusted mobile width to 150px to ensure a perfect 2.5 card preview
            <div key={product.id} className="w-[150px] sm:w-[220px] shrink-0 snap-start flex">
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
