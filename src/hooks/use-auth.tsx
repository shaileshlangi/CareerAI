
"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { onAuthStateChanged, User as FirebaseUser, getAuth, Auth } from 'firebase/auth';
import { getUser, User } from '@/lib/user';
import { initializeClientApp } from '@/lib/firebase';
import { getFirestore, Firestore } from 'firebase/firestore';

// --- Initialize Firebase services once, outside the component ---
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
const FirestoreContext = createContext<Firestore | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, async (fbUser) => {
      setLoading(true);
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
      <FirestoreContext.Provider value={dbInstance}>
        {children}
      </FirestoreContext.Provider>
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

export const useFirestore = () => {
  const context = useContext(FirestoreContext);
  if (context === undefined || context === null) {
    throw new Error('useFirestore must be used within an AuthProvider and the context must be available.');
  }
  return context;
};
