'use server';

import { doc, setDoc, getDoc, serverTimestamp, collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { adminDb } from '@/lib/firebase-admin';

export type UserRole = 'admin' | 'recruiter' | 'employer' | 'seeker';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  createdAt: any;
}

// This function still uses the client SDK because it's called from the client-side sign-up process.
export async function createUser(uid: string, data: Omit<User, 'uid' | 'createdAt'>): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
  });
}

// This function also uses the client SDK for fetching the current user's profile on the client.
export async function getUser(uid: string): Promise<User | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as User;
  } else {
    return null;
  }
}

// This function is for server-side use, so it uses the Admin SDK.
export async function getAllUsers(): Promise<User[]> {
    const usersSnapshot = await adminDb.collection('users').get();
    const users: User[] = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        // Convert Firestore Timestamp to a serializable format
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate().toISOString() : null, 
      } as User;
    });
    return users;
}
