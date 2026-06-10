// src/components/shop/WhyChooseUs.tsx
import React from 'react';
import { PackageCheck, CreditCard, Users } from 'lucide-react';

const reasons = [
  {
    icon: PackageCheck,
    title: 'Extensive Catalogue',
    description: 'From foundation to finishing, we stock everything you need under one roof.',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payments',
    description: 'Secure checkout with options to pay on delivery or during store pickup.',
  },
  {
    icon: Users,
    title: 'Expert Consultations',
    description: 'Not sure what you need? Our hardware experts are ready to guide your purchase.',
  },
];

export default function WhyChooseUs() {
  return (
    <div className="bg-white border-y border-gray-200 mt-8 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Why Choose Macro Hardware?</h2>
          <p className="mt-2 text-sm text-gray-500">Your trusted partner in building and construction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Icon size={32} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{reason.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
