// src/app/(shop)/terms/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditionsPage() {
  const lastUpdated = "June 12, 2026";

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Page Header */}
      <div className="bg-gray-50 py-16 sm:py-20 border-b border-gray-200 text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Terms & Conditions
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
          Please read these terms carefully before using the Macro Hardware platform or making a purchase.
        </p>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Store
          </Link>
        </div>

        <div className="prose prose-slate max-w-none text-gray-600 space-y-8">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Last Updated: {lastUpdated}
          </p>

          <section>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              Welcome to Macro Hardware. By accessing our website, registering an account, or purchasing building materials, tools, or other hardware products from us, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please refrain from using our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">2. Product Information & Accuracy</h2>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li><strong>Images & Colors:</strong> We make every effort to display products (such as paint colors and material finishes) as accurately as possible. However, actual colors may vary slightly due to your screen settings or lighting conditions.</li>
              <li><strong>Specifications:</strong> Dimensions, weights, and capacities (e.g., for cement bags, iron sheets, and water tanks) are approximate and provided by the manufacturer.</li>
              <li><strong>Stock Availability:</strong> All products are subject to availability. We reserve the right to limit the quantities of any products we offer, especially for bulk hardware orders.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">3. Pricing & Payments</h2>
            <p className="leading-relaxed mb-3">
              All prices displayed on the Macro Hardware platform are in <strong>Ugandan Shillings (UGX)</strong> and are inclusive of applicable taxes unless stated otherwise.
            </p>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li>Prices for our materials are subject to change without notice due to market fluctuations in hardware and construction materials.</li>
              <li>We shall not be liable to you or any third party for any modification, price change, or suspension of a product.</li>
              <li>Full payment must be cleared before goods are dispatched for delivery or released for store pickup.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">4. Delivery & Pickup</h2>
            <p className="leading-relaxed mb-3">
              We offer delivery services across select regions and a convenient in-store pickup option.
            </p>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li><strong>Site Accessibility:</strong> For large deliveries (e.g., sand, bricks, roofing materials), the customer must ensure the delivery site is accessible by heavy-duty trucks.</li>
              <li><strong>Offloading:</strong> Unless explicitly agreed upon, offloading is the responsibility of the buyer.</li>
              <li><strong>Risk of Loss:</strong> The risk of loss and title for items purchased pass to you upon our delivery to the carrier or upon pickup from our premises.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">5. Returns & Refunds</h2>
            <p className="leading-relaxed">
              We accept returns within 7 days of purchase for items that are unused, in their original packaging, and accompanied by a valid receipt. <strong>Exceptions apply:</strong> Custom-mixed paints, cut-to-size materials (like timber or cables), and bulk bulk aggregates (sand/gravel) are non-refundable. Please inspect all goods thoroughly at the time of delivery or pickup.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">6. User Accounts</h2>
            <p className="leading-relaxed">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. Macro Hardware reserves the right to terminate accounts, remove or edit content, or cancel orders in our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">7. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of the Republic of Uganda, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Contact Block */}
          <div className="mt-12 bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Questions about our Terms?</h3>
              <p className="text-sm text-gray-500">Our customer support team is here to help clarify any details.</p>
            </div>
            <Link 
              href="/contact" 
              className="mt-4 sm:mt-0 bg-slate-900 text-amber-500 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Contact Support
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
