// src/app/(shop)/contact/page.tsx
'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate sending email/saving to Firestore
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600">
          Whether you need a quote for a large construction project or just have a question about a product, our team in Kabale is ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-8">
          {/* Edge-to-edge on mobile using -mx-4 and rounded-none, snaps back to normal on sm screens */}
          <div className="bg-blue-900 text-white p-8 rounded-none sm:rounded-2xl shadow-lg -mx-4 sm:mx-0">
            <h3 className="text-xl font-black mb-6 border-b border-blue-800 pb-4">Store Details</h3>

            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="text-amber-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Our Location</h4>
                  <p className="text-blue-200 text-sm leading-relaxed">Main Street, Kabale Town<br/>Western Region, Uganda</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="text-amber-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Phone & WhatsApp</h4>
                  <p className="text-blue-200 text-sm">+256 700 000 000</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="text-amber-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <p className="text-blue-200 text-sm">support@macrohardware.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="text-amber-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Working Hours</h4>
                  <p className="text-blue-200 text-sm">Mon - Sat: 8:00 AM - 6:00 PM<br/>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Send us a Message</h3>

            {/* Removed the emoji from the success message */}
            {status === 'success' && (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200 font-bold flex items-center">
                Message sent successfully! We will get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="john@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <input required type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Product Inquiry / Quote Request" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="How can we help you today?" />
              </div>

              <button type="submit" disabled={status === 'sending'} className="bg-blue-600 text-white font-bold py-3.5 px-8 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm disabled:opacity-50 w-full sm:w-auto">
                {status === 'sending' ? 'Sending...' : <><Send size={18} className="mr-2" /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
