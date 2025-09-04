
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
      uid: jobRef.id,
      ...data,
      employerId,
      status: 'open' as JobStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    // Firestore security rules will handle authorization
    // For the sake of this prototype, we'll write a mock job for seekers
    if (employerId === 'seeker-prototype') {
        await setDoc(doc(db, 'jobs', 'mock-job-1'), newJobData);
        return 'mock-job-1';
    }
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
  // Seeker prototype special case
  if (uid === 'mock-job-1') {
    const mockJobDoc = await getDoc(doc(db, 'jobs', 'mock-job-1'));
    if (mockJobDoc.exists()) {
        return jobFromDoc(mockJobDoc);
    }
    // If it doesn't exist, let's create a placeholder for the prototype
    const placeholderJob = {
        uid: 'mock-job-1',
        employerId: 'mock-employer',
        title: 'Senior Frontend Developer',
        description: 'We are looking for an experienced frontend developer to join our team. You will be responsible for building and maintaining our user-facing web applications. Key responsibilities include implementing new features, optimizing performance, and ensuring a high-quality user experience. You should have strong proficiency in React, TypeScript, and modern CSS frameworks.',
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
        salary: 1500000,
        location: 'Remote',
        status: 'open' as JobStatus,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    }
    await setDoc(doc(db, 'jobs', 'mock-job-1'), placeholderJob);
    
    const fetchedDoc = await getDoc(doc(db, 'jobs', 'mock-job-1'));
    return jobFromDoc(fetchedDoc);
  }

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
