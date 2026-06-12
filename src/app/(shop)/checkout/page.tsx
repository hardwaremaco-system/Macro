// src/app/(shop)/checkout/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// Strict relative paths
import { useCartStore } from '../../../store/useCartStore';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase/client';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(false);
  // Flag to prevent the useEffect from kicking us to the cart page after checkout
  const [isOrderPlaced, setIsOrderPlaced] = useState(false); 

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    deliveryLocation: '',
    paymentMethod: 'pay_on_delivery',
    notes: '',
  });

  useEffect(() => {
    // Only redirect to cart if the cart is empty AND they haven't just placed an order
    if (items.length === 0 && !isOrderPlaced) {
      router.push('/cart');
    }
  }, [items, router, isOrderPlaced]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Build the order object
      const orderData = {
        userId: user ? user.uid : 'guest',
        customerDetails: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          deliveryLocation: formData.deliveryLocation,
        },
        items: items.map(item => ({
          id: item.id, name: item.name, price: item.price, quantity: item.quantity, image: item.image
        })),
        totalAmount: getCartTotal(),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        status: 'Pending',
        createdAt: serverTimestamp(),
      };

      // 2. Save to Firestore 'orders' collection
      const docRef = await addDoc(collection(db, 'orders'), orderData);

      // 3. Trigger Brevo Emails via our new API
      try {
        await fetch('/api/email/order-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...orderData, orderId: docRef.id }),
        });
      } catch (emailError) {
        console.error('Email sending failed, but order was placed:', emailError);
      }

      // 4. Set flag, Clear cart & Redirect safely
      setIsOrderPlaced(true);
      clearCart();
      router.push('/checkout/success');
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an issue placing your order. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0 && !isOrderPlaced) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 border-b pb-2">Customer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="For your receipt" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Delivery Location / Address</label>
                <input name="deliveryLocation" required value={formData.deliveryLocation} onChange={handleChange} placeholder="E.g., Plot 10, Main Street, Kabale Town" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 border-b pb-2">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="radio" name="paymentMethod" value="pay_on_delivery" checked={formData.paymentMethod === 'pay_on_delivery'} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                <span className="ml-3 font-bold text-gray-900 text-sm">Pay on Delivery (Cash/MoMo)</span>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="radio" name="paymentMethod" value="store_pickup" checked={formData.paymentMethod === 'store_pickup'} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                <span className="ml-3 font-bold text-gray-900 text-sm">Pay at Store (Pickup)</span>
              </label>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 border-b pb-2">Additional Notes (Optional)</h2>
            <textarea name="notes" rows={3} value={formData.notes} onChange={handleChange} placeholder="Directions, special requests, etc." className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
        </div>

        {/* Right Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-inner sticky top-24">
            <h2 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-200 pb-2">Your Order</h2>

            <ul className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity}x <span className="truncate inline-block max-w-[150px] align-bottom">{item.name}</span>
                  </span>
                  <span className="font-bold text-gray-900">UGX {(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-gray-200 flex justify-between mb-6">
              <span className="text-base font-black text-gray-900">Total to Pay</span>
              <span className="text-xl font-black text-blue-600">UGX {getCartTotal().toLocaleString()}</span>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-black hover:bg-blue-700 transition-colors flex items-center justify-center shadow-md disabled:opacity-50">
              {loading ? 'Processing Order...' : 'Confirm Order'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              By confirming your order, you agree to our Terms and Conditions.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
