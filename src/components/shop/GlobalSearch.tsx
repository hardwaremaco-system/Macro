// src/components/shop/GlobalSearch.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { InstantSearch, useSearchBox, useHits } from 'react-instantsearch';
import { Search, X } from 'lucide-react';
// Strict relative path
import { searchClient } from '../../lib/algolia';

// 1. Custom Search Input Field
function CustomSearchBox({ setIsFocused }: { setIsFocused: (val: boolean) => void }) {
  const { query, refine, clear } = useSearchBox();
  const [inputValue, setInputValue] = useState(query);
  const router = useRouter();

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue); 
    refine(newValue); 
  };

  const handleClear = () => {
    setInputValue('');
    clear();
    setIsFocused(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setIsFocused(false);
      // Route to the dedicated full-page search results grid
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex z-50 shadow-sm rounded-full">
      {/* Input Wrapper ensures the X button is always perfectly positioned */}
      <div className="relative flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          placeholder="Search cement, iron sheets, paint etc..."
          // Oval edges (rounded-l-full) and reduced mobile height (py-2)
          className="w-full border border-gray-300 border-r-0 rounded-l-full pl-5 pr-10 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
        />
        {inputValue && (
          <button 
            type="button" 
            onClick={handleClear} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <button 
        type="submit" 
        // Oval edges (rounded-r-full) and Amber text
        className="bg-slate-900 text-amber-500 px-6 sm:px-8 rounded-r-full font-bold text-sm flex items-center justify-center hover:bg-slate-800 transition-colors uppercase tracking-widest shrink-0"
      >
        {/* Search Icon: Hidden on desktop, pulsing on mobile when typing */}
        <Search size={18} className={`sm:hidden ${inputValue ? 'animate-pulse' : ''}`} />
        
        {/* Search Text: Visible on desktop, pulsing when typing */}
        <span className={`hidden sm:inline ${inputValue ? 'animate-pulse' : ''}`}>
          Search
        </span>
      </button>
    </form>
  );
}

// 2. Custom Dropdown Results
function CustomHits({ setIsFocused }: { setIsFocused: (val: boolean) => void }) {
  const { hits } = useHits();

  if (hits.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 p-6 text-center text-sm text-gray-500 z-50 shadow-lg rounded-xl">
        No products found matching your search.
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl border border-gray-200 rounded-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
      <ul className="divide-y divide-gray-100">
        {hits.map((hit: any) => (
          <li key={hit.objectID}>
            <Link
              href={`/product/${hit.objectID}`}
              onClick={() => setIsFocused(false)}
              className="flex items-center p-3 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-gray-50 flex items-center justify-center mr-4 border border-gray-100 flex-shrink-0 overflow-hidden rounded-md">
                {hit.image ? (
                  <img src={hit.image} alt={hit.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <span className="text-[10px] text-gray-400">No Image</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">{hit.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{hit.unit || '1 Unit'}</p>
              </div>

              <div className="text-sm font-black text-slate-900 flex-shrink-0 ml-3">
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
    <div className="w-full max-w-2xl relative" ref={containerRef}>
      <InstantSearch searchClient={searchClient} indexName="products">
        <CustomSearchBox setIsFocused={setIsFocused} />
        {isFocused && (
          <CustomHits setIsFocused={setIsFocused} />
        )}
      </InstantSearch>
    </div>
  );
}
