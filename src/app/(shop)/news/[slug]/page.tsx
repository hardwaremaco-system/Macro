// src/app/(shop)/news/[slug]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { ArrowLeft, Calendar, Clock, ZoomIn, X } from 'lucide-react';
// Strict relative paths
import { db } from '../../../../lib/firebase/client';

export default function NewsDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Lightbox State
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      try {
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
        <Link href="/news" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Full-Screen Image Lightbox Overlay */}
      {isImageFullscreen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out backdrop-blur-sm transition-opacity"
          onClick={() => setIsImageFullscreen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black rounded-full p-2 transition-all"
            onClick={(e) => { e.stopPropagation(); setIsImageFullscreen(false); }}
          >
            <X size={28} />
          </button>
          <img 
            src={article.image} 
            alt={article.title} 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

      {/* Back Button */}
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to News
        </button>
      </div>

      <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Cover Image with Zoom Indicator */}
        <div 
          className="w-full h-64 sm:h-96 bg-gray-100 relative group cursor-zoom-in overflow-hidden"
          onClick={() => setIsImageFullscreen(true)}
        >
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          {/* Zoom Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-900 px-4 py-2 rounded-full font-bold text-sm flex items-center shadow-lg transition-all transform scale-95 group-hover:scale-100">
              <ZoomIn size={18} className="mr-2" /> View Full Image
            </div>
          </div>
          
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider shadow-md ${article.type === 'Event' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>
              {article.type}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 lg:px-16 lg:py-12">

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 mb-5 uppercase tracking-wider">
            <div className="flex items-center">
              <Clock size={14} className="mr-1.5" />
              Published {article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString() : 'Recently'}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-8">
            {article.title}
          </h1>

          {/* Event Card */}
          {article.type === 'Event' && article.eventDate && (
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 mb-10 flex items-start">
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

          {/* Main Content Render (Upgraded Typography) */}
          <div className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-medium space-y-6 pb-6">
            {article.content}
          </div>

        </div>
      </article>
    </div>
  );
}
