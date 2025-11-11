
"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { onAuthStateChanged, User as FirebaseUser, getAuth, Auth } from 'firebase/auth';
import { getUser, User } from '@/lib/user';
import { initializeClientApp } from '@/lib/firebase';
import { getFirestore, Firestore } from 'firebase/firestore';

// --- Initialize Firebase services once, outside the component's render cycle ---
const app = initializeClientApp();
const authInstance = getAuth(app);
const dbInstance = getFirestore(app);
// ---

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  auth: Auth;
  db: Firestore;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        try {
          const userProfile = await getUser(dbInstance, fbUser.uid);
          setUser(userProfile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setUser(null);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const isLoggedIn = !loading && !!firebaseUser;

  const authContextValue = useMemo(() => ({ 
      user, 
      firebaseUser, 
      loading, 
      isLoggedIn, 
      auth: authInstance, 
      db: dbInstance
  }), [user, firebaseUser, loading, isLoggedIn]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// This hook now gets the stable db instance directly from the main AuthContext
export const useFirestore = () => {
  const { db } = useAuth();
  if (!db) {
    throw new Error('useFirestore must be used within an AuthProvider and the Firestore instance must be available.');
  }
  return db;
};
