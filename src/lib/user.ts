
'use server';

import { doc, setDoc, getDoc, serverTimestamp, collection, getDocs, Timestamp, query, where, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { adminDb } from '@/lib/firebase-admin';

export type UserRole = 'admin' | 'employer' | 'seeker';

// Common fields for all users
interface BaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string;
  role: UserRole;
  phone?: string;
  createdAt: Timestamp;
}

// Role-specific fields
export interface SeekerData {
  role: 'seeker';
}

export interface EmployerData {
  role: 'employer';
  companyName?: string;
  industry?: string;
}

export interface AdminData {
    role: 'admin';
}

// The document shape in Firestore
export type UserDocument = BaseUser & (SeekerData | EmployerData | AdminData);

// The user object shape on the client
export type User = Omit<UserDocument, 'createdAt'> & {
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

// Client-side function to get multiple users by their UIDs.
export async function getUsers(uids: string[]): Promise<User[]> {
  if (uids.length === 0) {
    return [];
  }
  // Firestore 'in' queries are limited to 30 elements in the array.
  const chunks = [];
  for (let i = 0; i < uids.length; i += 30) {
      chunks.push(uids.slice(i, i + 30));
  }
  
  const userPromises = chunks.map(async (chunk) => {
    const q = query(collection(db, 'users'), where(documentId(), 'in', chunk));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(userFromDoc);
  });

  const users = await Promise.all(userPromises);
  return users.flat();
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
