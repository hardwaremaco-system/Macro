// src/app/(admin)/admin/page.tsx
'use client';

import React from 'react';
import { TrendingUp, Package, ShoppingCart, Users, AlertCircle } from 'lucide-react';

const stats = [
  { name: 'Total Revenue', value: 'UGX 12.5M', change: '+14%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { name: 'New Orders', value: '34', change: '+5%', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Total Customers', value: '1,240', change: '+12%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  { name: 'Low Stock Items', value: '8', change: 'Requires action', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
];

export default function AdminOverviewPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back. Here is what is happening at Macro Hardware today.</p>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500 mb-1">{stat.name}</p>
                <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                <p className={`text-xs font-bold mt-2 ${stat.change.includes('+') ? 'text-green-600' : 'text-amber-600'}`}>
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table (Placeholder) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-black text-gray-900">Recent Orders</h2>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="p-6">
            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              Live database connection pending...
            </div>
          </div>
        </div>

        {/* Action Alerts Sidebar */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-black text-gray-900">Action Required</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
               <li className="flex gap-3">
                 <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                 <div>
                   <p className="text-sm font-bold text-gray-900">Restock PVC Pipes</p>
                   <p className="text-xs text-gray-500">Inventory fell below 10 units.</p>
                 </div>
               </li>
               <li className="flex gap-3">
                 <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                 <div>
                   <p className="text-sm font-bold text-gray-900">2 Unconfirmed Orders</p>
                   <p className="text-xs text-gray-500">Orders pending review for over 24 hours.</p>
                 </div>
               </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
