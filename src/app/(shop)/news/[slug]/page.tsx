// src/app/(shop)/news/[slug]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { ArrowLeft, Calendar, FileText, Clock } from 'lucide-react';
// Strict relative paths (4 levels up to src, then down to lib)
import { db } from '../../../../lib/firebase/client';

export default function NewsDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        // Find article where slug matches
        const q = query(collection(db, 'news'), where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          setArticle({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        } else {
          // Fallback check: see if the slug provided is actually a document ID
          const fallbackSnap = await getDocs(query(collection(db, 'news'), limit(50)));
          const found = fallbackSnap.docs.find(doc => doc.id === slug);
          if (found) {
            setArticle({ id: found.id, ...found.data() });
          } else {
            setArticle(null);
          }
        }
      } catch (error) {
        console.error('Error fetching news details:', error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-2xl font-black text-gray-900 mb-2">Article Not Found</h1>
        <p className="text-gray-500 mb-6">The update or event you are looking for does not exist.</p>
        <Link href="/news" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back Button */}
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to News
        </button>
      </div>

      <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Cover Image */}
        <div className="w-full h-64 sm:h-96 bg-gray-100 relative">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider shadow-md ${article.type === 'Event' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>
              {article.type}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              Published {article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString() : 'Recently'}
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>

          {/* Event Card (If it is an upcoming store event) */}
          {article.type === 'Event' && article.eventDate && (
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 mb-8 flex items-start">
              <Calendar size={24} className="text-purple-600 mr-4 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-black text-purple-900 text-sm uppercase tracking-wide">Scheduled Event Date</h4>
                <p className="text-purple-700 text-base font-bold mt-1">
                  {new Date(article.eventDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-purple-600 text-xs mt-1">Join us live at our physical branch in Kabale Town!</p>
              </div>
            </div>
          )}

          {/* Main Content Render */}
          <div className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-medium space-y-4">
            {article.content}
          </div>

        </div>
      </article>
    </div>
  );
}
