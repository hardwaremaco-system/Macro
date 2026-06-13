'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '../../../lib/firebase/client';

export default function PublicGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev! + 1));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev! - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, images.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Project Gallery</h1>
        <p className="text-gray-600">
          Take a look at some of the construction projects we've supplied, our hardware facilities, and the premium materials we deliver across the region.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">Gallery Coming Soon</h3>
          <p className="text-gray-500">We are currently updating our photo collection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <div 
              key={img.id} 
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3] bg-gray-100 cursor-pointer"
              onClick={() => setSelectedIndex(index)}
            </div>
              <img 
                src={img.url} 
                alt={img.title || 'Gallery image'} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              {img.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="text-white font-bold text-lg">{img.title}</h3>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setSelectedIndex(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(null);
            }}
          >
            <X size={36} />
          </button>

          <button 
            className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev! - 1));
            }}
          >
            <ChevronLeft size={48} />
          </button>

          <button 
            className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev! + 1));
            }}
          >
            <ChevronRight size={48} />
          </button>

          <div 
            className="relative max-w-7xl w-full max-h-screen px-12 sm:px-24 py-12 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={images[selectedIndex].url} 
              alt={images[selectedIndex].title || 'Gallery full view'} 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
            />
            {images[selectedIndex].title && (
              <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                <h3 className="text-white text-xl sm:text-2xl font-medium tracking-wide drop-shadow-md">
                  {images[selectedIndex].title}
                </h3>
              </div>
            )}
            <div className="absolute top-6 left-6 text-white/50 text-sm font-medium tracking-widest">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
