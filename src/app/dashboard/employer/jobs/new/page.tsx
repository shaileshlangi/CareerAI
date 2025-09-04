
"use client";

import JobForm from "../_components/job-form";
import { createJob, Job } from '@/lib/job';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewJobPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (values: Omit<Job, 'uid' | 'employerId' | 'createdAt' | 'updatedAt' | 'status'>) => {
        if (!user) {
            toast({ variant: "destructive", title: "Error", description: "You must be logged in to post a job." });
            return;
        }

        try {
            await createJob(user.uid, values);
            toast({ title: "Success", description: "Your job has been posted." });
            router.push('/dashboard/employer');
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to post job." });
            console.error(error);
        }
    };

    return (
        <div className="container py-12">
             <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Post a New Job</CardTitle>
                    <CardDescription>Fill out the details below to post a new job opening.</CardDescription>
                </CardHeader>
                <CardContent>
                    <JobForm onSubmit={handleSubmit} />
                </CardContent>
            </Card>
        </div>
    );
}
