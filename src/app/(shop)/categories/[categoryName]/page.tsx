// src/app/(shop)/categories/[categoryName]/page.tsx
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  collection, 
  query, 
  where, 
  limit, 
  getDocs, 
  startAfter, 
  QueryDocumentSnapshot, 
  DocumentData 
} from 'firebase/firestore';
import { ArrowLeft, PackageX } from 'lucide-react';
// Strict relative paths
import { db } from '../../../../lib/firebase/client';
import { STORE_CATEGORIES } from '../../../../lib/categories';
import ProductCard, { ProductData } from '../../../../components/shop/ProductCard';

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params.categoryName as string;

  // Use the central file to find the EXACT category name from the URL slug
  const categoryConfig = STORE_CATEGORIES.find(c => c.slug === rawSlug);

  // Fallback in case a user types a random category in the URL
  const exactCategoryName = categoryConfig 
    ? categoryConfig.name 
    : rawSlug.charAt(0).toUpperCase() + rawSlug.slice(1).toLowerCase();

  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const INITIAL_BATCH_SIZE = 20;
  const FETCH_BATCH_SIZE = 10;

  const fetchCategoryProducts = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const baseQ = query(
        collection(db, 'products'), 
        where('category', '==', exactCategoryName)
      );
      
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
      console.error(`Error fetching products for ${exactCategoryName}:`, error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 1. Initial Load (re-runs if exactCategoryName changes)
  useEffect(() => {
    // Reset states when category changes
    setProducts([]);
    setLastVisible(null);
    setHasMore(true);
    fetchCategoryProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exactCategoryName]);

  // 2. Intersection Observer setup for automatic scrolling trigger
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchCategoryProducts(false);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-screen">
      
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
        <div>
          <button onClick={() => router.back()} className="text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center transition-colors mb-4">
            <ArrowLeft size={16} className="mr-1" /> Back
          </button>
          <div className="flex items-center">
            {categoryConfig && (
              <img src={categoryConfig.image} alt="Icon" className="w-10 h-10 object-contain mr-4" />
            )}
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                {exactCategoryName} Materials
              </h1>
              {/* Intelligent counter that handles lazy loading gracefully */}
              {!loading && products.length > 0 && (
                <p className="text-gray-500 mt-1 text-sm font-medium">
                  Showing {products.length}{hasMore ? '+' : ''} {products.length === 1 && !hasMore ? 'result' : 'results'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!loading && products.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl py-20 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <PackageX size={32} />
          </div>
          <h2 className="text-lg font-black text-gray-900 mb-2">No products found</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            We currently don&apos;t have any products listed under {exactCategoryName}. Check back soon as we restock our inventory!
          </p>
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
      {!loading && hasMore && products.length > 0 && (
        <div ref={lastElementRef} className="h-10 w-full mt-4 bg-transparent pointer-events-none" />
      )}
      
      {/* End of results message */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-10 text-gray-400 text-sm font-bold tracking-wide uppercase mt-8 border-t border-gray-50">
          End of {exactCategoryName} catalog
        </div>
      )}
    </div>
  );
}
