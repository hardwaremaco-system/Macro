// src/app/(shop)/profile/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'firebase/auth';

// Strict relative paths
import { useAuth } from '../../../context/AuthContext';
import { auth } from '../../../lib/firebase/client';

export default function CustomerProfilePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  // Protect route: Redirect to login if they are not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  // Prevent flicker while checking auth state
  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Get first letter of name or email for the avatar circle
  const initial = profile?.fullName 
    ? profile.fullName.charAt(0).toUpperCase() 
    : user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

        {/* Left Sidebar: Profile Details */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-6 flex flex-col items-center">
            
            {/* Initial Avatar */}
            <div className="flex items-center justify-center w-24 h-24 bg-blue-50 text-blue-600 rounded-full mb-5 text-4xl font-black border border-blue-100">
              {initial}
            </div>
            
            <h2 className="text-xl font-black text-gray-900 text-center mb-1">
              {profile?.fullName || 'Valued Customer'}
            </h2>
            <p className="text-sm text-gray-500 text-center mb-8">{user.email}</p>

            <div className="w-full space-y-4 border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-gray-900">Phone:</span>
                <span className="text-gray-600">{profile?.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-gray-900">Role:</span>
                <span className="capitalize bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-black tracking-wider">
                  {profile?.role || 'User'}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full bg-white border border-red-200 text-red-600 py-3.5 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center shadow-sm"
          >
            Sign Out
          </button>
        </div>

        {/* Right Main Content: Account Dashboard Quick Links */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">My Account</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Orders Link Button */}
            <Link 
              href="/orders" 
              className="flex items-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
            >
              <div className="flex-1">
                <h3 className="text-lg font-black text-gray-900 mb-1 text-blue-600 group-hover:text-blue-800 transition-colors">My Orders</h3>
                <p className="text-sm text-gray-500">Track deliveries and view history</p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
