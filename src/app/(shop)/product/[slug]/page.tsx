// src/app/(shop)/product/[slug]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';

// Strict relative paths
import { db } from '../../../../lib/firebase/client';
import ProductGallery from '../../../../components/shop/ProductGallery';
import ProductBuyBox from '../../../../components/shop/ProductBuyBox';
import ProductDescription from '../../../../components/shop/ProductDescription';
import RelatedProducts from '../../../../components/shop/RelatedProducts';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const docRef = doc(db, 'products', documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    }

    if (documentId) {
      fetchProduct();
    }
  }, [documentId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-2xl font-black text-gray-900 mb-2">Product Not Found</h1>
        <p className="text-gray-500 mb-6">The item you are looking for does not exist or has been removed.</p>
        <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>
      </div>

      {/* Main Content Grid: On Mobile it stacks vertically, on Desktop it sits side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <ProductGallery image={product.image} images={product.images} title={product.title} />
        <ProductBuyBox product={product} />
      </div>

      {/* Description Section */}
      <ProductDescription description={product.description} />

      {/* You Might Also Like Section */}
      <RelatedProducts category={product.category} currentProductId={product.id} />
    </div>
  );
}
