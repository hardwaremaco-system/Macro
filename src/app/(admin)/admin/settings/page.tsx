// src/app/(admin)/admin/settings/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Settings as SettingsIcon, Phone, Mail, MapPin } from 'lucide-react';
// Strict relative path
import { db } from '../../../../lib/firebase/client';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    storeName: 'Macro Hardware',
    whatsappNumber: '+256700000000',
    supportEmail: 'support@macrohardware.com',
    storeAddress: 'Kabale Town, Western Region, Uganda',
    facebookUrl: '',
    deliveryFee: '10000',
  });

  // Fetch existing settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, 'settings', 'store_config');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFormData({ ...formData, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const docRef = doc(db, 'settings', 'store_config');
      // setDoc with merge: true will create it if it doesn't exist, or update if it does
      await setDoc(docRef, formData, { merge: true });
      alert('Store settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 flex items-center">
          <SettingsIcon size={28} className="mr-3 text-blue-600" /> Store Configuration
        </h1>
        <p className="text-sm text-gray-500 mt-1">Manage global website settings, contact details, and social links.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* General Info */}
        <div className="p-6 sm:p-8 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900 mb-6">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Store Name</label>
              <input name="storeName" value={formData.storeName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center">
                <Phone size={14} className="mr-1 text-gray-400" /> WhatsApp / Phone
              </label>
              <input name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center">
                <Mail size={14} className="mr-1 text-gray-400" /> Support Email
              </label>
              <input name="supportEmail" type="email" value={formData.supportEmail} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center">
                <MapPin size={14} className="mr-1 text-gray-400" /> Physical Address
              </label>
              <input name="storeAddress" value={formData.storeAddress} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>

        {/* E-Commerce Config */}
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-black text-gray-900 mb-6">E-Commerce Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Standard Delivery Fee (UGX)</label>
              <input name="deliveryFee" type="number" value={formData.deliveryFee} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" />
              <p className="text-xs text-gray-500 mt-1">This will be added to orders at checkout.</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Facebook Page URL</label>
              <input name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/..." className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-white flex justify-end">
          <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center shadow-sm disabled:opacity-50">
            {isSaving ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Settings</>}
          </button>
        </div>

      </form>
    </div>
  );
}
