// src/app/(shop)/checkout/success/page.tsx
import React from 'react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-200">
        <span className="text-5xl">✅</span>
      </div>
      
      <h1 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        Thank you for shopping with Macro Hardware. Your order has been securely received and is now pending processing. Our team will contact you shortly to confirm delivery details.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/profile" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm">
          Track My Order
        </Link>
        <Link href="/" className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
