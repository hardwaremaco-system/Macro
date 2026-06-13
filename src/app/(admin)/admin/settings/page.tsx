// src/app/(admin)/admin/settings/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { 
  Save, Link as LinkIcon, Users, Shield, CheckCircle, Database, Download, 
  Lock, Unlock, X, Facebook, Twitter, Instagram 
} from 'lucide-react';
// Strict relative path
import { db } from '../../../../lib/firebase/client';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('social');
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Tab 1: Social & Store Links - Current Draft State
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    whatsapp: '',
    facebook: '',
    twitter: '', 
    instagram: '',
    tiktok: '',
  });

  // Tab 1: Original Saved State (to revert if user clicks Cancel)
  const [originalSocials, setOriginalSocials] = useState<Record<string, string>>({
    whatsapp: '',
    facebook: '',
    twitter: '', 
    instagram: '',
    tiktok: '',
  });

  // Tab 1: Edit/Lock State
  const [editing, setEditing] = useState<Record<string, boolean>>({
    whatsapp: false,
    facebook: false,
    twitter: false, 
    instagram: false,
    tiktok: false,
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
        const fetchedSocials = settingsSnap.data().socials;
        setSocialLinks(prev => ({ ...prev, ...fetchedSocials }));
        setOriginalSocials(prev => ({ ...prev, ...fetchedSocials }));
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

  // --- SAVE SINGLE SOCIAL FIELD ---
  const handleSaveSingleField = async (field: string) => {
    setSavingField(field);
    setSuccessMsg('');
    try {
      // We use setDoc with merge: true to safely update just ONE nested field
      await setDoc(doc(db, 'settings', 'global'), {
        socials: {
          [field]: socialLinks[field]
        }
      }, { merge: true });

      setOriginalSocials(prev => ({ ...prev, [field]: socialLinks[field] }));
      setEditing(prev => ({ ...prev, [field]: false })); // Lock it again
      
      setSuccessMsg(`${field.charAt(0).toUpperCase() + field.slice(1)} updated securely!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error(`Error saving ${field}:`, error);
      alert('Failed to save setting.');
    } finally {
      setSavingField(null);
    }
  };

  const cancelEdit = (field: string) => {
    // Revert back to the originally saved value and lock
    setSocialLinks(prev => ({ ...prev, [field]: originalSocials[field] }));
    setEditing(prev => ({ ...prev, [field]: false }));
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
          <LinkIcon size={16} className="mr-2" /> Social Media & Contact
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
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-black text-gray-900">Contact & Social Links</h2>
            <p className="text-sm text-gray-500 mt-1">Unlock a field to safely modify its content.</p>
          </div>
          
          {/* Edge-to-Edge WhatsApp Section */}
          <div className="bg-green-50 border-b border-green-200 px-6 py-6 sm:px-8 w-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1 w-full max-w-xl">
                <label className="block text-sm font-black text-green-900 mb-1">WhatsApp Support Number</label>
                <p className="text-xs text-green-700 mb-3">Include country code (e.g., 256). Do not use the "+" symbol or spaces.</p>
                <div className="relative">
                  <input 
                    type="text" 
                    value={socialLinks.whatsapp} 
                    onChange={e => setSocialLinks({...socialLinks, whatsapp: e.target.value})} 
                    disabled={!editing.whatsapp}
                    placeholder="256778522222" 
                    className={`w-full border rounded-lg p-3 text-sm font-bold transition-all ${
                      editing.whatsapp 
                        ? 'border-green-500 bg-white shadow-inner focus:ring-2 focus:ring-green-500 outline-none text-gray-900' 
                        : 'border-green-200 bg-green-100/50 text-green-800 cursor-not-allowed'
                    }`} 
                  />
                  {!editing.whatsapp && (
                    <Lock size={16} className="absolute right-3 top-3.5 text-green-600 opacity-50" />
                  )}
                </div>
              </div>

              {/* WhatsApp Action Buttons */}
              <div className="flex items-center gap-2 mt-1 md:mt-11">
                {!editing.whatsapp ? (
                  <button onClick={() => setEditing({...editing, whatsapp: true})} className="bg-white border border-green-300 text-green-700 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-green-100 transition-colors flex items-center shadow-sm">
                    <Unlock size={16} className="mr-2" /> Unlock
                  </button>
                ) : (
                  <>
                    <button onClick={() => cancelEdit('whatsapp')} className="bg-white border border-gray-300 text-gray-600 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors flex items-center shadow-sm">
                      <X size={16} className="mr-1.5" /> Cancel
                    </button>
                    <button onClick={() => handleSaveSingleField('whatsapp')} disabled={savingField === 'whatsapp'} className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-green-700 transition-colors flex items-center shadow-md disabled:opacity-50">
                      {savingField === 'whatsapp' ? 'Saving...' : <><Save size={16} className="mr-2" /> Save</>}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Standard Social Links List */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Reusable Component for Social Rows */}
            {[
              { id: 'facebook', label: 'Facebook Page URL', icon: <Facebook size={18} className="text-blue-600 mr-2"/> },
              { id: 'twitter', label: 'X (Twitter) Profile URL', icon: <Twitter size={18} className="text-blue-400 mr-2"/> },
              { id: 'instagram', label: 'Instagram Profile URL', icon: <Instagram size={18} className="text-pink-600 mr-2"/> },
              { id: 'tiktok', label: 'TikTok Profile URL', icon: <div className="text-black mr-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg></div> }
            ].map((social) => (
              <div key={social.id} className={`flex flex-col md:flex-row md:items-end justify-between gap-4 p-4 rounded-xl border transition-colors ${editing[social.id] ? 'border-blue-300 bg-blue-50/30' : 'border-gray-100 bg-gray-50/50'}`}>
                
                <div className="flex-1 w-full max-w-xl">
                  <label className="flex items-center text-sm font-bold text-gray-800 mb-2">
                    {social.icon} {social.label}
                  </label>
                  <div className="relative">
                    <input 
                      type="url" 
                      value={socialLinks[social.id]} 
                      onChange={e => setSocialLinks({...socialLinks, [social.id]: e.target.value})} 
                      disabled={!editing[social.id]}
                      placeholder={`https://${social.id}.com/...`}
                      className={`w-full border rounded-lg p-2.5 text-sm transition-all ${
                        editing[social.id] 
                          ? 'border-blue-500 bg-white shadow-inner focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium' 
                          : 'border-transparent bg-gray-100 text-gray-500 cursor-not-allowed'
                      }`} 
                    />
                    {!editing[social.id] && (
                      <Lock size={14} className="absolute right-3 top-3 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Individual Action Buttons */}
                <div className="flex items-center gap-2">
                  {!editing[social.id] ? (
                    <button onClick={() => setEditing({...editing, [social.id]: true})} className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-colors flex items-center shadow-sm">
                      <Unlock size={16} className="mr-2" /> Edit
                    </button>
                  ) : (
                    <>
                      <button onClick={() => cancelEdit(social.id)} className="bg-white border border-gray-300 text-gray-600 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors flex items-center shadow-sm">
                        <X size={16} className="mr-1.5" /> Cancel
                      </button>
                      <button onClick={() => handleSaveSingleField(social.id)} disabled={savingField === social.id} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center shadow-md disabled:opacity-50">
                        {savingField === social.id ? 'Saving...' : <><Save size={16} className="mr-2" /> Save</>}
                      </button>
                    </>
                  )}
                </div>

              </div>
            ))}

          </div>
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
