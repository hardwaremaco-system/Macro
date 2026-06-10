// src/components/shop/NewsEventsPreview.tsx
import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'How to Choose the Right Cement for Your Foundation',
    date: 'Oct 12, 2024',
    excerpt: 'Not all cement is created equal. Learn the difference between CEM II and CEM IV and when to use them.',
    category: 'Guide',
  },
  {
    id: 2,
    title: 'Macro Hardware Opens New Branch in Kabale',
    date: 'Nov 05, 2024',
    excerpt: 'We are expanding! Visit our new state-of-facility in Kabale for exclusive opening week discounts.',
    category: 'Company News',
  },
  {
    id: 3,
    title: 'Top 5 Safety Tools Every Construction Site Needs',
    date: 'Nov 18, 2024',
    excerpt: 'Protect your workers and avoid delays with these essential, high-quality safety gear recommendations.',
    category: 'Safety',
  },
];

export default function NewsEventsPreview() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">Latest News & Guides</h2>
        <Link href="/news" className="text-sm font-bold text-blue-600 hover:underline flex items-center">
          View All <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            {/* Image Placeholder */}
            <div className="h-40 bg-gray-100 relative">
              <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                {article.category}
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <Calendar size={14} className="mr-1" />
                {article.date}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
                {article.excerpt}
              </p>
              <Link href={`/news/${article.id}`} className="text-sm font-bold text-blue-600 hover:text-blue-800 self-start">
                Read Article
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
