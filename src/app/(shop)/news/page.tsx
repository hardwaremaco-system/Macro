// src/app/(shop)/news/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Calendar, FileText, ArrowRight } from 'lucide-react';
// Strict relative path
import { db } from '../../../lib/firebase/client';

export default function PublicNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const q = query(collection(db, 'news'), where('isActive', '==', true));
        const snapshot = await getDocs(q);
        const newsItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        newsItems.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        setNews(newsItems);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 flex items-center justify-center tracking-tight">
          <FileText className="mr-3 text-blue-600" size={36} /> News & Events
        </h1>
        <p className="text-gray-600 text-lg">
          Stay updated with the latest product arrivals, store announcements, and construction events happening at Macro Hardware.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No news published yet</h3>
          <p className="text-gray-500 mb-6">Check back later for updates from our team.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors inline-block shadow-sm">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full">
          {news.map((item) => (
            // Upgraded: Wrapped the ENTIRE card in a Link for massive tap targets!
            <Link href={`/news/${item.slug || item.id}`} key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group h-full">
              
              <div className="w-full h-56 overflow-hidden relative bg-gray-100 flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider shadow-md ${item.type === 'Event' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>
                    {item.type}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                {item.type === 'Event' && item.eventDate && (
                  <div className="flex items-center text-xs font-bold text-gray-500 mb-3 bg-gray-50 w-fit px-2 py-1 rounded">
                    <Calendar size={14} className="mr-1.5 text-purple-600" />
                    {new Date(item.eventDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                )}

                <h3 className="text-xl font-black text-gray-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                  {item.excerpt || item.content?.substring(0, 100) + '...'}
                </p>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </span>
                  
                  <span className="text-sm font-bold text-blue-600 flex items-center group-hover:translate-x-1 transition-transform">
                    Read <ArrowRight size={16} className="ml-1" />
                  </span>
                </div>
              </div>

            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
