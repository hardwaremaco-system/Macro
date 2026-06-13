// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // Applies to all search engine bots (Google, Bing, etc.)
      userAgent: '*',
      
      // Allow them to crawl the main site
      allow: '/',
      
      // Strictly block these private or dynamic routes
      disallow: [
        '/admin/',       // Keeps your dashboard hidden
        '/cart/',        // Carts are unique to users, no need to index
        '/checkout/',    // Protects the checkout flow
        '/profile/',     // Protects user account pages
        '/orders/',      // Protects order history
        '/api/',         // Prevents bots from pinging your backend API routes directly
      ],
    },
    
    // Points search engines directly to the sitemap we just built!
    sitemap: 'https://macrohardwarekabale.com/sitemap.xml',
  };
}
