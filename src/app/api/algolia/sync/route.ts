// src/app/api/algolia/sync/route.ts
import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import algoliasearch from 'algoliasearch';
// Strict relative path
import { db } from '../../../../lib/firebase/client';

export async function GET() {
  try {
    // 1. Verify credentials
    if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_KEY) {
      return NextResponse.json({ error: 'Algolia credentials missing from environment variables' }, { status: 500 });
    }

    // 2. Initialize Algolia Admin Client
    const client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.ALGOLIA_ADMIN_KEY
    );
    const index = client.initIndex('macro_products');

    // 3. Fetch all products from Firestore
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products: any[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Algolia requires an 'objectID' for every record
      products.push({
        objectID: doc.id, 
        name: data.name,
        slug: data.slug,
        price: data.price,
        category: data.category,
        image: data.image,
      });
    });

    // 4. Push to Algolia
    await index.saveObjects(products);

    return NextResponse.json({ 
      success: true, 
      count: products.length, 
      message: 'Successfully synced Firestore products to Algolia!' 
    });

  } catch (error: any) {
    console.error('Algolia sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
