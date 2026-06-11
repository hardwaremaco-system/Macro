// src/app/(shop)/categories/[categoryName]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
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

  useEffect(() => {
    async function fetchCategoryProducts() {
      try {
        const q = query(
          collection(db, 'products'), 
          where('category', '==', exactCategoryName)
        );
        const snapshot = await getDocs(q);
        
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ProductData[];
        
        setProducts(productsData);
      } catch (error) {
        console.error(`Error fetching products for ${exactCategoryName}:`, error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryProducts();
  }, [exactCategoryName]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
              <p className="text-gray-500 mt-1 text-sm">
                Showing {products.length} {products.length === 1 ? 'result' : 'results'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : products.length === 0 ? (
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
