// src/lib/algolia.ts
import algoliasearch from 'algoliasearch';

// Client-side search client (Safe for public components)
export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''
);

// Admin-side indexing client (Strictly for server-side processing)
export const getAlgoliaAdminIndex = () => {
  if (!process.env.ALGOLIA_ADMIN_KEY) {
    throw new Error('ALGOLIA_ADMIN_KEY is missing from environment variables.');
  }
  
  const adminClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
    process.env.ALGOLIA_ADMIN_KEY
  );
  
  // Primary index for products
  return adminClient.initIndex('macro_products');
};
