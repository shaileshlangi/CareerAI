
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser, getAuth } from 'firebase/auth';
import { getUser, User } from '@/lib/user';
import { initializeClientApp } from '@/lib/firebase';
import { getFirestore } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    // Initialize Firebase and get the auth instance
    const app = initializeClientApp();
    const auth = getAuth(app);
    getFirestore(app); // Initialize Firestore as well
    setFirebaseReady(true);

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        try {
          const userProfile = await getUser(fbUser.uid);
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

  // Do not render children until firebase is ready and auth state is determined
  const isReady = firebaseReady && !loading;

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, isLoggedIn }}>
      {isReady ? children : null}
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
