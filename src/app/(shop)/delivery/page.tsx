// src/app/(shop)/delivery/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, MapPin, Clock, PackageOpen, HardHat, AlertCircle } from 'lucide-react';

export default function DeliveryInfoPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Page Header */}
      <div className="bg-gray-50 py-16 sm:py-20 border-b border-gray-200 text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Delivery Information
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
          Everything you need to know about getting your hardware and construction materials safely to your site.
        </p>
      </div>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-10">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Store
          </Link>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16">
          
          {/* Card 1: Delivery Methods */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="bg-slate-100 text-slate-900 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Truck size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Delivery Methods</h3>
            <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <li><strong className="text-slate-800">Light Vehicles:</strong> For small tools, paint, and accessories.</li>
              <li><strong className="text-slate-800">Flatbed Trucks:</strong> For heavy materials like cement, iron sheets, and steel bars.</li>
              <li><strong className="text-slate-800">Tipper Trucks:</strong> Specifically for bulk aggregates like sand, gravel, and hardcore.</li>
            </ul>
          </div>

          {/* Card 2: Delivery Areas */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="bg-amber-100 text-amber-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <MapPin size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Coverage & Rates</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Delivery charges are calculated at checkout based on the total weight of your order and the distance to your construction site.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              We offer flat-rate delivery for local zones, while regional and upcountry deliveries may require custom quotes depending on the truck size required.
            </p>
          </div>

          {/* Card 3: Site Access & Offloading */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="bg-red-100 text-red-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <HardHat size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Site Access & Offloading</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              <strong>Site Accessibility:</strong> Please ensure your delivery site has adequate clearance for heavy-duty trucks. If a truck cannot safely access the site, delivery will be made to the nearest safe point.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong>Offloading:</strong> Unless explicitly arranged and paid for beforehand, offloading (e.g., carrying cement bags or bricks into a building) is the responsibility of the customer.
            </p>
          </div>

          {/* Card 4: Store Pickup */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="bg-green-100 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <PackageOpen size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Free Store Pickup</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Prefer to use your own transport? Select "Store Pickup" at checkout.
            </p>
            <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <li>Orders are typically ready within 2-4 hours of payment confirmation.</li>
              <li>Please bring your order confirmation email and a valid ID.</li>
              <li>Our team will help load the materials into your vehicle free of charge.</li>
            </ul>
          </div>

        </div>

        {/* Important Notice Block */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 shadow-md">
          <div className="text-amber-500 shrink-0 mt-1">
            <AlertCircle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white mb-2">Receiving Your Order</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              We highly advise that a designated site manager or property owner is present during delivery. Please inspect all materials (especially fragile items like tiles or glass) before signing the delivery note. Claims for damages or shortages must be reported immediately to the driver and our customer support team.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-sm text-gray-400">
                <Clock size={16} className="mr-2 text-amber-500" /> Standard Delivery: 1-3 Business Days
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center border-t border-gray-100 pt-12">
          <h3 className="text-xl font-black text-slate-900 mb-3">Need to schedule a specific delivery time?</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-lg mx-auto">
            If you are pouring concrete or have a tight construction schedule, contact us directly to arrange a coordinated delivery slot.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center bg-amber-500 text-slate-900 px-8 py-3.5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-sm"
          >
            Contact Dispatch Team
          </Link>
        </div>

      </div>
    </div>
  );
}
