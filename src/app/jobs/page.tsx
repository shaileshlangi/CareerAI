
"use client";

import { useEffect, useState } from 'react';
import { getJobs, Job } from '@/lib/job';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Briefcase, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { useFirestore } from '@/hooks/use-auth';

export default function JobBoardPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const db = useFirestore();

    useEffect(() => {
        async function fetchJobs() {
            if (!db) return;
            try {
                const openJobs = await getJobs(db, 'open');
                setJobs(openJobs);
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, [db]);

    return (
        <div className="py-12 md:py-20">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="font-headline text-4xl font-bold sm:text-5xl">Job Board</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Find your next opportunity. Explore thousands of open positions.
                    </p>
                </div>

                <div className="mt-12">
                    {loading || !db ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {jobs.length > 0 ? (
                                jobs.map(job => (
                                    <Card key={job.uid} className="hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-start">
                                                <Link href={`/jobs/${job.uid}`} className="hover:text-primary transition-colors">
                                                    {job.title}
                                                </Link>
                                                <Button asChild>
                                                    <Link href={`/jobs/${job.uid}`}>View Job</Link>
                                                </Button>
                                            </CardTitle>
                                            <CardDescription>Posted by Employer: {job.employerId.substring(0, 8)}...</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Briefcase className="h-4 w-4" />
                                                    <span>Full-time</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{job.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <IndianRupee className="h-4 w-4" />
                                                    <span>{job.salary.toLocaleString()} / year</span>
                                                </div>
                                            </div>
                                             <div className="mt-4 flex flex-wrap gap-2">
                                                {job.skills.map(skill => (
                                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-16">
                                    <h3 className="text-2xl font-semibold">No open jobs</h3>
                                    <p className="text-muted-foreground mt-2">Please check back later for new opportunities.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
