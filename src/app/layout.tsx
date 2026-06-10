// src/app/layout.tsx
import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Macro Hardware | Premium Building & Construction Supplies',
    template: '%s | Macro Hardware',
  },
  description: 'Shop cement, roofing sheets, plumbing fixtures, electrical appliances, tools, and high-quality safety gear at Macro Hardware.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1e3a8a', // Corporate deep blue brand identity
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900 flex flex-col min-height-screen">
        <AuthProvider>
          <div className="flex flex-col flex-grow">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
