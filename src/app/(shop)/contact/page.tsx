// src/app/(shop)/contact/page.tsx
'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage(''); // Reset error message

    try {
      const response = await fetch('/api/email/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // This will grab the exact reason it failed from the server
        throw new Error(data.error || 'Failed to connect to server (Check if file is in /api/email/contact/route.ts)');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Clear the success message after 5 seconds
      setTimeout(() => setStatus(''), 5000);

    } catch (error: any) {
      console.error('Error sending message:', error);
      setStatus('error');
      setErrorMessage(error.message); // Save the error message
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Page Header - Left Aligned with Bullet Points */}
      <div className="max-w-3xl mb-12 md:mb-16 text-left">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
          <span className="block">Welcome to the</span>
          <span className="block">Contact Page</span>
        </h1>
        <ul className="list-disc pl-5 text-gray-600 space-y-2 text-lg">
          <li>Open a Build & Invest account</li>
          <li>Request a quote for a large construction project</li>
          <li>Inquire about specific products or materials</li>
          <li>Get support for existing orders and deliveries</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-gray-100 p-5 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-black mb-6 border-b border-gray-300 pb-4 text-blue-600">Store Details</h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Our Location</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Main Street, Kabale Town<br/>Western Region, Uganda</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">Phone & WhatsApp</h4>
                <p className="text-gray-600 text-sm">+256 700 000 000</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                <p className="text-gray-600 text-sm">support@macrohardware.com</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">Working Hours</h4>
                <p className="text-gray-600 text-sm">Mon - Sat: 8:00 AM - 6:00 PM<br/>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-black text-blue-600 mb-6">Send us a Message</h3>

            {/* Success Message */}
            {status === 'success' && (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200 font-bold flex items-center">
                Message sent successfully! We will get back to you soon.
              </div>
            )}

            {/* Error Message */}
            {status === 'error' && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200 flex flex-col items-start text-sm">
                <div className="font-bold flex items-center mb-1">
                  Failed to send message
                </div>
                <span className="font-mono text-xs opacity-80 break-all">{errorMessage}</span>
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
                <label className="block text-sm font-bold text-gray-700 mb-2">What are you inquiring about?</label>
                <select 
                  required 
                  value={formData.subject} 
                  onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="" disabled>Select a subject...</option>
                  <option value="Build & Invest Account">Open a Build & Invest Account</option>
                  <option value="Bulk Order / Quotation">Bulk Material Order / Quotation</option>
                  <option value="Delivery Inquiry">Delivery Inquiry</option>
                  <option value="General Support">General Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="How can we help you today?" />
              </div>

              <button type="submit" disabled={status === 'sending'} className="bg-blue-600 text-white font-bold py-3.5 px-8 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm disabled:opacity-50 w-full sm:w-auto">
                {status === 'sending' ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </span>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
