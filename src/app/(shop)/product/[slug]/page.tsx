// src/app/(shop)/product/[slug]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, AlertCircle, Plus, Minus } from 'lucide-react';
// Strict relative paths (4 levels up to src, then down)
import { db } from '../../../../lib/firebase/client';
import { useCartStore } from '../../../../store/useCartStore';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const addItem = useCartStore((state) => state.addItem);
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          setProduct({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      stock: product.stock,
    }, quantity);

    alert(`${quantity}x ${product.name} added to your cart!`);
  };

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

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Product Image */}
        <div className="w-full md:w-1/2 bg-gray-50 p-8 sm:p-16 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 relative">
          {product.isPromo && discountPercentage > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-sm uppercase tracking-wider shadow-sm">
              Save {discountPercentage}%
            </div>
          )}
          <div className="text-[150px] sm:text-[200px] transform hover:scale-105 transition-transform duration-300">
            {product.image}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-end gap-3 mb-6 border-b border-gray-100 pb-6">
            <span className="text-3xl sm:text-4xl font-black text-blue-600">
              UGX {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through font-bold mb-1">
                UGX {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center text-sm text-gray-700">
              <ShieldCheck size={18} className="text-green-500 mr-2" />
              <span className="font-bold">100% Genuine</span> — Sourced directly from manufacturers.
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Truck size={18} className="text-blue-500 mr-2" />
              <span className="font-bold">Fast Delivery</span> — Available across the Western Region.
            </div>
          </div>

          {/* Action Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-gray-700">Quantity</span>
              {product.stock <= 0 ? (
                <span className="text-red-600 flex items-center text-xs font-bold bg-red-50 px-2 py-1 rounded">
                  <AlertCircle size={14} className="mr-1" /> Out of Stock
                </span>
              ) : product.stock < 10 ? (
                <span className="text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded">
                  Only {product.stock} left in stock
                </span>
              ) : (
                <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">
                  In Stock
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-lg bg-white h-12 w-full sm:w-32">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock <= 0}
                  className="flex-1 flex justify-center text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-black text-gray-900">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={product.stock <= 0}
                  className="flex-1 flex justify-center text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-blue-600 text-white h-12 rounded-lg font-black hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
