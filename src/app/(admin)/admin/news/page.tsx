// src/app/(admin)/admin/news/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, FileText, X, UploadCloud, CheckCircle, XCircle, Calendar, AlertCircle, Edit2 } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
// Strict relative path
import { db } from '../../../../lib/firebase/client';

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Track if we are editing an existing post
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialForm = {
    title: '',
    excerpt: '',
    content: '',
    type: 'News', 
    eventDate: '', 
    image: '',
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Unified Submit Handler (Create OR Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.image) return setErrorMsg('Please upload a cover image.');
    setIsSubmitting(true);

    try {
      if (editingId) {
        // UPDATE EXISTING ARTICLE
        await updateDoc(doc(db, 'news', editingId), {
          ...formData,
        });
      } else {
        // CREATE NEW ARTICLE
        const baseSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

        await addDoc(collection(db, 'news'), {
          ...formData,
          slug: uniqueSlug,
          createdAt: serverTimestamp(),
        });
      }
      
      // Reset and close
      setIsModalOpen(false);
      setFormData(initialForm);
      setEditingId(null);
      fetchNews();
    } catch (error) {
      console.error('Error saving article:', error);
      setErrorMsg('Failed to save article. Check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open modal in "Edit Mode"
  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      type: item.type,
      eventDate: item.eventDate || '',
      image: item.image,
      isActive: item.isActive,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'news', id), { isActive: !currentStatus });
      setNews(news.map(n => n.id === id ? { ...n, isActive: !currentStatus } : n));
    } catch (error) {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article completely?')) return;
    try {
      await deleteDoc(doc(db, 'news', id));
      setNews(news.filter(n => n.id !== id));
    } catch (error) {
      alert('Failed to delete article.');
    }
  };

  // Open modal in "Create Mode"
  const handleAddNew = () => {
    setEditingId(null);
    setFormData(initialForm);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">News & Events</h1>
          <p className="text-sm text-gray-500 mt-1">Publish store updates, tips, and upcoming events.</p>
        </div>
        <button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center shadow-sm transition-colors">
          <Plus size={18} className="mr-2" /> Publish Article
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col">
        <div className="overflow-x-auto w-full rounded-xl">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Article / Event</th>
                <th className="px-6 py-4">Type & Date</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading records...</td></tr>
              ) : news.length === 0 ? (
                 <tr>
                   <td colSpan={4} className="px-6 py-12 text-center">
                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                       <FileText size={24} />
                     </div>
                     <p className="text-gray-500 font-medium">No news or events published yet.</p>
                   </td>
                 </tr>
              ) : news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mr-4 flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-1 mt-1">{item.excerpt}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider mb-1 ${item.type === 'Event' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {item.type}
                    </span>
                    {item.type === 'Event' && item.eventDate && (
                      <div className="flex items-center text-xs text-gray-600 mt-1 font-medium">
                        <Calendar size={12} className="mr-1" /> {new Date(item.eventDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleStatus(item.id, item.isActive)}
                      className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${item.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {item.isActive ? <><CheckCircle size={14} className="mr-1"/> Published</> : <><XCircle size={14} className="mr-1"/> Draft</>}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit Article">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete Article">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-black text-gray-900">{editingId ? 'Edit Article' : 'Publish News or Event'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors bg-white p-1 rounded-full border border-gray-200"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">

              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-bold flex items-center border border-red-100">
                  <AlertCircle size={16} className="mr-2" /> {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Image Upload Area */}
                <div className="md:col-span-2 mb-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image *</label>
                  {formData.image ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-blue-500 shadow-sm group">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={16}/>
                      </button>
                    </div>
                  ) : (
                    <CldUploadWidget 
                      signatureEndpoint="/api/cloudinary/sign"
                      onSuccess={(result: any) => setFormData({ ...formData, image: result.info.secure_url })}
                    >
                      {({ open }) => (
                        <button type="button" onClick={() => open()} className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors bg-gray-50">
                          <UploadCloud size={32} className="mb-3" />
                          <span className="text-sm font-bold">Click to Upload Image</span>
                          <span className="text-xs font-medium text-gray-400 mt-1">Recommended size: 1200x600px</span>
                        </button>
                      )}
                    </CldUploadWidget>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Article Title *</label>
                  <input name="title" required value={formData.title} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. New Shipment of Roofing Irons Arrived!" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Post Type</label>
                  <select name="type" required value={formData.type} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <option value="News">News / Update</option>
                    <option value="Event">Store Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Event Date</label>
                  <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400" disabled={formData.type !== 'Event'} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Excerpt * <span className="font-normal text-gray-400 text-xs ml-1">(Short summary for the homepage)</span></label>
                  <textarea name="excerpt" rows={2} required value={formData.excerpt} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="A brief summary of the announcement..." />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Content * <span className="font-normal text-gray-400 text-xs ml-1">(Line breaks will be preserved on the site)</span></label>
                  <textarea name="content" rows={6} required value={formData.content} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Write the full article details here..." />
                </div>

                <div className="md:col-span-2 flex items-center p-4 border border-blue-100 rounded-xl bg-blue-50 mt-2">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                  <label className="ml-3 block text-sm font-black text-blue-900">
                    Publish immediately to the live site
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 text-sm font-black text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 flex items-center">
                  {isSubmitting ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Saving...</>
                  ) : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
