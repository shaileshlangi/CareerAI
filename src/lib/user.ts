
'use server';

import { doc, setDoc, getDoc, serverTimestamp, collection, getDocs, Timestamp, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { adminDb } from '@/lib/firebase-admin';

export type UserRole = 'admin' | 'recruiter' | 'employer' | 'seeker';

export interface UserDocument {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  createdAt: Timestamp;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  createdAt: Date;
}

export type SerializableUser = Omit<User, 'createdAt'> & {
    createdAt: string;
};


// This function still uses the client SDK because it's called from the client-side sign-up process.
export async function createUser(uid: string, data: Omit<User, 'uid' | 'createdAt'>): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
  });
}

const userFromDoc = (docSnap: any): User => {
    const data = docSnap.data() as UserDocument;
    return {
      ...data,
      createdAt: data.createdAt.toDate(),
    };
};


// This function also uses the client SDK for fetching the current user's profile on the client.
export async function getUser(uid: string): Promise<User | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return userFromDoc(docSnap);
  } else {
    return null;
  }
}

// This function is for server-side use, so it uses the Admin SDK.
export async function getAllUsers(): Promise<SerializableUser[]> {
    const usersSnapshot = await adminDb.collection('users').orderBy('createdAt', 'desc').get();
    const users: SerializableUser[] = usersSnapshot.docs.map(doc => {
      const data = doc.data() as UserDocument;
      return {
        ...data,
        createdAt: data.createdAt.toDate().toISOString(), 
      };
    });
    return users;
}

// Client-side function to get mock applicants for a job.
// In a real app, this would query an 'applications' collection.
export async function getUsersForJob(jobId: string): Promise<User[]> {
    // This is a mock implementation. We're just grabbing a few users.
    // A real implementation would look at an "applications" collection
    // that links users to jobs.
    console.log(`Fetching mock applicants for job: ${jobId}`);
    const q = query(collection(db, 'users'), limit(5));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(userFromDoc);
}
