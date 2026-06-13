'use client';

import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Image as ImageIcon, X } from 'lucide-react';
import { db } from '../../../lib/firebase/client';

export default function PublicGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Lock body scroll and auto-scroll to the clicked image when modal opens
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';

      if (scrollContainerRef.current) {
        const width = scrollContainerRef.current.clientWidth;
        scrollContainerRef.current.scrollTo({ left: width * activeIndex, behavior: 'instant' as ScrollBehavior });
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen && e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Update active index based on swipe position
  const handleModalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);

    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < images.length) {
      setActiveIndex(newIndex);
    }
  };

  const openModal = (index: number) => {
    setActiveIndex(index);
    setIsModalOpen(true);
  };

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
              onClick={() => openModal(index)}
            >
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

      {/* Full Screen Photo Gallery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
          
          {/* Top Bar */}
          <div className="flex justify-between items-center p-4 sm:p-6 text-white absolute top-0 w-full z-10 bg-gradient-to-b from-black/50 to-transparent">
            <span className="font-bold text-sm tracking-widest">
              {activeIndex + 1} / {images.length}
            </span>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
            >
              <X size={24} />
            </button>
          </div>

          {/* Swipeable Image Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleModalScroll}
            className="flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          >
            {images.map((img, idx) => (
              <div key={idx} className="min-w-full h-full flex items-center justify-center snap-center p-4 sm:p-12 relative">
                <img 
                  src={img.url} 
                  alt={img.title || `Gallery Image ${idx + 1}`} 
                  className="max-w-full max-h-full object-contain select-none" 
                />
                {img.title && (
                  <div className="absolute bottom-8 left-0 right-0 text-center px-4 pointer-events-none">
                    <h3 className="text-white text-xl sm:text-2xl font-medium tracking-wide drop-shadow-md">
                      {img.title}
                    </h3>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
