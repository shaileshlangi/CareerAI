"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUser, User } from '@/lib/user';
import { usePathname, useRouter } from 'next/navigation';

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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        const userProfile = await getUser(user.uid);
        setUser(userProfile);
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const isLoggedIn = !!firebaseUser;

  const publicRoutes = ['/login', '/signup', '/signup-seeker', '/signup-employer', '/pricing', '/products', '/about', '/contact', '/privacy', '/terms', '/'];

  useEffect(() => {
    if (!loading && !isLoggedIn && !publicRoutes.some(path => pathname.startsWith(path))) {
      router.push('/login');
    }
  }, [loading, isLoggedIn, pathname, router, publicRoutes]);


  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, isLoggedIn }}>
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
