// src/app/(admin)/admin/search-analytics/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import { ArrowLeft, TrendingUp, Clock, Trash2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
// Adjust relative path based on your exact folder structure
import { db } from '../../../../lib/firebase/client';

interface SearchLog {
  id: string;
  query: string;
  createdAt: Date | null;
}

interface TopSearch {
  query: string;
  count: number;
}

export default function SearchAnalyticsPage() {
  const router = useRouter();
  const [recentSearches, setRecentSearches] = useState<SearchLog[]>([]);
  const [topSearches, setTopSearches] = useState<TopSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch the latest 500 searches to analyze
      const q = query(collection(db, 'search_queries'), orderBy('createdAt', 'desc'), limit(500));
      const snapshot = await getDocs(q);
      
      const logs: SearchLog[] = [];
      const frequencyMap: Record<string, number> = {};

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const term = data.query || 'unknown';
        
        // 1. Build the chronological log
        logs.push({
          id: docSnap.id,
          query: term,
          createdAt: data.createdAt?.toDate() || new Date(),
        });

        // 2. Aggregate the frequency for the "Top Searches" leaderboard
        if (term !== 'unknown') {
          frequencyMap[term] = (frequencyMap[term] || 0) + 1;
        }
      });

      setRecentSearches(logs);

      // Convert frequency map to sorted array
      const sortedTop = Object.entries(frequencyMap)
        .map(([term, count]) => ({ query: term, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15); // Show top 15

      setTopSearches(sortedTop);
    } catch (error) {
      console.error('Error fetching search analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (!confirm('Delete this search log?')) return;
    try {
      await deleteDoc(doc(db, 'search_queries', id));
      setRecentSearches((prev) => prev.filter((log) => log.id !== id));
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={() => router.back()} className="mr-4 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Search Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Discover exactly what your customers are looking for.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* LEFT COLUMN: Top Searches (Leaderboard) */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-5 border-b border-gray-100 flex items-center bg-gray-50/50">
            <div className="bg-amber-100 text-amber-600 p-2 rounded-lg mr-3">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Top Searched Terms</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5">
            {topSearches.length === 0 ? (
              <p className="text-center text-gray-400 mt-10 text-sm">No search data available yet.</p>
            ) : (
              <div className="space-y-3">
                {topSearches.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50 transition-colors group">
                    <div className="flex items-center">
                      <span className={`w-6 text-center text-sm font-bold mr-3 ${index < 3 ? 'text-amber-500' : 'text-gray-400'}`}>
                        #{index + 1}
                      </span>
                      <span className="font-bold text-slate-800 capitalize">{item.query}</span>
                    </div>
                    <div className="bg-white border border-gray-200 text-slate-900 text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                      {item.count} {item.count === 1 ? 'search' : 'searches'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Search Activity (Live Feed) */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-5 border-b border-gray-100 flex items-center bg-gray-50/50">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
              <Clock size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Activity Feed</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-0">
            {recentSearches.length === 0 ? (
              <p className="text-center text-gray-400 mt-10 text-sm">No recent searches.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {recentSearches.map((log) => (
                  <li key={log.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                    <div className="flex items-start">
                      <Search size={16} className="text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <span className="block font-bold text-sm text-slate-900 capitalize">
                          "{log.query}"
                        </span>
                        <span className="block text-[11px] text-gray-500 mt-0.5 font-medium">
                          {log.createdAt ? new Intl.DateTimeFormat('en-UG', { 
                            dateStyle: 'medium', 
                            timeStyle: 'short' 
                          }).format(log.createdAt) : 'Unknown date'}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"
                      title="Delete log"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
