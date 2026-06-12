// src/app/(shop)/build-and-invest/page.tsx
import React from 'react';
import Link from 'next/link';
import { Wallet, TrendingDown, Gift, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Build & Invest | Macro Hardware',
  description: 'Invest incrementally towards your construction materials. Start with 20,000 UGX and get 5 free bags of cement.',
};

export default function BuildAndInvestPage() {
  const benefits = [
    {
      icon: Wallet,
      title: 'Start Small, Build Big',
      description: 'You don’t need millions to start. Open your Build & Invest account with a minimum of just UGX 20,000 and deposit whenever you can.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: TrendingDown,
      title: 'Heavily Discounted Materials',
      description: 'When you are ready to construct, your invested funds unlock exclusive wholesale pricing, making your materials significantly cheaper than standard retail.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Gift,
      title: 'The 5-Bag Bonus',
      description: 'As a thank you for trusting Macro Hardware with your investment, we give you 5 FREE bags of premium cement the moment you make your first material withdrawal.',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: ShieldCheck,
      title: '100% Secure & Guaranteed',
      description: 'Your money is safe. Your funds are strictly tied to physical building materials, shielding your investment from inflation and price hikes.',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Hero Section */}
      <div className="bg-slate-900 pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold mb-6 border border-blue-500/30">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            Macro Financial Services
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
            Turn Your Savings Into <br/>
            <span className="text-amber-500">Bricks & Mortar.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            The smartest way to build in Uganda. Invest little by little, lock in cheaper material costs, and claim your free cement when it's time to break ground.
          </p>
          <Link href="/contact" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition-colors inline-flex items-center shadow-2xl shadow-blue-900/50">
            Open Your Account Today <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>

      {/* Benefits Grid (Pulls up into the hero) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${benefit.color}`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it Works Section */}
      <div className="max-w-4xl mx-auto px-4 mt-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900">How It Works</h2>
          <p className="text-gray-500 mt-4">Three simple steps to securing your future home.</p>
        </div>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          
          {/* Step 1 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-600 text-white font-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              1
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 text-lg mb-2">Register & Deposit</h3>
              <p className="text-sm text-gray-600">Sign up at our Kabale branch or contact our support team to open your Build & Invest ledger. Make your first deposit of at least UGX 20,000.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-amber-500 text-white font-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              2
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 text-lg mb-2">Grow Your Balance</h3>
              <p className="text-sm text-gray-600">Top up your account weekly, monthly, or whenever you have spare funds. Track your total balance safely with our financial team.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-600 text-white font-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              3
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 text-lg mb-2">Build & Claim Free Cement</h3>
              <p className="text-sm text-gray-600">When you are ready, convert your balance into materials at our heavily discounted rate, and we will load 5 free bags of cement onto your first delivery truck!</p>
            </div>
          </div>

        </div>
      </div>

      {/* CTA Bottom */}
      <div className="max-w-4xl mx-auto px-4 mt-32">
        <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-black mb-4">Ready to start investing?</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            Stop waiting for a massive lump sum. Start your building journey today with Macro Hardware.
          </p>
          <Link href="/contact" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-black hover:bg-gray-50 transition-colors inline-block">
            Contact Us to Apply
          </Link>
        </div>
      </div>

    </div>
  );
}
