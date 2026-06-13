// src/app/(admin)/admin/broadcast/page.tsx
'use client';
import React, { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Send, UploadCloud, X, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
// Strict relative path
import { db } from '../../../../lib/firebase/client';

export default function BroadcastPage() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    image: '',
    buttonText: '',
    buttonLink: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Fetch all registered users from Firebase to get their emails
      const usersSnap = await getDocs(collection(db, 'users'));
      const emails: string[] = [];
      
      usersSnap.forEach((doc) => {
        const email = doc.data().email;
        // Basic validation to ensure it's an email address
        if (email && email.includes('@')) {
          emails.push(email);
        }
      });

      if (emails.length === 0) {
        throw new Error("No valid customer emails found in the database.");
      }

      // 2. Generate the HTML Email Template with Macro Hardware styling
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1e3a8a; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;">
              MACRO <span style="color: #f59e0b;">HARDWARE</span>
            </h1>
          </div>
          
          ${formData.image ? `<img src="${formData.image}" alt="Broadcast Image" style="width: 100%; height: auto; max-height: 300px; object-fit: cover;" />` : ''}
          
          <div style="padding: 30px 20px; color: #374151; font-size: 16px; line-height: 1.6;">
            ${formData.message.replace(/\n/g, '<br/>')}
            
            ${(formData.buttonText && formData.buttonLink) ? `
              <div style="text-align: center; margin-top: 30px;">
                <a href="${formData.buttonLink}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  ${formData.buttonText}
                </a>
              </div>
            ` : ''}
          </div>
          
          <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
            You are receiving this email because you registered an account with Macro Hardware.<br/>
            Kabale, Uganda
          </div>
        </div>
      `;

      // 3. Chunk emails into groups of 50 to respect Brevo's BCC limits
      const chunkSize = 50;
      for (let i = 0; i < emails.length; i += chunkSize) {
        const bccChunk = emails.slice(i, i + chunkSize);

        // 4. Send the chunk to our custom Next.js API Route!
        const res = await fetch('/api/email/broadcast', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject: formData.subject,
            htmlContent: htmlContent,
            bccList: bccChunk,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to send a batch to Brevo.');
        }
      }

      setSuccessMsg(`Successfully broadcasted to ${emails.length} customers via Brevo!`);
      setFormData({ subject: '', message: '', image: '', buttonText: '', buttonLink: '' });

    } catch (error: any) {
      console.error("Broadcast Error:", error);
      setErrorMsg(error.message || "Failed to send broadcast. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Email Broadcaster</h1>
          <p className="text-sm text-gray-500 mt-1">Send updates, offers, and news directly via Brevo.</p>
        </div>
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          <Mail size={24} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSendBroadcast} className="p-6 md:p-8 space-y-6">
          
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-bold flex items-center border border-red-100">
              <AlertCircle size={18} className="mr-2" /> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm font-bold flex items-center border border-green-100">
              <CheckCircle size={18} className="mr-2" /> {successMsg}
            </div>
          )}

          {/* Subject Line */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Subject Line *</label>
            <input required type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. Huge Discounts on Roofing Iron Sheets!" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>

          {/* Banner Image */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Banner Image (Optional)</label>
            {formData.image && (
              <div className="relative w-full max-w-md h-48 rounded-xl overflow-hidden border-2 border-blue-500 shadow-sm group mb-4">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => setFormData({ ...formData, image: '' })} 
                  className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16}/>
                </button>
              </div>
            )}
            <div className={formData.image ? 'hidden' : 'block'}>
              <CldUploadWidget 
                signatureEndpoint="/api/cloudinary/sign"
                onSuccess={(result: any) => {
                  setFormData({ ...formData, image: result.info.secure_url });
                  document.body.style.overflow = 'unset';
                }}
                onClose={() => {
                  document.body.style.overflow = 'unset';
                }}
              >
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="w-full max-w-md h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors bg-gray-50">
                    <UploadCloud size={24} className="mb-2" />
                    <span className="text-sm font-bold">Upload Email Banner</span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          {/* Message Body */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Main Message *</label>
            <textarea required name="message" value={formData.message} onChange={handleChange} rows={6} placeholder="Write your email content here. Line breaks will be preserved..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>

          {/* Action Button Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50 border border-gray-100 rounded-xl">
            <div className="md:col-span-2">
              <h3 className="font-bold text-gray-900 mb-1">Call to Action Button (Optional)</h3>
              <p className="text-xs text-gray-500">Add a button at the bottom of the email to direct customers to a specific page.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Button Text</label>
              <input type="text" name="buttonText" value={formData.buttonText} onChange={handleChange} placeholder="e.g. Shop Now" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Button Link (URL)</label>
              <input type="url" name="buttonLink" value={formData.buttonLink} onChange={handleChange} placeholder="https://macrohardwarekabale.com/..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white" />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-black hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 flex items-center">
              {loading ? (
                <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> Sending via Brevo...</>
              ) : (
                <><Send size={18} className="mr-2" /> Broadcast to All Customers</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
