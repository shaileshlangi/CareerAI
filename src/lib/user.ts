import { doc, setDoc, getDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type UserRole = 'admin' | 'recruiter' | 'employer' | 'seeker';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  createdAt: any;
}

export async function createUser(uid: string, data: Omit<User, 'uid' | 'createdAt'>): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
  });
}

export async function getUser(uid: string): Promise<User | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as User;
  } else {
    return null;
  }
}

export async function getAllUsers(): Promise<User[]> {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
        users.push(doc.data() as User);
    });
    return users;
}
