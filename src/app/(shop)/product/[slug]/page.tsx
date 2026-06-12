// src/app/(shop)/product/[slug]/page.tsx
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';

// Strict relative paths
import { db } from '../../../../lib/firebase/client';
import ProductGallery from '../../../../components/shop/ProductGallery';
import ProductBuyBox from '../../../../components/shop/ProductBuyBox';
import ProductDescription from '../../../../components/shop/ProductDescription';
import RelatedProducts from '../../../../components/shop/RelatedProducts';

// 1. GENERATE OPEN GRAPH METADATA (For WhatsApp, Facebook, SEO)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const docRef = doc(db, 'products', params.slug);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return { title: 'Product Not Found | Macro Hardware' };
  }

  const product = snapshot.data();

  return {
    title: `${product.title} | Macro Hardware`,
    description: product.description?.substring(0, 160) || `Buy ${product.title} at the best price.`,
    openGraph: {
      title: product.title,
      description: `UGX ${Number(product.price).toLocaleString()} - ${product.unit || '1 Unit'}`,
      // Add your actual production domain here once you go live
      // url: `https://yourwebsite.com/product/${params.slug}`, 
      siteName: 'Macro Hardware',
      images: [
        {
          url: product.image, // The image WhatsApp will display
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
      type: 'website',
    },
  };
}

// 2. MAIN SERVER COMPONENT PAGE
export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const documentId = params.slug;

  // Fetch data directly on the server! No more useEffect or loading spinners.
  const docRef = doc(db, 'products', documentId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
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

  const product = { id: docSnap.id, ...docSnap.data() } as any;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumb Navigation 
          (Changed from router.back() to a direct Link so this remains a fast Server Component) 
      */}
      <div className="mb-6">
        <Link 
          href="/products" 
          className="text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center transition-colors inline-flex"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Shop
        </Link>
      </div>

      {/* Main Content Grid: On Mobile it stacks vertically, on Desktop it sits side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <ProductGallery image={product.image} images={product.images} title={product.title} />
        <ProductBuyBox product={product} />
      </div>

      {/* Description Section (Updated to pass the whole product object based on our previous step) */}
      <ProductDescription product={product} />

      {/* You Might Also Like Section */}
      <RelatedProducts category={product.category} currentProductId={product.id} />
    </div>
  );
}
