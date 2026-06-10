// src/app/(auth)/layout.tsx
import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="text-3xl font-black text-blue-900 tracking-tight inline-block">
          MACRO <span className="text-amber-500">HARDWARE</span>
        </Link>
      </div>
      {children}
    </div>
  );
}
