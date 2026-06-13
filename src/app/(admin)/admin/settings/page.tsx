// src/app/(admin)/admin/settings/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { Save, Link as LinkIcon, Users, Shield, CheckCircle, Database, Download } from 'lucide-react';
// Strict relative path
import { db } from '../../../../lib/firebase/client';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('social');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Tab 1: Social & Store Links
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '', // Acts as the X account
    instagram: '',
    tiktok: '',
  });

  // Tab 2: Team & Roles
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Global Settings (Socials)
      const settingsRef = doc(db, 'settings', 'global');
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists() && settingsSnap.data().socials) {
        setSocialLinks(settingsSnap.data().socials);
      }

      // 2. Fetch Users to manage roles
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersList = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTeamMembers(usersList);

    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- SAVE SOCIAL LINKS ---
  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateDoc(doc(db, 'settings', 'global'), {
        socials: socialLinks
      });
      setSuccessMsg('Social links updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Error saving socials:', error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  // --- UPDATE USER ROLE ---
  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;
    
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setTeamMembers(prev => prev.map(user => user.id === userId ? { ...user, role: newRole } : user));
      setSuccessMsg('User role updated!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role.');
    }
  };

  // --- EXPORT DATABASE (JSON BACKUPS) ---
  const handleExportData = async (collectionName: string) => {
    try {
      setSuccessMsg(`Preparing ${collectionName} backup...`);
      const snap = await getDocs(collection(db, collectionName));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `macrohardware_${collectionName}_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccessMsg(`${collectionName} downloaded successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Export error:', error);
      alert(`Failed to export ${collectionName}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">System Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage store configurations, staff access, and data backups.</p>
        </div>
        {successMsg && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-sm">
            <CheckCircle size={16} className="mr-2" /> {successMsg}
          </div>
        )}
      </div>

      {/* Settings Navigation */}
      <div className="flex space-x-2 border-b border-gray-200 mb-6 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('social')}
          className={`flex items-center px-5 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'social' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'}`}
        >
          <LinkIcon size={16} className="mr-2" /> Social Media
        </button>
        <button 
          onClick={() => setActiveTab('team')}
          className={`flex items-center px-5 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'team' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'}`}
        >
          <Users size={16} className="mr-2" /> Team Access
        </button>
        <button 
          onClick={() => setActiveTab('backup')}
          className={`flex items-center px-5 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'backup' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'}`}
        >
          <Database size={16} className="mr-2" /> Data Backup
        </button>
      </div>

      {/* --- TAB 1: SOCIAL MEDIA LINKS --- */}
      {activeTab === 'social' && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-black text-gray-900">Social Media Links</h2>
            <p className="text-sm text-gray-500 mt-1">These links will appear in your website footer.</p>
          </div>
          <form onSubmit={handleSaveSocials} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Facebook URL</label>
                <input type="url" value={socialLinks.facebook} onChange={e => setSocialLinks({...socialLinks, facebook: e.target.value})} placeholder="https://facebook.com/..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">X (formerly Twitter) URL</label>
                <input type="url" value={socialLinks.twitter} onChange={e => setSocialLinks({...socialLinks, twitter: e.target.value})} placeholder="https://x.com/..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Instagram URL</label>
                <input type="url" value={socialLinks.instagram} onChange={e => setSocialLinks({...socialLinks, instagram: e.target.value})} placeholder="https://instagram.com/..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">TikTok URL</label>
                <input type="url" value={socialLinks.tiktok} onChange={e => setSocialLinks({...socialLinks, tiktok: e.target.value})} placeholder="https://tiktok.com/@..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center">
                <Save size={18} className="mr-2" /> {saving ? 'Saving...' : 'Save Links'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- TAB 2: TEAM ACCESS (RBAC) --- */}
      {activeTab === 'team' && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-black text-gray-900">Role Management</h2>
              <p className="text-sm text-gray-500 mt-1">Upgrade normal customers to Editors or Admins.</p>
            </div>
            <Shield className="text-blue-600 opacity-20" size={40} />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">User Name / Email</th>
                  <th className="px-6 py-4">Current Role</th>
                  <th className="px-6 py-4 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teamMembers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{user.displayName || 'No Name Provided'}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        user.role === 'admin' ? 'bg-red-100 text-red-700' :
                        user.role === 'editor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.role || 'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        value={user.role || 'customer'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="customer">Customer</option>
                        <option value="editor">Editor (Limited Access)</option>
                        <option value="admin">Full Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 3: DATA EXPORT (BACKUPS) --- */}
      {activeTab === 'backup' && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-black text-gray-900">Manual Data Export</h2>
            <p className="text-sm text-gray-500 mt-1">Download local JSON copies of your essential database collections in case of a breach or data loss.</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors bg-white shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-black text-gray-900 mb-1">Products Catalog</h3>
                <p className="text-xs text-gray-500 mb-4 h-12">All active and draft products including pricing, descriptions, and stock quantities.</p>
              </div>
              <button onClick={() => handleExportData('products')} className="w-full bg-blue-50 text-blue-700 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center border border-blue-200">
                <Download size={16} className="mr-2" /> Download Backup
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors bg-white shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-black text-gray-900 mb-1">Order History</h3>
                <p className="text-xs text-gray-500 mb-4 h-12">Complete log of all customer transactions, revenue data, and delivery details.</p>
              </div>
              <button onClick={() => handleExportData('orders')} className="w-full bg-blue-50 text-blue-700 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center border border-blue-200">
                <Download size={16} className="mr-2" /> Download Backup
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors bg-white shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-black text-gray-900 mb-1">Customer List</h3>
                <p className="text-xs text-gray-500 mb-4 h-12">All registered user profiles, contact information, email addresses, and assigned roles.</p>
              </div>
              <button onClick={() => handleExportData('users')} className="w-full bg-blue-50 text-blue-700 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center border border-blue-200">
                <Download size={16} className="mr-2" /> Download Backup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
