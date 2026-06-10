// src/app/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
// THIS IS THE MOST IMPORTANT LINE IN THE ENTIRE APP
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Macro Hardware',
  description: 'Premium Building & Construction Supplies',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <AuthProvider>
          <div className="flex flex-col flex-grow">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
