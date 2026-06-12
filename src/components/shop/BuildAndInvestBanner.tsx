// src/components/shop/BuildAndInvestBanner.tsx
import React from 'react';
import Link from 'next/link';
import { Wallet, Hammer, Gift, ArrowRight } from 'lucide-react';

export default function BuildAndInvestBanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl"></div>

        <div className="relative p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-800/50 border border-blue-700 text-amber-400 text-xs font-black uppercase tracking-widest mb-6">
              <Wallet size={14} /> New Service
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              Macro <span className="text-amber-500">Build & Invest</span>
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              Start your construction journey today with as little as <strong className="text-white">UGX 20,000</strong>. Save up over time, unlock exclusive wholesale prices, and get a head start on your dream home.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                href="/build-and-invest" 
                className="w-full sm:w-auto bg-amber-500 text-slate-900 px-8 py-4 rounded-xl font-black hover:bg-amber-400 transition-colors flex items-center justify-center shadow-lg shadow-amber-500/20"
              >
                Learn How It Works <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>

          {/* Quick Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-300 rounded-full flex items-center justify-center mb-4">
                <Wallet size={24} />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Low Minimum</h3>
              <p className="text-blue-200 text-sm">Invest starting from just UGX 20K.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mb-4">
                <Gift size={24} />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Free Cement</h3>
              <p className="text-blue-200 text-sm">Get 5 FREE bags when you start building.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
