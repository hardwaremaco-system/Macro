// src/app/(shop)/layout.tsx
import React from 'react';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Customer Top Alert Notification Banner */}
      <div className="bg-blue-900 text-white text-center py-2 px-4 text-xs font-medium tracking-wide">
        📦 Same-day store pick-up & region-wide delivery services available!
      </div>

      {/* Main Header Anchor (We will fill this component in our next step) */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-black text-blue-900 tracking-tight">MACRO <span className="text-amber-500">HARDWARE</span></span>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
            <span className="cursor-not-allowed">Categories</span>
            <span className="cursor-not-allowed">Promotions</span>
            <span className="cursor-not-allowed">News & Events</span>
          </nav>
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">🛒</div>
        </div>
      </header>

      {/* Dynamic Content Mount point */}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>

      {/* Global Structural Footer */}
      <footer className="bg-gray-900 text-gray-400 text-xs py-6 border-t border-gray-800 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Macro Hardware Engine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
