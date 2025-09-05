
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Video } from "lucide-react";
import Link from "next/link";
import { getApplicationsForSeeker, ApplicationWithJob } from '@/lib/application';
import { Badge } from '@/components/ui/badge';

export default function SeekerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      if (user) {
        try {
          const fetchedApplications = await getApplicationsForSeeker(user.uid);
          setApplications(fetchedApplications);
        } catch (error) {
          console.error("Failed to fetch applications", error);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) { // If there is no user and we are not loading auth state
        setLoading(false);
      }
    }
    fetchApplications();
  }, [user, authLoading]);

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">Job Seeker Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome! Track your applications and prepare for interviews.</p>
      
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>Here are the jobs you've applied for.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length > 0 ? (
                applications.map(({ job, application }) => (
                  <TableRow key={application.uid}>
                    <TableCell className="font-medium">{job?.title || 'Job not found'}</TableCell>
                    <TableCell>{job?.employerId || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={application.status === 'Interview' ? 'default' : 'secondary'}>
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {application.status === "Interview" && (
                         <Button asChild>
                           <Link href={`/dashboard/seeker/interview/${job?.uid}`}>
                             <Video className="mr-2 h-4 w-4" />
                             Start AI Interview
                           </Link>
                         </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    You haven't applied to any jobs yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
