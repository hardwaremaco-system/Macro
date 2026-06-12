// src/app/(shop)/profile/orders/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Printer, AlertCircle } from 'lucide-react';
// Strict relative paths
import { db } from '../../../../../lib/firebase/client';
import { useAuth } from '../../../../../context/AuthContext';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      if (!user) return; // Wait for auth

      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
          setError('Order not found.');
          setLoading(false);
          return;
        }

        const orderData = orderSnap.data();

        // Security Check: Only the owner or an admin can view this receipt
        if (orderData.userId !== user.uid && profile?.role !== 'admin') {
          setError('You do not have permission to view this receipt.');
          setLoading(false);
          return;
        }

        setOrder({ id: orderSnap.id, ...orderData });
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, user, profile]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl flex flex-col items-center justify-center">
          <AlertCircle size={40} className="mb-4" />
          <h2 className="text-xl font-black mb-2">Access Denied</h2>
          <p className="font-medium">{error}</p>
          <button 
            onClick={() => router.push('/profile')} 
            className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            Return to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 
        BULLETPROOF PRINT STYLES 
        - Hides everything else on the page natively
        - Forces receipt to top-left to avoid blank gaps
        - Kills Next.js min-heights (fixes the blank page 2)
      */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            /* Hide absolutely everything in the body by default */
            body * {
              visibility: hidden;
            }
            
            /* Make ONLY the receipt and its children visible */
            .print-receipt-container, .print-receipt-container * {
              visibility: visible;
            }
            
            /* Break the receipt out of the layout and pin it to the top */
            .print-receipt-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100vw !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 15mm !important; /* Natural printable margins */
              box-sizing: border-box !important;
            }

            /* Remove browser-generated margins to prevent zooming/scaling */
            @page {
              size: portrait;
              margin: 0mm; 
            }

            /* Strip out Next.js Layout minimum heights that cause Page 2 */
            html, body {
              height: auto !important;
              min-height: 0 !important;
              background-color: white !important;
              -webkit-print-color-adjust: exact !important; 
              print-color-adjust: exact !important; 
            }
          }
        `
      }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 print-receipt-container">
        
        {/* Top Action Bar - Hidden during printing */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <button 
            onClick={() => router.back()} 
            className="text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Orders
          </button>
          <button 
            onClick={() => window.print()} 
            className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex items-center shadow-md uppercase tracking-wider"
          >
            <Printer size={18} className="mr-2" /> Print Receipt
          </button>
        </div>

        {/* Main Receipt Paper */}
        <div className="bg-white border border-gray-200 sm:rounded-2xl shadow-sm p-8 sm:p-12 print:border-none print:shadow-none print:p-0">
          
          {/* Header Section */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                Hi {order.customerDetails?.fullName?.split(' ')[0] || 'Customer'},
              </h1>
              <p className="text-gray-400 font-medium mt-1">Thanks for your order!</p>
            </div>
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-10 object-contain mr-3" />
              <span className="text-2xl font-black tracking-tight whitespace-nowrap">
                <span className="text-blue-600">MACRO</span> <span className="text-amber-500">HARDWARE</span>
              </span>
            </div>
          </div>

          {/* Logistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-3">Deliver To</h3>
              <div className="text-sm text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-900 block mb-1">{order.customerDetails?.fullName}</span>
                {order.customerDetails?.deliveryLocation}<br/>
                {order.customerDetails?.phone}<br/>
                {order.customerDetails?.email}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-3">Payment Method</h3>
              <div className="text-sm text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-900 uppercase block mb-1">
                  {order.paymentMethod?.replace(/_/g, ' ')}
                </span>
                Order #{order.id.slice(0, 8).toUpperCase()}<br/>
                Status: <span className="font-bold text-gray-900 uppercase">{order.status || 'Pending'}</span>
              </div>
            </div>
          </div>

          {/* Order Details Header */}
          <div className="flex justify-between items-end border-b border-gray-200 pb-3 mb-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Order Details</h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}
            </span>
          </div>

          {/* Items List */}
          <div className="space-y-6 mb-12">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex items-start gap-4 sm:gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0 print:border-gray-200">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 uppercase">No Img</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 pt-1">
                  <div className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-wide mb-2 pr-4">
                    {item.name}
                  </div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Qty <span className="text-gray-900 ml-2">{item.quantity}</span>
                  </div>
                </div>

                <div className="pt-1 text-sm font-black text-gray-900 shrink-0 text-right">
                  UGX {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Totals Section */}
          <div className="border-t border-gray-200 pt-6 flex justify-end">
            <div className="w-full sm:w-64 space-y-3">
              <div className="flex justify-between text-sm text-gray-500 font-bold">
                <span>Subtotal</span>
                <span>UGX {order.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 font-bold">
                <span>Delivery Fee</span>
                <span>Pending</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Total</span>
                <span className="text-lg font-black text-blue-600">UGX {order.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Print-only Footer Message */}
          <div className="hidden print:block mt-16 text-center text-xs text-gray-400 font-medium border-t border-gray-200 pt-4">
            Thank you for shopping with Macro Hardware. If you have any questions about this receipt, please contact support@macrohardware.com.
          </div>

        </div>
      </div>
    </>
  );
}
