
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { getJob, Job } from '@/lib/job';
import { getApplicantsForJob, Applicant, updateApplicationStatus, ApplicationStatus } from '@/lib/application';
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
import { Loader2, Bot, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ApplicantsPage() {
  const { user } = useAuth();
  const params = useParams();
  const jobId = params.jobId as string;
  const { toast } = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user || !jobId) return;
      try {
        setLoading(true);
        const fetchedJob = await getJob(jobId);
        if (fetchedJob && fetchedJob.employerId === user.uid) {
          setJob(fetchedJob);
          const fetchedApplicants = await getApplicantsForJob(jobId); 
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
  
  const handleInitiateInterview = async (applicationId: string) => {
    setUpdatingId(applicationId);
    try {
        await updateApplicationStatus(applicationId, 'Interview');
        setApplicants(prev => prev.map(a => 
            a.application.uid === applicationId 
                ? { ...a, application: { ...a.application, status: 'Interview' as ApplicationStatus } }
                : a
        ));
        toast({ title: 'Success', description: 'Interview has been initiated for the candidate.' });
    } catch (error) {
        console.error("Failed to update application status", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not initiate interview.' });
    } finally {
        setUpdatingId(null);
    }
  };

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
  
  const getStatusBadge = (status: ApplicationStatus) => {
    switch(status) {
        case 'Interview':
            return <Badge variant="default">{status}</Badge>
        case 'Rejected':
            return <Badge variant="destructive">{status}</Badge>
        default:
            return <Badge variant="secondary">{status}</Badge>
    }
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
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.length > 0 ? (
                applicants.map(({ user, application }) => (
                  <TableRow key={user.uid}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={user.photoURL || ''} />
                        <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
                      </Avatar>
                      {user.displayName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{application.appliedAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      {getStatusBadge(application.status)}
                    </TableCell>
                    <TableCell className="text-right">
                       {application.status === 'Submitted' ? (
                         <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleInitiateInterview(application.uid)}
                            disabled={updatingId === application.uid}
                        >
                            {updatingId === application.uid ? 
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                                <Bot className="mr-2 h-4 w-4" />
                            }
                            Initiate AI Interview
                        </Button>
                       ) : (
                        <Button variant="ghost" size="sm" disabled className="text-muted-foreground">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Interview Initiated
                        </Button>
                       )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
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
