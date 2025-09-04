
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { getJob, Job } from '@/lib/job';
import { createApplication, hasUserApplied } from '@/lib/application';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, IndianRupee, CheckCircle, Briefcase, Building } from 'lucide-react';

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;
    const { user, isLoggedIn } = useAuth();
    const { toast } = useToast();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [alreadyApplied, setAlreadyApplied] = useState(false);

    useEffect(() => {
        async function fetchJobDetails() {
            if (!jobId) return;
            try {
                setLoading(true);
                const fetchedJob = await getJob(jobId);
                setJob(fetchedJob);
            } catch (error) {
                console.error("Failed to fetch job details", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not load job details.' });
            } finally {
                setLoading(false);
            }
        }
        fetchJobDetails();
    }, [jobId, toast]);

    useEffect(() => {
        async function checkApplicationStatus() {
            if (user && job) {
                const applied = await hasUserApplied(user.uid, job.uid);
                setAlreadyApplied(applied);
            }
        }
        checkApplicationStatus();
    }, [user, job]);

    const handleApply = async () => {
        if (!isLoggedIn || !user) {
            router.push('/login?redirect=/jobs/' + jobId);
            return;
        }

        if (!job) return;

        setApplying(true);
        try {
            await createApplication({
                jobId: job.uid,
                seekerId: user.uid,
                employerId: job.employerId,
            });
            setAlreadyApplied(true);
            toast({ title: 'Success!', description: "Your application has been submitted." });
        } catch (error) {
            console.error("Failed to apply", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to submit your application.' });
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    if (!job) {
        return <div className="container py-12 text-center"><p>Job not found.</p></div>;
    }

    return (
        <div className="py-12 md:py-20">
            <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge>{job.status === 'open' ? 'Open' : 'Closed'}</Badge>
                                    <CardTitle className="text-3xl font-bold mt-2">{job.title}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-2">
                                        <Building className="h-4 w-4" /> Company ID: {job.employerId.substring(0,8)}...
                                    </CardDescription>
                                </div>
                                
                                {user?.role === 'seeker' && (
                                     <Button onClick={handleApply} disabled={applying || alreadyApplied}>
                                        {applying ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...</>
                                        ) : alreadyApplied ? (
                                            <><CheckCircle className="mr-2 h-4 w-4" /> Applied</>
                                        ) : (
                                            'Apply Now'
                                        )}
                                    </Button>
                                )}
                                {(user?.role === 'employer' || user?.role === 'admin') && (
                                    <Button disabled>Cannot apply as {user.role}</Button>
                                )}
                                {!isLoggedIn && (
                                     <Button onClick={handleApply}>Apply Now</Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-xl font-semibold mb-2">Job Description</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                            
                            <h3 className="text-xl font-semibold mt-6 mb-2">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map(skill => (
                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Briefcase className="h-5 w-5 mt-1 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold">Job Type</p>
                                    <p className="text-muted-foreground">Full-time</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 mt-1 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold">Location</p>
                                    <p className="text-muted-foreground">{job.location}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <IndianRupee className="h-5 w-5 mt-1 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold">Salary</p>
                                    <p className="text-muted-foreground">₹{job.salary.toLocaleString()} / year</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
