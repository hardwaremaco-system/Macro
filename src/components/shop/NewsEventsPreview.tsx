// src/components/shop/NewsEventsPreview.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Calendar, ArrowRight } from 'lucide-react';
// Strict relative path
import { db } from '../../lib/firebase/client';

export default function NewsEventsPreview() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestNews() {
      try {
        const q = query(
          collection(db, 'news'),
          where('isActive', '==', true)
        );
        const snapshot = await getDocs(q);
        const newsItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort locally by creation date to avoid composite index requirements
        newsItems.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        
        // Take only the 3 most recent articles
        setNews(newsItems.slice(0, 3));
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestNews();
  }, []);

  if (loading) return null;
  if (news.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">Latest Updates & Events</h2>
        <Link href="/news" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center transition-colors">
          View All <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item) => (
          <Link key={item.id} href={`/news/${item.slug || item.id}`} className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            
            {/* Thumbnail Image */}
            <div className="w-full h-48 bg-gray-100 overflow-hidden relative">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider shadow-sm ${item.type === 'Event' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>
                  {item.type}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
              {item.type === 'Event' && item.eventDate && (
                <div className="flex items-center text-xs font-bold text-gray-500 mb-2">
                  <Calendar size={14} className="mr-1.5 text-purple-600" />
                  {new Date(item.eventDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              )}
              
              <h3 className="text-base font-black text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-sm text-gray-600 line-clamp-2 flex-grow mb-4">
                {item.excerpt}
              </p>

              <div className="mt-auto pt-4 border-t border-gray-50 text-xs font-bold text-gray-400">
                Posted {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Recently'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
