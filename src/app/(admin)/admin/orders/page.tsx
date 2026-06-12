// src/app/(admin)/admin/orders/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Eye, Search, Package } from 'lucide-react';
// Strict relative path
import { db } from '../../../../lib/firebase/client';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status & send email
  const handleUpdateStatus = async (orderId: string, newStatus: string, customerEmail: string, customerName: string) => {
    if (!confirm(`Change order status to ${newStatus}?`)) return;

    setUpdatingId(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });

      // Update local state immediately
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      // Trigger Brevo Status Update Email
      if (customerEmail) {
        await fetch('/api/email/order-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, status: newStatus, email: customerEmail, name: customerName }),
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-800">Delivered</span>;
      case 'processing': return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">Processing</span>;
      case 'cancelled': return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800">Cancelled</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">Pending</span>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">View and process all customer orders.</p>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input type="text" placeholder="Search Order ID..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Order ID & Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono font-bold text-blue-600 mb-1">
                        {order.id.slice(0, 8).toUpperCase()}...
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{order.customerDetails?.fullName}</div>
                      <div className="text-xs text-gray-500 flex flex-col mt-1 gap-1">
                        <span>{order.customerDetails?.phone}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-black text-gray-900">UGX {order.totalAmount?.toLocaleString()}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">{order.paymentMethod?.replace(/_/g, ' ')}</div>
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        {updatingId === order.id ? (
                          <span className="text-xs text-blue-600 font-bold animate-pulse">Updating...</span>
                        ) : (
                          <select 
                            value={order.status || 'Pending'}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value, order.customerDetails?.email, order.customerDetails?.fullName)}
                            className="text-xs border border-gray-300 rounded p-1.5 focus:outline-none focus:border-blue-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        )}

                        <Link href={`/admin/orders/${order.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors title='View Full Details'">
                          <Eye size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
