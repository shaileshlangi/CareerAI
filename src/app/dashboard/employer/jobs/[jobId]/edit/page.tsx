
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth, useFirestore } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { getJob, updateJob, Job } from '@/lib/job';
import JobForm from '../../_components/job-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

export default function EditJobPage() {
    const { user, loading: authLoading } = useAuth();
    const db = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const params = useParams();
    const jobId = params.jobId as string;
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJob() {
            if (!user || !jobId || !db) {
                setLoading(false);
                return;
            };
            try {
                const fetchedJob = await getJob(db, jobId);
                if (fetchedJob && fetchedJob.employerId === user.uid) {
                    setJob(fetchedJob);
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: 'Job not found or you do not have permission to edit it.' });
                    router.push('/dashboard/employer');
                }
            } catch (error) {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch job details.' });
            } finally {
                setLoading(false);
            }
        }
        if (!authLoading) {
            fetchJob();
        }
    }, [user, jobId, router, toast, authLoading, db]);

    const handleSubmit = async (values: Omit<Job, 'uid' | 'employerId' | 'createdAt' | 'updatedAt' | 'status'>) => {
        if (!jobId || !db) return;

        try {
            await updateJob(db, jobId, values);
            toast({ title: 'Success', description: 'Job has been updated.' });
            router.push('/dashboard/employer');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update job.' });
            console.error(error);
        }
    };

    if (loading || authLoading || !db) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    if (!job) {
        return null; 
    }

    return (
        <div className="container py-12">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Edit Job</CardTitle>
                    <CardDescription>Update the details for your job posting.</CardDescription>
                </CardHeader>
                <CardContent>
                    <JobForm onSubmit={handleSubmit} initialData={job} />
                </CardContent>
            </Card>
        </div>
    );
}
