// src/components/shop/GlobalSearch.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { InstantSearch, useSearchBox, useHits } from 'react-instantsearch';
import { Search, X } from 'lucide-react';
// Strict relative path
import { searchClient } from '../../lib/algolia';

// 1. Custom Search Input Field
function CustomSearchBox({ setIsFocused }: { setIsFocused: (val: boolean) => void }) {
  const { query, refine, clear } = useSearchBox();

  return (
    <div className="w-full flex relative z-50">
      <input
        type="text"
        value={query}
        onChange={(e) => refine(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder="Search products, brands, and categories..."
        className="w-full border border-gray-300 border-r-0 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {query && (
        <button onClick={() => { clear(); setIsFocused(false); }} className="absolute right-12 top-2 text-gray-400 hover:text-gray-600 p-0.5">
          <X size={18} />
        </button>
      )}
      <button className="bg-amber-500 text-white px-4 rounded-r-lg hover:bg-amber-600 transition-colors flex items-center justify-center">
        <Search size={20} />
      </button>
    </div>
  );
}

// 2. Custom Dropdown Results (Hits)
function CustomHits({ setIsFocused }: { setIsFocused: (val: boolean) => void }) {
  const { hits } = useHits();

  if (hits.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-6 text-center text-sm text-gray-500 z-50">
        No products found matching your search.
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto">
      <ul className="divide-y divide-gray-100">
        {hits.map((hit: any) => (
          <li key={hit.objectID}>
            <Link
              href={`/product/${hit.slug}`}
              onClick={() => setIsFocused(false)}
              className="flex items-center p-3 hover:bg-blue-50 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl mr-4 border border-gray-100 flex-shrink-0">
                {hit.image}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate">{hit.name}</h4>
                <p className="text-xs text-gray-500">{hit.category}</p>
              </div>
              <div className="text-sm font-black text-blue-600 flex-shrink-0 ml-3">
                UGX {hit.price?.toLocaleString()}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 3. Main Wrapper Component
export default function GlobalSearch() {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside of the search area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={containerRef}>
      <InstantSearch searchClient={searchClient} indexName="macro_products">
        <CustomSearchBox setIsFocused={setIsFocused} />
        {isFocused && (
          <CustomHits setIsFocused={setIsFocused} />
        )}
      </InstantSearch>
    </div>
  );
}
