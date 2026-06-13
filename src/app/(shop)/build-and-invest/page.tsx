// src/app/(shop)/build-and-invest/page.tsx
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Build & Invest | Macro Hardware',
  description: 'Invest incrementally towards your construction materials. Start with 20,000 UGX and get 5 free bags of cement.',
};

export default function BuildAndInvestPage() {
  const benefits = [
    {
      title: 'Start Small, Build Big',
      description: 'You don’t need millions to start. Open your Build & Invest account with a minimum of just UGX 20,000 and deposit whenever you can.',
    },
    {
      title: 'Heavily Discounted Materials',
      description: 'When you are ready to construct, your invested funds unlock exclusive wholesale pricing, making your materials significantly cheaper than standard retail.',
    },
    {
      title: 'The 5-Bag Bonus',
      description: 'As a thank you for trusting Macro Hardware with your investment, we give you 5 FREE bags of premium cement the moment you make your first material withdrawal.',
    },
    {
      title: '100% Secure & Guaranteed',
      description: 'Your money is safe. Your funds are strictly tied to physical building materials, shielding your investment from inflation and price hikes.',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-0">
      
      {/* Hero Section */}
      <div className="bg-slate-900 pt-20 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        {/* Aligned Left */}
        <div className="max-w-7xl mx-auto text-left relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight max-w-3xl">
            Turn Your Savings Into <br/>
            <span className="text-amber-500">Bricks & Mortar.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed">
            The smartest way to build in Uganda. Invest little by little, lock in cheaper material costs, and claim your free cement when it's time to break ground.
          </p>
        </div>
      </div>

      {/* Benefits Grid (Pulls up into the hero) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-center">
              <h3 className="text-xl font-black text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
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

      {/* CTA Bottom - Edge to Edge, Gray Background, Sharp Edges, Left Aligned */}
      <div className="w-full bg-gray-200 mt-32 border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-left">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Ready to start investing?</h2>
          <p className="text-gray-700 text-lg mb-8 max-w-2xl">
            Stop waiting for a massive lump sum. Start your building journey today with Macro Hardware.
          </p>
          <Link href="/contact" className="bg-blue-600 text-white px-8 py-4 rounded-none font-black hover:bg-blue-700 transition-colors inline-block shadow-md uppercase tracking-wider text-sm">
            Contact Us to Apply
          </Link>
        </div>
      </div>

    </div>
  );
}
