// src/components/shop/OrderHistory.tsx
import React from 'react';
import Link from 'next/link';
import { Package, Clock, MapPin } from 'lucide-react';

// Status color helper function
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'processing': return 'bg-blue-100 text-blue-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-amber-100 text-amber-800'; // Pending
  }
};

export default function OrderHistory({ orders, loading }: { orders: any[], loading: boolean }) {
  
  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-500 text-sm mb-6">You haven't placed any building material orders with us yet.</p>
        <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    // -mx-4 makes the container bleed to the edges on mobile, sm:mx-0 keeps it contained on desktop
    <div className="-mx-4 sm:mx-0 space-y-4 sm:space-y-6">
      {orders.map((order) => (
        // Rectangular edge-to-edge cards on mobile (border-y), standard rounded cards on desktop
        <div key={order.id} className="bg-white border-y sm:border border-gray-200 sm:rounded-xl overflow-hidden shadow-sm">
          
          {/* Order Header */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <div>
              <span className="font-bold text-gray-900">Order ID: </span>
              <span className="text-gray-600 font-mono text-xs">{order.id}</span>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <span className="flex items-center text-gray-500 text-xs font-medium">
                <Clock size={14} className="mr-1" />
                {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
              </span>
              <span className={`px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                {order.status || 'Pending'}
              </span>
            </div>
          </div>

          {/* Order Details & Items */}
          <div className="p-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
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
                <div className="text-xs text-gray-400 uppercase tracking-wide mt-1 font-bold">
                  ({order.paymentMethod?.replace(/_/g, ' ')})
                </div>
              </div>
            </div>

            {/* Render Actual Images and Item Details */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Items Ordered</h4>
              <div className="space-y-4">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 text-sm">
                    {/* Fixed Image Rendering */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-gray-50 border border-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                      {item.image && item.image.startsWith('http') ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-xs">No img</span>
                      )}
                    </div>
                    
                    {/* Item Name & Price */}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 truncate pr-4">{item.name}</div>
                      <div className="text-gray-500 mt-0.5">
                        Qty: {item.quantity}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 font-bold text-gray-900 text-right">
                      UGX {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      ))}
    </div>
  );
}
