
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getJobsForEmployer, Job } from '@/lib/job';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Loader2 } from 'lucide-react';
import JobList from './_components/job-list';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      if (user) {
        try {
          const fetchedJobs = await getJobsForEmployer(user.uid);
          setJobs(fetchedJobs);
        } catch (error) {
            console.error("Failed to fetch jobs", error)
        } finally {
            setLoading(false);
        }
      }
    }
    fetchJobs();
  }, [user]);

  const onJobDeleted = (jobId: string) => {
    setJobs(jobs.filter(job => job.uid !== jobId));
  }

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold">Employer Dashboard</h1>
            <p className="text-muted-foreground">Manage your job postings and applicants.</p>
        </div>
        <Button asChild>
            <Link href="/dashboard/employer/jobs/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Post a New Job
            </Link>
        </Button>
      </div>

      {loading ? (
         <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
         </div>
      ) : (
        <JobList jobs={jobs} onJobDeleted={onJobDeleted} />
      )}
    </div>
  );
}
