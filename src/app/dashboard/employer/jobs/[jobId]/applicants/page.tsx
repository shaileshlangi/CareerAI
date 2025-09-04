
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { getJob, Job } from '@/lib/job';
import { getUsersForJob, User } from '@/lib/user';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button }from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function ApplicantsPage() {
  const { user } = useAuth();
  const params = useParams();
  const jobId = params.jobId as string;
  const { toast } = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user || !jobId) return;
      try {
        setLoading(true);
        const fetchedJob = await getJob(jobId);
        if (fetchedJob && fetchedJob.employerId === user.uid) {
          setJob(fetchedJob);
          // Mocking applicants for now, as we don't have an application system yet.
          // In a real app, you would fetch users who have applied to this job.
          const fetchedApplicants = await getUsersForJob(jobId); 
          setApplicants(fetchedApplicants);
        } else {
          toast({ variant: 'destructive', title: 'Error', description: 'Job not found or you do not have permission to view it.' });
        }
      } catch (error) {
        console.error("Failed to fetch job or applicants", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch job details.' });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, jobId, toast]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (!job) {
    return (
      <div className="container py-12 text-center">
        <p>Could not load job information.</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-4">
        <div>
            <h1 className="text-3xl font-bold">Applicants for {job.title}</h1>
            <p className="text-muted-foreground">Review candidates who have applied for this position.</p>
        </div>
         <Button variant="outline" asChild>
          <Link href="/dashboard/employer">Back to Dashboard</Link>
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Interview Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <TableRow key={applicant.uid}>
                    <TableCell className="font-medium">{applicant.displayName}</TableCell>
                    <TableCell>{applicant.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Not Started</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" disabled>
                        <Bot className="mr-2 h-4 w-4" />
                        Start AI Interview
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No applicants yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
