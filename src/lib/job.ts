
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
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from './user';

export type JobStatus = 'open' | 'closed';

export interface Job {
  uid: string;
  employerId: string;
  title: string;
  description: string;
  skills: string[];
  salary: number;
  location: string;
  status: JobStatus;
  createdAt: any;
  updatedAt: any;
}

export async function createJob(
  employerId: string,
  data: Omit<Job, 'uid' | 'employerId' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<string> {
  const jobRef = doc(collection(db, 'jobs'));
  await setDoc(jobRef, {
    ...data,
    uid: jobRef.id,
    employerId,
    status: 'open',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return jobRef.id;
}

export async function getJob(uid: string): Promise<Job | null> {
  const docRef = doc(db, 'jobs', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Job;
  } else {
    return null;
  }
}

export async function getJobsForEmployer(employerId: string): Promise<Job[]> {
    const q = query(collection(db, 'jobs'), where('employerId', '==', employerId));
    const querySnapshot = await getDocs(q);
    const jobs: Job[] = [];
    querySnapshot.forEach((doc) => {
        jobs.push(doc.data() as Job);
    });
    return jobs;
}

export async function getAllJobs(): Promise<Job[]> {
    const querySnapshot = await getDocs(collection(db, 'jobs'));
    const jobs: Job[] = [];
    querySnapshot.forEach((doc) => {
        jobs.push(doc.data() as Job);
    });
    return jobs;
}

export async function updateJob(uid: string, data: Partial<Omit<Job, 'uid' | 'employerId' | 'createdAt'>>): Promise<void> {
    const jobRef = doc(db, 'jobs', uid);
    await updateDoc(jobRef, {
        ...data,
        updatedAt: serverTimestamp()
    });
}

export async function deleteJob(uid: string): Promise<void> {
    const jobRef = doc(db, 'jobs', uid);
    await deleteDoc(jobRef);
}
