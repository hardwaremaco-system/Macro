// src/app/(shop)/profile/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Package, User as UserIcon, LogOut, MapPin, Clock } from 'lucide-react';
// Strict relative paths
import { useAuth } from '../../../context/AuthContext';
import { db, auth } from '../../../lib/firebase/client';

export default function CustomerProfilePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Protect route: Redirect to login if they are not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch their exact order history from Firestore
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

    fetchMyOrders();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  // Status color helper function
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-amber-100 text-amber-800'; // Pending
    }
  };

  // Prevent flicker while checking auth state
  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar: Profile Details */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-blue-50 text-blue-600 rounded-full mx-auto mb-4">
              <UserIcon size={40} />
            </div>
            <h2 className="text-xl font-black text-gray-900 text-center mb-1">
              {profile?.fullName || 'Valued Customer'}
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">{user.email}</p>

            <div className="space-y-4 border-t border-gray-100 pt-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-bold w-20">Phone:</span>
                <span>{profile?.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-bold w-20">Role:</span>
                <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs font-bold">{profile?.role || 'User'}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center shadow-sm"
          >
            <LogOut size={18} className="mr-2" /> Sign Out
          </button>
        </div>

        {/* Right Main Content: Order History */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900 flex items-center">
                <Package size={20} className="mr-2 text-blue-600" /> My Orders
              </h2>
            </div>

            <div className="p-6">
              {loadingOrders ? (
                <div className="text-center py-8 text-gray-500">Loading your orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-500 text-sm mb-6">You haven't placed any building material orders with us yet.</p>
                  <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors inline-block">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Order Header */}
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                        <div>
                          <span className="font-bold text-gray-900">Order ID: </span>
                          <span className="text-gray-600 font-mono text-xs">{order.id}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center text-gray-500 text-xs">
                            <Clock size={14} className="mr-1" />
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                            {order.status || 'Pending'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Order Body */}
                      <div className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
                          <div className="text-sm">
                            <div className="font-bold text-gray-900 mb-1 flex items-center">
                              <MapPin size={16} className="mr-1 text-gray-400" /> Delivery To:
                            </div>
                            <div className="text-gray-600 pl-5">
                              {order.customerDetails?.deliveryLocation}
                            </div>
                          </div>
                          <div className="text-sm sm:text-right">
                            <div className="font-bold text-gray-900 mb-1">Total Amount:</div>
                            <div className="text-lg font-black text-blue-600">
                              UGX {order.totalAmount?.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                              ({order.paymentMethod?.replace(/_/g, ' ')})
                            </div>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="border-t border-gray-100 pt-4 mt-4">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Items Ordered</h4>
                          <div className="space-y-2">
                            {order.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3 truncate pr-4">
                                  <span className="text-xl">{item.image}</span>
                                  <span className="text-gray-800 truncate">{item.name}</span>
                                </div>
                                <div className="flex-shrink-0 text-gray-600 font-medium">
                                  {item.quantity} x UGX {item.price?.toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
