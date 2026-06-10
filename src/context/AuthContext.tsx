// src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';

// Define the shape of our user profile stored in Firestore
interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'editor' | 'user';
  addresses: Array<{
    id: string;
    street: string;
    city: string;
    isDefault: boolean;
  }>;
  createdAt: any;
}

// Define what values our Context will share across the application
interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isEditor: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Listen for Firebase Authentication state changes (login, logout, token refresh)
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // 2. If a user is logged in, attach a real-time listener to their Firestore profile document
        const profileRef = doc(db, 'users', currentUser.uid);
        
        const unsubscribeProfile = onSnapshot(
          profileRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data() as UserProfile);
            } else {
              setProfile(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching user profile from Firestore:', error);
            setLoading(false);
          }
        );

        // Clean up the profile listener if the user changes or logs out
        return () => unsubscribeProfile();
      } else {
        // 3. If no user is logged in, clear profile and stop loading
        setProfile(null);
        setLoading(false);
      }
    });

    // Clean up the auth listener when the component unmounts
    return () => unsubscribeAuth();
  }, []);

  // Compute clean role access flags for easy frontend routing checks
  const isAdmin = profile?.role === 'admin';
  const isEditor = profile?.role === 'admin' || profile?.role === 'editor';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, isEditor }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume the AuthContext instantly within any functional component
export function useAuth() {
  return useContext(AuthContext);
}
