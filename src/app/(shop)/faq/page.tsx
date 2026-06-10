// src/app/(shop)/faq/page.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "Do you deliver materials to the construction site?",
    answer: "Yes! We offer delivery services for bulk orders directly to your construction site within Kabale and the surrounding Western Region districts. Delivery fees are calculated at checkout or during quote estimation."
  },
  {
    question: "Can I pay on delivery?",
    answer: "Absolutely. We offer 'Pay on Delivery' for select orders, allowing you to inspect the materials before making a payment via Cash or Mobile Money."
  },
  {
    question: "Do you supply bulk orders for large contractors?",
    answer: "Yes, we specialize in bulk supply. If you are a contractor or building a large commercial project, please use our Contact page to request a custom quote with wholesale pricing."
  },
  {
    question: "Are your products genuine?",
    answer: "100%. We source our cement, roofing materials, and electrical supplies directly from authorized manufacturers like Tororo, Hima, and Roofings Group to guarantee authenticity."
  },
  {
    question: "What happens if I receive damaged materials?",
    answer: "If any materials arrive damaged, please notify our delivery team immediately or contact support within 24 hours. We will arrange a replacement at no extra cost to you."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600">Find answers to common questions about ordering, delivery, and our products.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`border rounded-xl transition-colors duration-200 ${openIndex === index ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="font-bold text-gray-900 pr-4">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="text-blue-600 flex-shrink-0" />
              ) : (
                <ChevronDown className="text-gray-400 flex-shrink-0" />
              )}
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-blue-100 pt-4 mt-2">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center bg-gray-50 rounded-2xl p-8 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Still have questions?</h3>
        <p className="text-gray-600 mb-6 text-sm">We are here to help. Reach out to our support team directly.</p>
        <a href="/contact" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
          Contact Support
        </a>
      </div>
    </div>
  );
}
