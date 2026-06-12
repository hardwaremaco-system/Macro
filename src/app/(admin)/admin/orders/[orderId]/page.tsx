// src/app/(admin)/admin/orders/[orderId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Package, MapPin, User, FileText } from 'lucide-react';
import { db } from '../../../../../lib/firebase/client';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
  if (!order) return <div className="p-8 text-center text-red-500">Order not found.</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center mb-8">
        <button onClick={() => router.back()} className="mr-4 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center border-b pb-3">
              <Package size={20} className="mr-2 text-blue-600" /> Items Ordered
            </h2>
            <div className="space-y-4">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 text-sm border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-md overflow-hidden flex items-center justify-center shrink-0">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : 'No Img'}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{item.name}</div>
                    <div className="text-gray-500 mt-1">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-black text-gray-900">
                    UGX {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Total Amount</span>
              <span className="text-2xl font-black text-blue-600">UGX {order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Shipping Info */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center border-b pb-3">
              <User size={20} className="mr-2 text-blue-600" /> Customer Details
            </h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-500 block text-xs font-bold uppercase">Name</span><span className="font-bold text-gray-900">{order.customerDetails?.fullName}</span></div>
              <div><span className="text-gray-500 block text-xs font-bold uppercase">Email</span><span className="font-bold text-gray-900">{order.customerDetails?.email || 'N/A'}</span></div>
              <div><span className="text-gray-500 block text-xs font-bold uppercase">Phone</span><span className="font-bold text-gray-900">{order.customerDetails?.phone}</span></div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center border-b pb-3">
              <MapPin size={20} className="mr-2 text-blue-600" /> Delivery Details
            </h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-500 block text-xs font-bold uppercase">Location</span><span className="font-bold text-gray-900">{order.customerDetails?.deliveryLocation}</span></div>
              <div><span className="text-gray-500 block text-xs font-bold uppercase">Payment Method</span><span className="font-bold text-gray-900 uppercase">{order.paymentMethod?.replace(/_/g, ' ')}</span></div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-black text-amber-900 mb-2 flex items-center">
                <FileText size={20} className="mr-2" /> Order Notes
              </h2>
              <p className="text-sm text-amber-800">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
