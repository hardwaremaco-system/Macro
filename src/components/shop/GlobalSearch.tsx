// src/components/shop/GlobalSearch.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { InstantSearch, useSearchBox, useHits } from 'react-instantsearch';
import { X } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Strict relative paths
import { searchClient } from '../../lib/algolia';
import { db } from '../../lib/firebase/client';

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
    const searchTerm = inputValue.trim();
    
    if (searchTerm) {
      setIsFocused(false);
      
      addDoc(collection(db, 'search_queries'), {
        query: searchTerm.toLowerCase(),
        createdAt: serverTimestamp(),
      }).catch((error) => console.error('Error saving search query:', error));

      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    // Massively reduced outer padding to p-0.5 and fixed a max height to keep it very slim
    <form 
      onSubmit={handleSubmit} 
      className="w-full flex items-center bg-white border border-gray-300 rounded-full p-0.5 z-50 shadow-sm relative transition-colors focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 h-9 sm:h-10"
    >
      <div className="relative flex-1 flex items-center h-full">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          placeholder="Search cement, iron sheets, paint etc..."
          // Removed all vertical padding (py), strictly relying on the container's fixed height
          className="w-full h-full bg-transparent pl-4 pr-8 text-xs sm:text-sm focus:outline-none"
        />
        {inputValue && (
          <button 
            type="button" 
            onClick={handleClear} 
            className="absolute right-2 text-gray-400 hover:text-gray-600 p-0.5"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Button sizing completely tightened */}
      <button 
        type="submit" 
        className="bg-slate-900 text-amber-500 h-full px-5 sm:px-6 rounded-full font-bold text-xs flex items-center justify-center hover:bg-slate-800 transition-colors uppercase tracking-widest shrink-0"
      >
        Search
      </button>
    </form>
  );
}

// 2. Custom Dropdown Results
function CustomHits({ setIsFocused }: { setIsFocused: (val: boolean) => void }) {
  const { hits } = useHits();

  if (hits.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 p-4 text-center text-xs text-gray-500 z-50 shadow-lg rounded-xl">
        No products found matching your search.
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-2xl border border-gray-200 rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
      <ul className="divide-y divide-gray-100">
        {hits.map((hit: any) => (
          <li key={hit.objectID}>
            <Link
              href={`/product/${hit.objectID}`}
              onClick={() => setIsFocused(false)}
              className="flex items-center p-2 sm:p-3 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center mr-3 border border-gray-100 flex-shrink-0 overflow-hidden rounded-md">
                {hit.image ? (
                  <img src={hit.image} alt={hit.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <span className="text-[9px] text-gray-400">No Image</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{hit.title}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{hit.unit || '1 Unit'}</p>
              </div>

              <div className="text-xs sm:text-sm font-black text-slate-900 flex-shrink-0 ml-3">
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
