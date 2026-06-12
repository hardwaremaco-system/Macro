// src/app/(shop)/profile/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { User as UserIcon, LogOut, Package } from 'lucide-react';
// Strict relative paths
import { useAuth } from '../../../context/AuthContext';
import { db, auth } from '../../../lib/firebase/client';
import OrderHistory from '../../../components/shop/OrderHistory';

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

        {/* Right Main Content: Order History Component */}
        <div className="flex-1">
          {/* Header outside the component to keep the page structure intact */}
          <h2 className="text-xl font-black text-gray-900 flex items-center mb-6">
            <Package size={24} className="mr-2 text-blue-600" /> My Orders
          </h2>
          
          <OrderHistory orders={orders} loading={loadingOrders} />
        </div>

      </div>
    </div>
  );
}
