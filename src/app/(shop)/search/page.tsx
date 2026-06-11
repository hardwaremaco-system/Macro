// src/app/(shop)/search/page.tsx
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import algoliasearch from 'algoliasearch/lite';
// Strict relative paths
import ProductCard, { ProductData } from '../../../components/shop/ProductCard';

// Initialize Algolia search-only client (Safe for the browser)
const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY as string
);
const index = searchClient.initIndex('products');

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { hits } = await index.search(query);
        
        // Map Algolia hits back into your exact ProductCard format
        const mappedProducts = hits.map((hit: any) => ({
          id: hit.objectID,
          title: hit.title,
          category: hit.category,
          unit: hit.unit || '1 Unit',
          price: hit.price,
          originalPrice: hit.originalPrice,
          image: hit.image,
          stock: hit.stock,
          isPromo: hit.isPromo,
        })) as ProductData[];

        setResults(mappedProducts);
      } catch (error) {
        console.error('Error searching Algolia:', error);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [query]);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Search Header */}
      <div className="bg-gray-50 py-10 sm:py-16 border-b border-gray-200 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Search Results
          </h1>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            {loading ? (
              'Searching our inventory...'
            ) : (
              <>Found <span className="font-bold text-slate-900">{results.length}</span> results for "{query}"</>
            )}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          // Skeleton Loaders matching the site-wide responsive grid
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 aspect-[4/5] sm:aspect-square rounded-xl"></div>
            ))}
          </div>
        ) : results.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No matches found</h3>
            <p className="text-gray-500 text-sm sm:text-base">Try checking your spelling or using more general terms.</p>
          </div>
        ) : (
          // Products Grid
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Wrapped in Suspense to safely use useSearchParams in Next.js 13+ app directory
export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex justify-center pt-32">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
