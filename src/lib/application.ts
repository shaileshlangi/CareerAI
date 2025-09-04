
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
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { type Job, getJob } from '@/lib/job';
import { type User, getUsers } from '@/lib/user';

export type ApplicationStatus = 'Submitted' | 'Reviewed' | 'Interview' | 'Offered' | 'Rejected';

export interface ApplicationDocument {
  uid: string;
  jobId: string;
  seekerId: string;
  employerId: string;
  status: ApplicationStatus;
  appliedAt: Timestamp;
}

export interface Application {
  uid: string;
  jobId: string;
  seekerId: string;
  employerId: string;
  status: ApplicationStatus;
  appliedAt: Date;
}

export interface Applicant {
    user: User;
    application: Application;
}

export interface ApplicationWithJob {
    job: Job | null;
    application: Application;
}


const applicationFromDoc = (docSnap: any): Application => {
    const data = docSnap.data() as ApplicationDocument;
    return {
      ...data,
      appliedAt: data.appliedAt.toDate(),
    };
};

export async function createApplication(
  data: Omit<Application, 'uid' | 'appliedAt' | 'status'>
): Promise<string> {
    const appRef = doc(collection(db, 'applications'));
    const newApplicationData = {
      uid: appRef.id,
      ...data,
      status: 'Submitted' as ApplicationStatus,
      appliedAt: serverTimestamp(),
    };
  await setDoc(appRef, newApplicationData);
  return appRef.id;
}

export async function hasUserApplied(seekerId: string, jobId: string): Promise<boolean> {
    const q = query(
        collection(db, 'applications'),
        where('seekerId', '==', seekerId),
        where('jobId', '==', jobId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}

export async function getApplicantsForJob(jobId: string): Promise<Applicant[]> {
    const q = query(collection(db, 'applications'), where('jobId', '==', jobId));
    const querySnapshot = await getDocs(q);
    
    const applications = querySnapshot.docs.map(applicationFromDoc);
    if (applications.length === 0) return [];
    
    const seekerIds = [...new Set(applications.map(app => app.seekerId))];

    const users = await getUsers(seekerIds);
    const usersMap = new Map(users.map(u => [u.uid, u]));

    return applications.map(application => ({
        application,
        user: usersMap.get(application.seekerId)!
    })).filter(a => a.user);
}

export async function getApplicationsForSeeker(seekerId: string): Promise<ApplicationWithJob[]> {
    const q = query(collection(db, 'applications'), where('seekerId', '==', seekerId));
    const querySnapshot = await getDocs(q);

    const applications = querySnapshot.docs.map(applicationFromDoc);

    const results = await Promise.all(applications.map(async (application) => {
        const job = await getJob(application.jobId);
        return { application, job };
    }));

    return results;
}

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus): Promise<void> {
    const appRef = doc(db, 'applications', applicationId);
    await updateDoc(appRef, { status });
}
