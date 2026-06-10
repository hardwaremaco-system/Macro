// src/app/(admin)/admin/gallery/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, Image as ImageIcon, X, UploadCloud } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
// Strict relative path
import { db } from '../../../../lib/firebase/client';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
  });

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url) return alert('Please upload an image first.');
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'gallery'), {
        title: formData.title,
        url: formData.url,
        createdAt: serverTimestamp(),
      });
      setIsModalOpen(false);
      setFormData({ title: '', url: '' });
      fetchGallery();
    } catch (error) {
      console.error('Error adding to gallery:', error);
      alert('Failed to add image.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo from the gallery?')) return;
    try {
      await deleteDoc(doc(db, 'gallery', id));
      setImages(images.filter(img => img.id !== id));
    } catch (error) {
      alert('Failed to delete image.');
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Project Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">Showcase completed projects and store photos.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center shadow-sm">
          <Plus size={18} className="mr-2" /> Upload Photo
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div> Loading gallery...
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <ImageIcon size={32} />
            </div>
            <p className="text-gray-500 font-medium">Your gallery is empty. Upload some photos!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div key={img.id} className="group relative rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-square bg-gray-50">
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                  <h3 className="text-white font-bold text-sm mb-3 line-clamp-2">{img.title || 'Untitled'}</h3>
                  <button onClick={() => handleDelete(img.id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors title='Delete'">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-black text-gray-900">Upload to Gallery</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddImage} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Photo</label>
                  {formData.url ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-blue-500 shadow-sm">
                      <img src={formData.url} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFormData({ ...formData, url: '' })} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                        <X size={16}/>
                      </button>
                    </div>
                  ) : (
                    <CldUploadWidget 
                      signatureEndpoint="/api/cloudinary/sign"
                      onSuccess={(result: any) => setFormData({ ...formData, url: result.info.secure_url })}
                    >
                      {({ open }) => (
                        <button type="button" onClick={() => open()} className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600">
                          <UploadCloud size={32} className="mb-2" />
                          <span className="text-sm font-bold">Select Photo</span>
                        </button>
                      )}
                    </CldUploadWidget>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Caption / Title (Optional)</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. New roofing installation" />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  {isSubmitting ? 'Uploading...' : 'Save to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
