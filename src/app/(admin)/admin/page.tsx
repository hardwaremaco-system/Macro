// src/app/(admin)/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { TrendingUp, Package, ShoppingCart, Users, AlertCircle, CheckCircle } from 'lucide-react';
// Strict relative path
import { db } from '../../../lib/firebase/client';

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);

  // Real Data States
  const [revenue, setRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [pendingTestimonialsCount, setPendingTestimonialsCount] = useState(0);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Fetch Orders (For Revenue, Total Count, and Alerts)
        const ordersSnap = await getDocs(collection(db, 'orders'));
        let calculatedRevenue = 0;
        let pendingOrders = 0;
        const allOrders: any[] = [];

        ordersSnap.forEach((doc) => {
          const data = doc.data();
          allOrders.push({ id: doc.id, ...data });

          // Add to revenue (handle both total and totalAmount naming conventions)
          calculatedRevenue += Number(data.totalAmount || data.total || 0);

          // Check for pending status
          if (data.status === 'pending' || data.status === 'Processing' || !data.status) {
            pendingOrders++;
          }
        });

        setRevenue(calculatedRevenue);
        setTotalOrders(allOrders.length);
        setPendingOrdersCount(pendingOrders);

        // Sort orders by date in memory to get the 5 most recent
        const sortedOrders = allOrders.sort((a, b) => {
          const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return dateB - dateA;
        }).slice(0, 5);
        setRecentOrders(sortedOrders);

        // 2. Fetch Total Customers (Accurate Calculation)
        // Fetch everyone, then count only the ones who are NOT admins. 
        // This catches users even if they don't have a specific 'role' field attached to them.
        const usersSnap = await getDocs(collection(db, 'users'));
        let customerCount = 0;
        usersSnap.forEach((doc) => {
          if (doc.data().role !== 'admin') {
            customerCount++;
          }
        });
        setTotalCustomers(customerCount);

        // 3. Fetch Total Products
        const productsSnap = await getDocs(collection(db, 'products'));
        setTotalProducts(productsSnap.size);

        // 4. Fetch Pending Testimonials (for Alerts)
        const testimonialsSnap = await getDocs(query(collection(db, 'testimonials'), where('status', '==', 'pending')));
        setPendingTestimonialsCount(testimonialsSnap.size);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Dynamic Stats Array based on live data
  const stats = [
    { 
      name: 'Total Revenue', 
      value: `UGX ${revenue.toLocaleString()}`, 
      subtitle: 'Lifetime sales', 
      icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' 
    },
    { 
      name: 'Total Orders', 
      value: totalOrders.toLocaleString(), 
      subtitle: 'All time', 
      icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' 
    },
    { 
      name: 'Total Customers', 
      value: totalCustomers.toLocaleString(), 
      subtitle: 'Registered accounts', 
      icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' 
    },
    { 
      name: 'Active Products', 
      value: totalProducts.toLocaleString(), 
      subtitle: 'Live in inventory', 
      icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' 
    },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back. Here is your live data for Macro Hardware today.</p>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-bold text-gray-500 mb-1">{stat.name}</p>
                <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                <p className="text-xs font-medium text-gray-400 mt-2">
                  {stat.subtitle}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-black text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No orders have been placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.customerName || order.email || 'Guest User'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        UGX {Number(order.totalAmount || order.total || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'completed' || order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Alerts Sidebar */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-lg font-black text-gray-900">Action Required</h2>
          </div>
          <div className="p-6 flex-1">
            {pendingOrdersCount === 0 && pendingTestimonialsCount === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-8">
                 <CheckCircle size={40} className="text-green-500 mb-3 opacity-50" />
                 <p className="font-medium text-sm">You are all caught up!</p>
                 <p className="text-xs mt-1">No pending actions required.</p>
               </div>
            ) : (
              <ul className="space-y-5">
                {pendingOrdersCount > 0 && (
                  <li className="flex gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-black text-amber-900">{pendingOrdersCount} Pending {pendingOrdersCount === 1 ? 'Order' : 'Orders'}</p>
                      <p className="text-xs text-amber-700 mt-1">You have orders waiting for dispatch or payment confirmation.</p>
                      <Link href="/admin/orders" className="text-xs font-bold text-amber-600 hover:text-amber-800 mt-2 inline-block uppercase tracking-wider">Review Orders &rarr;</Link>
                    </div>
                  </li>
                )}

                {pendingTestimonialsCount > 0 && (
                  <li className="flex gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-black text-blue-900">{pendingTestimonialsCount} New {pendingTestimonialsCount === 1 ? 'Review' : 'Reviews'}</p>
                      <p className="text-xs text-blue-700 mt-1">Customers have submitted testimonials that require moderation.</p>
                      <Link href="/admin/testimonials" className="text-xs font-bold text-blue-600 hover:text-blue-800 mt-2 inline-block uppercase tracking-wider">Review Feedback &rarr;</Link>
                    </div>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
