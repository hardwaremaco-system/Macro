// src/app/(shop)/orders/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ArrowLeft, Package } from 'lucide-react';

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
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft size={16} className="mr-2" /> Back to Account
          </Link>
          <div className="flex items-center">
            <Package size={32} className="mr-3 text-blue-600" />
            <h1 className="text-3xl font-black text-gray-900">My Orders</h1>
          </div>
        </div>

        {/* Inject your existing Order History Component */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
          <OrderHistory orders={orders} loading={loadingOrders} />
        </div>

      </div>
    </div>
  );
}
