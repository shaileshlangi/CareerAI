
'use server';

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { adminDb } from '@/lib/firebase-admin';

export type JobStatus = 'open' | 'closed';

// This is the shape of the data in Firestore
export interface JobDocument {
  uid: string;
  employerId: string;
  title: string;
  description: string;
  skills: string[];
  salary: number;
  location: string;
  status: JobStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}


// This is the shape of the data we use on the client-side
export interface Job {
    uid: string;
    employerId: string;
    title: string;
    description: string;
    skills: string[];
    salary: number;
    location: string;
    status: JobStatus;
    createdAt: Date;
    updatedAt: Date;
}

// This is for data coming from server-side rendering (e.g. getAllJobs)
export type SerializableJob = Omit<Job, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
};


// Client-side function
export async function createJob(
  employerId: string,
  data: Omit<Job, 'uid' | 'employerId' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<string> {
  const jobRef = doc(collection(db, 'jobs'));
  const newJobData = {
    ...data,
    uid: jobRef.id,
    employerId,
    status: 'open' as JobStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(jobRef, newJobData);
  return jobRef.id;
}

const jobFromDoc = (docSnap: any): Job => {
    const data = docSnap.data() as JobDocument;
    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
};

// Client-side function
export async function getJob(uid: string): Promise<Job | null> {
  const docRef = doc(db, 'jobs', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return jobFromDoc(docSnap);
  } else {
    return null;
  }
}

// Client-side function
export async function getJobsForEmployer(employerId: string): Promise<Job[]> {
    const q = query(collection(db, 'jobs'), where('employerId', '==', employerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(jobFromDoc);
}

// Server-side function for admin dashboard
export async function getAllJobs(): Promise<SerializableJob[]> {
    const jobsSnapshot = await adminDb.collection('jobs').orderBy('createdAt', 'desc').get();
    const jobs: SerializableJob[] = jobsSnapshot.docs.map(doc => {
        const data = doc.data() as JobDocument;
        return {
          ...data,
          createdAt: data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString(),
        };
    });
    return jobs;
}

// Client-side function
export async function updateJob(uid: string, data: Partial<Omit<Job, 'uid' | 'employerId' | 'createdAt'>>): Promise<void> {
    const jobRef = doc(db, 'jobs', uid);
    await updateDoc(jobRef, {
        ...data,
        updatedAt: serverTimestamp()
    });
}

// Client-side function
export async function deleteJob(uid: string): Promise<void> {
    const jobRef = doc(db, 'jobs', uid);
    await deleteDoc(jobRef);
}
