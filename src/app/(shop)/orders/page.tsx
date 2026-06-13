// src/app/(shop)/orders/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Package, ArrowLeft, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

// Strict relative paths
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase/client';

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Protect the route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/orders');
    }
  }, [user, authLoading, router]);

  // Fetch the user's orders
  useEffect(() => {
    async function fetchMyOrders() {
      if (!user) return;
      
      try {
        // Query orders where the user ID matches the logged-in user
        // Adjust 'userId' if you saved it as something else (like 'email') in your checkout process
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const userOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user && !authLoading) {
      fetchMyOrders();
    }
  }, [user, authLoading]);

  // Helper for status colors
  const getStatusDisplay = (status: string) => {
    const s = status?.toLowerCase() || 'pending';
    if (s === 'delivered' || s === 'completed') {
      return <span className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"><CheckCircle size={14} className="mr-1.5" /> Delivered</span>;
    }
    if (s === 'cancelled') {
      return <span className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"><XCircle size={14} className="mr-1.5" /> Cancelled</span>;
    }
    if (s === 'processing') {
      return <span className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"><Clock size={14} className="mr-1.5" /> Processing</span>;
    }
    return <span className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"><Clock size={14} className="mr-1.5" /> Pending</span>;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null; // Let the router redirect handle this

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/profile" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-2">
              <ArrowLeft size={16} className="mr-2" /> Back to Profile
            </Link>
            <h1 className="text-3xl font-black text-gray-900">My Orders</h1>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
              <Package size={40} />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6 max-w-md">Looks like you haven't placed any orders with Macro Hardware yet. Let's get your construction project started!</p>
            <Link href="/categories" className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black hover:bg-blue-700 transition-colors shadow-md">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-x-8 gap-y-2">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Order Placed</p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Total Amount</p>
                      <p className="text-sm font-black text-gray-900">UGX {Number(order.totalAmount || order.total || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Order ID</p>
                      <p className="text-sm font-mono font-bold text-blue-600">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div>
                    {getStatusDisplay(order.status)}
                  </div>
                </div>

                {/* Order Details Preview */}
                <div className="p-4 sm:px-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'} in this order
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.paymentMethod?.replace(/_/g, ' ') || 'Standard Checkout'}
                      </p>
                    </div>
                  </div>
                  <Link 
                    href={`/orders/${order.id}`} // Or wherever your single order view is, if you have one
                    className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
                  >
                    View Details <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
