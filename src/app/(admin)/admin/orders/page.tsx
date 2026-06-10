// src/app/(admin)/admin/orders/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Eye, CheckCircle, Truck, XCircle, Search, Package } from 'lucide-react';
// Strict relative path (4 levels up to src, then down to lib)
import { db } from '../../../../lib/firebase/client';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch all orders from Firestore
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

  // Update order status in Firestore
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;
    
    setUpdatingId(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      
      // Update local state so UI reflects the change immediately
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Status Badge Colors
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': 
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-800">Delivered</span>;
      case 'processing': 
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">Processing</span>;
      case 'cancelled': 
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800">Cancelled</span>;
      default: 
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">Pending</span>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">View and process all customer orders.</p>
        </div>
        
        {/* Search Bar (Visual Placeholder for now) */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search Order ID..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Orders Table */}
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
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                      Loading orders database...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                      <Package size={24} />
                    </div>
                    <p className="text-gray-500 font-medium">No orders found.</p>
                  </td>
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
                      <div className="text-sm font-bold text-gray-900">
                        {order.customerDetails?.fullName}
                      </div>
                      <div className="text-xs text-gray-500 flex flex-col mt-1 gap-1">
                        <span>{order.customerDetails?.phone}</span>
                        <span className="truncate max-w-[150px]">{order.customerDetails?.deliveryLocation}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-black text-gray-900">
                        UGX {order.totalAmount?.toLocaleString()}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                        {order.paymentMethod?.replace(/_/g, ' ')}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {updatingId === order.id ? (
                          <span className="text-xs text-blue-600 font-bold animate-pulse">Updating...</span>
                        ) : (
                          <>
                            {order.status?.toLowerCase() === 'pending' && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'Processing')}
                                className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors title='Confirm & Process'"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            
                            {order.status?.toLowerCase() === 'processing' && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                                className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-600 hover:text-white transition-colors title='Mark as Delivered'"
                              >
                                <Truck size={16} />
                              </button>
                            )}

                            {(order.status?.toLowerCase() === 'pending' || order.status?.toLowerCase() === 'processing') && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                                className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors title='Cancel Order'"
                              >
                                <XCircle size={16} />
                              </button>
                            )}

                            <button className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors title='View Full Details'">
                              <Eye size={16} />
                            </button>
                          </>
                        )}
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
