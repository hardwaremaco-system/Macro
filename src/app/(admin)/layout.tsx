// src/app/(admin)/layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  FileText,
  ShieldCheck,
  MessageSquare,
  Search,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
  Lock, // Added Lock icon for the restricted message
  Mailbox // Added Mailbox icon for the Broadcast link
} from 'lucide-react';

// Strict relative path
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../lib/firebase/client';
import { signOut } from 'firebase/auth';

// 1. Added "adminOnly" flags to sensitive routes
const adminLinks = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Customers', href: '/admin/customers', icon: Users, adminOnly: true },
  { name: 'Email Broadcast', href: '/admin/broadcast', icon: Mailbox, adminOnly: true },
  { name: 'Search Analytics', href: '/admin/search-analytics', icon: Search, adminOnly: true },
  { name: 'Trusted Brands', href: '/admin/brands', icon: ShieldCheck },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'News & Events', href: '/admin/news', icon: FileText },
  { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Settings', href: '/admin/settings', icon: Settings, adminOnly: true },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, isEditor, loading } = useAuth();

  // Responsive UI States
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // General Route Protection Strategy
  useEffect(() => {
    if (!loading) {
      if (!user || (!isAdmin && !isEditor)) {
        router.push('/');
      }
    }
  }, [user, isAdmin, isEditor, loading, router]);

  // Auto-close mobile menu when a navigation link is clicked
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading || !user || (!isAdmin && !isEditor)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  // 2. Filter links for the sidebar so Editors don't even see them
  const visibleLinks = adminLinks.filter(link => {
    if (link.adminOnly && !isAdmin) return false;
    return true;
  });

  // 3. Security Check: Did an Editor type the URL manually?
  const isRestrictedRoute = adminLinks.some(
    link => link.adminOnly && (pathname === link.href || pathname.startsWith(`${link.href}/`))
  );

  const isAccessDenied = isRestrictedRoute && !isAdmin;

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-blue-900 text-white z-30 transition-all duration-300 ease-in-out flex flex-col border-r border-blue-950 shadow-xl md:shadow-none
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'} 
          ${isDesktopExpanded ? 'md:w-64' : 'md:w-20'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 bg-blue-950 border-b border-blue-800 shrink-0">
          <div className="flex items-center overflow-hidden whitespace-nowrap">
            {/* Desktop Collapsed View (M A) */}
            <span className={`text-xl font-black tracking-tight transition-opacity ${!isDesktopExpanded && !isMobileOpen ? 'md:block hidden' : 'hidden'}`}>
              M<span className="text-amber-500">A</span>
            </span>

            {/* Expanded View (MACRO ADMIN) */}
            <span className={`text-xl font-black tracking-tight transition-opacity ${isDesktopExpanded || isMobileOpen ? 'block' : 'hidden md:hidden'}`}>
              MACRO <span className="text-amber-500">ADMIN</span>
            </span>
          </div>

          {/* Mobile Close Button */}
          <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-blue-300 hover:text-white p-1">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 overflow-x-hidden custom-scrollbar">
          <div className={`text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 px-5 ${!isDesktopExpanded && !isMobileOpen ? 'text-center px-0' : ''}`}>
             {(!isDesktopExpanded && !isMobileOpen) ? '...' : 'Management'}
          </div>

          <nav className="space-y-1.5 px-3">
            {/* We map over visibleLinks instead of all adminLinks */}
            {visibleLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  title={!isDesktopExpanded ? link.name : ''} 
                  className={`flex items-center px-3 py-3 rounded-xl text-sm font-bold transition-colors group ${
                    isActive ? 'bg-blue-800 text-white shadow-sm' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} className={`flex-shrink-0 ${!isDesktopExpanded && !isMobileOpen ? 'mx-auto' : 'mr-3'}`} />
                  <span className={`whitespace-nowrap transition-opacity ${!isDesktopExpanded && !isMobileOpen ? 'hidden' : 'block'}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Exit & Toggle) */}
        <div className="p-3 border-t border-blue-800 bg-blue-950 shrink-0 space-y-2">

          {/* Desktop Toggle Button */}
          <button 
            onClick={() => setIsDesktopExpanded(!isDesktopExpanded)}
            className="hidden md:flex items-center w-full px-3 py-2 text-xs font-bold text-blue-300 hover:text-white hover:bg-blue-900 rounded-lg transition-colors"
          >
            {isDesktopExpanded ? (
              <><ChevronLeft size={18} className="mr-3 shrink-0" /> Collapse Menu</>
            ) : (
              <ChevronRight size={18} className="mx-auto shrink-0" />
            )}
          </button>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            title={!isDesktopExpanded ? 'Exit Dashboard' : ''}
            className={`flex items-center w-full px-3 py-2.5 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors ${!isDesktopExpanded && !isMobileOpen ? 'justify-center' : ''}`}
          >
            <LogOut size={20} className={`shrink-0 ${!isDesktopExpanded && !isMobileOpen ? '' : 'mr-3'}`} /> 
            <span className={`whitespace-nowrap ${!isDesktopExpanded && !isMobileOpen ? 'hidden' : 'block'}`}>
              Exit Dashboard
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ease-in-out min-w-0
          ${isDesktopExpanded ? 'md:ml-64' : 'md:ml-20'}
        `}
      >
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 shadow-sm sticky top-0 z-10 shrink-0">

          {/* Mobile Hamburger Button */}
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileOpen(true)} 
              className="md:hidden p-2 -ml-2 mr-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Admin User Profile Tag */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-black text-gray-900 leading-none">
                {isAdmin ? 'Admin Portal' : 'Editor Portal'}
              </div>
              <div className="text-xs font-bold text-gray-500 mt-1">{user.email}</div>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black border ${isAdmin ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
              {user.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content Injection / Security Block */}
        <div className="p-4 sm:p-8 flex-grow">
          {isAccessDenied ? (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 border-8 border-red-100">
                <Lock size={48} strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Access Restricted</h2>
              <p className="text-gray-500 max-w-md mx-auto text-base">
                Your current role as an Editor does not grant you the authority to view or modify this section. Please contact the main administrator if you require access.
              </p>
              <Link href="/admin" className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors inline-block shadow-md">
                Return to Dashboard
              </Link>
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      {/* Global Style to slim down the custom scrollbar in the sidebar */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.2);
          }
        `
      }} />
    </div>
  );
}
