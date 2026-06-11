// src/app/(admin)/layout.tsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  FileText,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
// Strict relative path
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../lib/firebase/client';
import { signOut } from 'firebase/auth';

const adminLinks = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Trusted Brands', href: '/admin/brands', icon: ShieldCheck },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'News & Events', href: '/admin/news', icon: FileText },
  { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, isEditor, loading } = useAuth();

  // Route Protection Strategy:
  // If we finish loading and there is either no user, OR the user is NOT an admin/editor, kick them out.
  useEffect(() => {
    if (!loading) {
      if (!user || (!isAdmin && !isEditor)) {
        router.push('/');
      }
    }
  }, [user, isAdmin, isEditor, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  // Prevent rendering the dashboard interface while checking security rules
  if (loading || !user || (!isAdmin && !isEditor)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-blue-900 text-white flex-shrink-0 fixed h-full z-20">
        <div className="h-16 flex items-center px-6 bg-blue-950 border-b border-blue-800">
          <span className="text-xl font-black tracking-tight">MACRO <span className="text-amber-500">ADMIN</span></span>
        </div>

        <div className="p-4">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-4 px-2">Management</div>
          <nav className="space-y-1">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} className="mr-3 flex-shrink-0" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-blue-800 bg-blue-950">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-blue-900 rounded-lg transition-colors"
          >
            <LogOut size={18} className="mr-3" /> Exit Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900 leading-none">Admin User</div>
              <div className="text-xs text-gray-500 mt-1">{user.email}</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black">
              A
            </div>
          </div>
        </header>

        {/* Page Content Injection */}
        <div className="p-8 flex-grow">
          {children}
        </div>
      </main>

    </div>
  );
}
