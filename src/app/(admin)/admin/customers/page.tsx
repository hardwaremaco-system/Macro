// src/app/(admin)/admin/customers/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Users, Search, Shield, User as UserIcon } from 'lucide-react';
// Strict relative path
import { db } from '../../../../lib/firebase/client';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(usersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string, currentName: string) => {
    if (!confirm(`Are you sure you want to change ${currentName}'s role to ${newRole.toUpperCase()}?`)) return;
    
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      // Update local state to reflect change instantly
      setCustomers(customers.map(c => c.id === userId ? { ...c, role: newRole } : c));
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role.');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Customer Management</h1>
          <p className="text-sm text-gray-500 mt-1">View registered users and manage their access roles.</p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Account Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    Loading customer database...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                      <Users size={24} />
                    </div>
                    <p className="text-gray-500 font-medium">No registered customers found.</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${customer.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                          {customer.role === 'admin' ? <Shield size={18} /> : <UserIcon size={18} />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{customer.fullName || 'No Name Provided'}</div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">ID: {customer.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{customer.phone || 'No phone'}</div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {customer.createdAt?.toDate ? customer.createdAt.toDate().toLocaleDateString() : 'Unknown'}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <select
                        value={customer.role || 'user'}
                        onChange={(e) => handleRoleChange(customer.id, e.target.value, customer.fullName || customer.email)}
                        className={`text-sm font-bold rounded-lg px-3 py-1.5 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          customer.role === 'admin' 
                            ? 'bg-amber-50 border-amber-200 text-amber-700' 
                            : 'bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
