// src/app/(shop)/products/page.tsx
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
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
// Strict relative paths
import { db } from '../../../lib/firebase/client';
import ProductCard, { ProductData } from '../../../components/shop/ProductCard';

export default function AllProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Initial load is larger (20) to fill the screen. Subsequent fetches are smaller (10) for smooth scrolling.
  const INITIAL_BATCH_SIZE = 20;
  const FETCH_BATCH_SIZE = 10;

  const fetchProducts = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const baseQ = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      let q = query(baseQ, limit(isInitial ? INITIAL_BATCH_SIZE : FETCH_BATCH_SIZE));

      if (!isInitial && lastVisible) {
        q = query(baseQ, startAfter(lastVisible), limit(FETCH_BATCH_SIZE));
      }

      const snapshot = await getDocs(q);
      const fetchedData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProductData[];

      setProducts(prev => isInitial ? fetchedData : [...prev, ...fetchedData]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);

      // If we got fewer products than requested, we've reached the end of the collection
      if (snapshot.docs.length < (isInitial ? INITIAL_BATCH_SIZE : FETCH_BATCH_SIZE)) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching all products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 1. Initial Load
  useEffect(() => {
    fetchProducts(true);
  }, []);

  // 2. Intersection Observer setup for automatic scrolling trigger
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchProducts(false);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  // Helper component for the wave shimmer skeletons
  const LoadingSkeletons = ({ count }: { count: number }) => (
    <>
      {[...Array(count)].map((_, index) => (
        <div 
          key={`skeleton-${index}`} 
          // Similar logic: hides odd-numbered extra skeletons on certain breakpoints to keep grids perfectly flush
          className="flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm relative"
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

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Global Style for the Shimmer Animation */}
      <style>{`
        @keyframes wave-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: wave-shimmer 1.5s infinite ease-in-out;
        }
      `}</style>

      {/* Header Section */}
      <div className="bg-gray-50 py-10 sm:py-16 border-b border-gray-200 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">All Products</h1>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Browse our complete inventory of top-quality materials.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {!loading && products.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            No products available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 relative">
            
            {/* Initial Load Skeletons */}
            {loading && <LoadingSkeletons count={INITIAL_BATCH_SIZE} />}

            {/* Loaded Products */}
            {!loading && products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {/* Appending Skeletons smoothly at the bottom while more are fetching */}
            {loadingMore && <LoadingSkeletons count={FETCH_BATCH_SIZE} />}
          </div>
        )}

        {/* Invisible Trigger Div for the Intersection Observer */}
        {!loading && hasMore && (
          <div ref={lastElementRef} className="h-10 w-full mt-4 bg-transparent pointer-events-none" />
        )}
        
        {/* End of results message */}
        {!hasMore && products.length > 0 && (
          <div className="text-center py-10 text-gray-400 text-sm font-bold tracking-wide uppercase mt-8 border-t border-gray-50">
            You have reached the end of our catalog
          </div>
        )}
      </div>
    </div>
  );
}
