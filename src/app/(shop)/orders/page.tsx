// src/app/(shop)/orders/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// Strict relative paths
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase/client';
import OrderHistory from '../../../components/shop/OrderHistory';

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Protect route: Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/orders');
    }
  }, [user, authLoading, router]);

  // Fetch exactly their order history from Firestore
  useEffect(() => {
    async function fetchMyOrders() {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    }

    if (user && !authLoading) {
      fetchMyOrders();
    }
  }, [user, authLoading]);

  // Prevent flicker while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null; // Router handles the redirect

  return (
    <div className="bg-gray-50 min-h-screen py-6 md:py-10">
      {/* Reduced padding to px-2 for almost edge-to-edge on mobile */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8">

        {/* Header Section */}
        <div className="mb-6 px-2">
          <Link href="/profile" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-4 uppercase tracking-wider">
            &larr; Back to Account
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase">My Orders</h1>
          </div>
        </div>

        {/* Removed rounded borders, reduced inner padding */}
        <div className="bg-white border-y sm:border-x border-gray-200 rounded-none shadow-sm p-3 sm:p-6 md:p-8">
          
          <OrderHistory orders={orders} loading={loadingOrders} />

          {/* "No more orders" message shown only if they actually have orders */}
          {!loadingOrders && orders.length > 0 && (
            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                No more orders
              </span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
