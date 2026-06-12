// src/components/shop/OrderHistory.tsx
import React from 'react';
import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';

// Status color helper function
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
    case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-amber-100 text-amber-800 border-amber-200'; // Pending
  }
};

export default function OrderHistory({ orders, loading }: { orders: any[], loading: boolean }) {

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="w-20 h-20 bg-gray-50 border border-gray-100 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={40} />
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">No orders found</h3>
        <p className="text-gray-500 text-sm mb-8">You haven't placed any building material orders with us yet.</p>
        <Link href="/categories" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors inline-block uppercase tracking-wider text-sm shadow-md">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Link 
          href={`/profile/orders/${order.id}`} 
          key={order.id} 
          className="block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 group"
        >
          {/* Card Header: Logo, ID, Date, and Status */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Macro Hardware" className="h-6 object-contain hidden sm:block" />
              <div>
                <div className="text-sm font-black text-gray-900 uppercase tracking-wider">
                  Order #{order.id.slice(0, 8)}
                </div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Just now'}
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border ${getStatusColor(order.status)} w-fit`}>
              {order.status || 'Pending'}
            </span>
          </div>

          {/* Card Body: Split Layout */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            
            {/* Left Column: Logistics & Totals */}
            <div className="md:col-span-5 flex flex-col space-y-6">
              <div>
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Deliver To</h4>
                <p className="text-sm font-bold text-gray-900 leading-snug">
                  {order.customerDetails?.fullName}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  {order.customerDetails?.deliveryLocation || 'No address provided'}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  {order.customerDetails?.phone}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Payment Method</h4>
                <p className="text-sm font-bold text-gray-900 uppercase">
                  {order.paymentMethod?.replace(/_/g, ' ') || 'N/A'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</h4>
                <p className="text-xl font-black text-blue-600">
                  UGX {order.totalAmount?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Right Column: Item Details */}
            <div className="md:col-span-7">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                Order Details
              </h4>
              
              <div className="space-y-4">
                {/* Show a maximum of 3 items in the summary card to keep it clean */}
                {order.items?.slice(0, 3).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400 uppercase">No Img</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate pr-4">
                        {item.name}
                      </div>
                      <div className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">
                        Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Indication if there are more items hidden */}
                {order.items?.length > 3 && (
                  <div className="text-xs font-bold text-gray-500 pt-2 pl-18">
                    + {order.items.length - 3} more item(s)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card Footer: Action Button */}
          <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4 flex justify-between items-center transition-colors group-hover:bg-blue-50/30">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Click to view full receipt
            </span>
            <span className="flex items-center text-sm font-black text-blue-600 uppercase tracking-wide">
              View Receipt 
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1.5 transition-transform" />
            </span>
          </div>

        </Link>
      ))}
    </div>
  );
}
