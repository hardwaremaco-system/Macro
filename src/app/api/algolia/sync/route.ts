// src/app/api/algolia/sync/route.ts
import algoliasearch from 'algoliasearch';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const productData = await request.json();

    // 1. Verify credentials exist
    if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Algolia credentials missing from environment variables.' },
        { status: 500 }
      );
    }

    // 2. Initialize the secure Algolia admin client
    const client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.ALGOLIA_ADMIN_KEY
    );

    // 3. Connect to your specific index (assuming you named it 'products')
    const index = client.initIndex('products');

    // 4. Save the product to Algolia (Algolia requires an 'objectID' which we will map to the Firestore doc ID)
    await index.saveObject(productData);

    return NextResponse.json({ success: true, message: 'Synced to Algolia' });
  } catch (error) {
    console.error('Algolia sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync with Algolia search index.' },
      { status: 500 }
    );
  }
}
