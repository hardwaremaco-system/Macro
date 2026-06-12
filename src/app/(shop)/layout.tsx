// src/app/(shop)/layout.tsx
import React from 'react';
// Forced relative paths
import Header from '../../components/shop/Header';
import Footer from '../../components/shop/Footer';
import FloatingWhatsApp from '../../components/ui/FloatingWhatsApp';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      <Footer />
      {/* Placed at the bottom so it floats over everything */}
      <FloatingWhatsApp />
    </div>
  );
}
