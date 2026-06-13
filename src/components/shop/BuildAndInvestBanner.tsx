// src/components/shop/BuildAndInvestBanner.tsx
import React from 'react';
import Link from 'next/link';

export default function BuildAndInvestBanner() {
  return (
    <div className="w-full bg-gradient-to-br from-blue-900 to-slate-900 overflow-hidden relative border-y border-blue-950">

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl"></div>

      <div className="relative py-10 px-4 md:py-12 flex flex-col items-center text-center">
        
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3 uppercase tracking-tight">
            Macro <span className="text-amber-500">Build & Invest</span>
          </h2>
          
          <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            Start your construction journey today with as little as <strong className="text-white">UGX 20,000</strong>. Save up over time, unlock exclusive wholesale prices, and get a head start on your dream home.
          </p>

          <Link 
            href="/build-and-invest" 
            className="w-full sm:w-auto bg-amber-500 text-slate-900 px-8 py-3 rounded-none font-black hover:bg-amber-400 transition-colors inline-block uppercase tracking-widest shadow-lg shadow-amber-500/20"
          >
            Learn How It Works
          </Link>
        </div>

      </div>
    </div>
  );
}
