// src/components/shop/LatestProducts.tsx
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  startAfter, 
  QueryDocumentSnapshot, 
  DocumentData 
} from 'firebase/firestore';
import { ArrowRight } from 'lucide-react';
import { db } from '../../lib/firebase/client';
import ProductCard, { ProductData } from './ProductCard';

export default function LatestProducts() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const MAX_PRODUCTS = 15;
  const BATCH_SIZE = 5;

  const fetchLatestProducts = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const baseQ = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      let q = query(baseQ, limit(BATCH_SIZE));

      if (!isInitial && lastVisible) {
        q = query(baseQ, startAfter(lastVisible), limit(BATCH_SIZE));
      }

      const snapshot = await getDocs(q);
      const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProductData[];

      setProducts(prev => {
        const newData = isInitial ? fetchedData : [...prev, ...fetchedData];
        // Stop fetching if we hit our max limit of 15
        if (newData.length >= MAX_PRODUCTS) {
          setHasMore(false);
        }
        return newData;
      });

      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);

      // If fewer documents are returned than requested, we've hit the end of the database collection
      if (snapshot.docs.length < BATCH_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching latest products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 1. Initial Load
  useEffect(() => {
    fetchLatestProducts(true);
  }, []);

  // 2. Intersection Observer setup for automatic scrolling trigger
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      // If the invisible div intersects the viewport and we still need more products, fetch!
      if (entries[0].isIntersecting && hasMore && products.length < MAX_PRODUCTS) {
        fetchLatestProducts(false);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, products.length]);

  // Helper component for the wave shimmer skeletons
  const LoadingSkeletons = ({ count = 5 }: { count?: number }) => (
    <>
      {[...Array(count)].map((_, index) => (
        <div 
          key={`skeleton-${index}`} 
          className={`flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm relative ${index === 4 ? 'hidden xl:flex' : 'flex'}`}
        >
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
          <div className="w-full aspect-square bg-gray-100"></div>
          <div className="p-3 sm:p-4 flex flex-col flex-grow text-left">
            <div className="h-3 sm:h-4 w-12 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 sm:h-5 w-full bg-gray-200 rounded mb-1.5"></div>
            <div className="h-4 sm:h-5 w-2/3 bg-gray-200 rounded"></div>
            <div className="mt-auto pt-4">
              <div className="h-5 sm:h-6 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  if (!loading && products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <style>{`
        @keyframes wave-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: wave-shimmer 1.5s infinite ease-in-out;
        }
      `}</style>

      {/* Header section preserved from original component */}
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-black text-gray-900">Latest Added</h2>
        <Link href="/products" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center transition-colors">
          View All <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 relative">
        {/* Initial Load Skeletons */}
        {loading && <LoadingSkeletons count={5} />}

        {/* Loaded Products */}
        {!loading && products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {/* Appending Skeletons smoothly at the bottom while more are fetching */}
        {loadingMore && <LoadingSkeletons count={5} />}
      </div>

      {/* Invisible Trigger Div for the Intersection Observer */}
      {!loading && hasMore && products.length < MAX_PRODUCTS && (
        <div ref={lastElementRef} className="h-10 w-full mt-4 bg-transparent pointer-events-none" />
      )}

    </section>
  );
}
