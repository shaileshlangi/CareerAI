
"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { onAuthStateChanged, User as FirebaseUser, getAuth, Auth } from 'firebase/auth';
import { getUser, User } from '@/lib/user';
import { initializeClientApp } from '@/lib/firebase';
import { getFirestore, Firestore } from 'firebase/firestore';
import { FirebaseApp } from 'firebase/app';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  auth: Auth | null;
  db: Firestore | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const FirestoreContext = createContext<Firestore | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const app = initializeClientApp();
    const authInstance = getAuth(app);
    const dbInstance = getFirestore(app);
    
    setFirebaseApp(app);
    setAuth(authInstance);
    setDb(dbInstance);

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
      auth, 
      db 
  }), [user, firebaseUser, loading, isLoggedIn, auth, db]);

  return (
    <AuthContext.Provider value={authContextValue}>
      <FirestoreContext.Provider value={db}>
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
  if (context === undefined) {
    throw new Error('useFirestore must be used within an AuthProvider');
  }
  return context;
};
