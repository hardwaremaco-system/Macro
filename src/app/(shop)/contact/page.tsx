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
        throw new Error(data.error || 'Failed to connect to server (Check if file is in /api/email/contact/route.ts)');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setStatus(''), 5000);

    } catch (error: any) {
      console.error('Error sending message:', error);
      setStatus('error');
      setErrorMessage(error.message); 
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
      
      {/* Page Header - Left on Mobile, Centered on Desktop */}
      <div className="max-w-4xl mx-auto mb-12 md:mb-16 lg:mb-20 text-left md:text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 md:mb-8 leading-tight tracking-tight">
          <span className="block">Welcome to the</span>
          <span className="block text-blue-600">Contact Us Page</span>
        </h1>
        
        {/* Bullets: 1-col left on Mobile, 2-col centered container on Desktop */}
        <div className="flex justify-start md:justify-center">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 md:gap-y-4 text-left text-gray-600 text-lg md:text-xl list-disc pl-5">
            <li>Open a Build & Invest account</li>
            <li>Request a quote for a large construction project</li>
            <li>Inquire about specific products or materials</li>
            <li>Get support for existing orders and deliveries</li>
          </ul>
        </div>
      </div>

      {/* Store Details - 1-col on Mobile, 4-col horizontally aligned on Desktop */}
      <div className="bg-gray-50 p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl border border-gray-200 shadow-sm mb-12 lg:mb-16">
        <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-8 border-b border-gray-200 pb-4 text-blue-600 tracking-tight text-left md:text-center">
          Store Details
        </h3>

        {/* Text remains left-aligned inside the grid for a clean, organized look */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-left">
          <div>
            <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-base md:text-lg">Our Location</h4>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">Main Street, Kabale Town<br/>Western Region, Uganda</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-base md:text-lg">Phone & WhatsApp</h4>
            <p className="text-gray-600 text-sm md:text-base">+256 700 000 000</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-base md:text-lg">Email</h4>
            <p className="text-gray-600 text-sm md:text-base">support@macrohardware.com</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-base md:text-lg">Working Hours</h4>
            <p className="text-gray-600 text-sm md:text-base">Mon - Sat: 8:00 AM - 6:00 PM<br/>Sunday: Closed</p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 md:p-10 lg:p-12">
          <h3 className="text-2xl md:text-3xl font-black text-blue-600 mb-6 md:mb-8 tracking-tight text-left md:text-center">
            Send us a Message
          </h3>

          {/* Success Message */}
          {status === 'success' && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-8 border border-green-200 font-bold flex items-center md:text-lg text-left">
              Message sent successfully! We will get back to you soon.
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 border border-red-200 flex flex-col items-start text-sm text-left">
              <div className="font-bold flex items-center mb-1 text-base md:text-lg">
                Failed to send message
              </div>
              <span className="font-mono text-xs md:text-sm opacity-80 break-all">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <label className="block text-sm md:text-base font-bold text-gray-700 mb-2">Your Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3.5 md:p-4 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm md:text-base font-bold text-gray-700 mb-2">Email Address</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3.5 md:p-4 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" placeholder="john@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm md:text-base font-bold text-gray-700 mb-2">What are you inquiring about?</label>
              <select 
                required 
                value={formData.subject} 
                onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                className="w-full border border-gray-300 rounded-xl p-3.5 md:p-4 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all outline-none appearance-none cursor-pointer"
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
              <label className="block text-sm md:text-base font-bold text-gray-700 mb-2">Message</label>
              <textarea required rows={6} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3.5 md:p-4 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-y" placeholder="How can we help you today?" />
            </div>

            <div className="flex justify-start md:justify-center">
              <button type="submit" disabled={status === 'sending'} className="bg-blue-600 text-white font-black py-4 px-10 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center shadow-lg shadow-blue-600/20 disabled:opacity-50 w-full md:w-auto text-base md:text-lg tracking-wide">
                {status === 'sending' ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Sending...
                  </span>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
