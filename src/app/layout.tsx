import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { AuthProvider } from '../context/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.macrohardwarekabale.com'),
  title: {
    default: 'Macro Hardware Kabale | Construction, Plumbing & Roofing Supplies',
    template: '%s | Macro Hardware Kabale',
  },
  description: 'Your trusted hardware shop in Kabale. We specialize in quality construction materials, plumbing, paints, steel, and roofing. Save and build with Macro.',
  keywords: [
    'hardware shop Kabale',
    'construction materials Uganda',
    'plumbing supplies Kabale',
    'roofing sheets Kigezi',
    'paints and steel Kabale',
    'build with Macro',
  ],
  openGraph: {
    title: 'Macro Hardware Kabale | Quality Building Supplies',
    description: 'Save and build with Macro. We provide premium construction, plumbing, and roofing materials in Kabale.',
    url: '/',
    siteName: 'Macro Hardware Kabale',
    images: [
      {
        url: '/og-image.jpg', // Resolves to https://www.macrohardwarekabale.com/og-image.jpg
        width: 1009,
        height: 764,
        alt: 'Macro Hardware Kabale Storefront',
      },
    ],
    locale: 'en_UG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Macro Hardware Kabale | Build with Quality',
    description: 'Save and build with Macro. Your one-stop hardware shop in Kabale.',
    images: ['/og-image.jpg'],
  },
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

        {/* --- GOOGLE ANALYTICS --- */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4JFRJWCLY8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-4JFRJWCLY8');
          `}
        </Script>
      </body>
    </html>
  );
}
