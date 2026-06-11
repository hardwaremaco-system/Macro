// src/components/shop/StoreLocationMap.tsx
import React from 'react';
import { MapPin } from 'lucide-react';

export default function StoreLocationMap() {
  return (
    <section className="bg-white py-16 lg:py-24 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6">
              <MapPin size={14} className="mr-1.5" /> Visit Our Store
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-6">
              Locate us in the heart of Kabale.
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Prefer to view your materials in person before making a bulk order? Visit our physical hardware branch. Our experts are on standby to help you calculate your material estimates.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-gray-100 p-3 rounded-lg mr-4">
                  <MapPin className="text-amber-500" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Physical Address</h4>
                  <p className="text-gray-600">Main Street, Kabale Town, Uganda</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative group">
            {/* This uses a secure Google Maps "pb" Embed URL which prevents the "refused to connect" error. 
              To get your exact shop pin: Go to Google Maps -> Search your shop -> Click "Share" -> Click "Embed a map" -> Copy the src URL and paste it here!
            */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31911.396347048123!2d29.970220641142504!3d-1.2483861502476572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca71db75765f5%3A0x8e8bb33f912c0194!2sKabale%2C%20Uganda!5e0!3m2!1sen!2sus!4v1718080000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
}
