// src/components/shop/TrustStrip.tsx
import React from 'react';
import { Truck, ShieldCheck, Tag, Headset } from 'lucide-react';

const trustFeatures = [
  { id: 1, icon: Truck, title: 'Fast Delivery', desc: 'Across the region' },
  { id: 2, icon: ShieldCheck, title: 'Quality Guarantee', desc: '100% genuine products' },
  { id: 3, icon: Tag, title: 'Best Prices', desc: 'Unbeatable wholesale rates' },
  { id: 4, icon: Headset, title: 'Expert Support', desc: 'We help you build' },
];

export default function TrustStrip() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className="flex items-center space-x-3 p-2">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Icon size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{feature.title}</h4>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
