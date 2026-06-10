// src/lib/firebase/admin.ts

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Vercel sometimes passes newline characters as literal strings. We must format them properly for the private key to work.
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

const adminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: privateKey,
};

let adminApp: App;

// Initialize Firebase Admin (Singleton pattern)
if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert(adminConfig),
  });
} else {
  adminApp = getApps()[0];
}

// Initialize specific Admin services to bypass security rules on the server
const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

export { adminApp, adminAuth, adminDb };
