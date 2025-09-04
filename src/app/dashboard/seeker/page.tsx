
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Video } from "lucide-react";
import Link from "next/link";

// Mock data for applied jobs
const appliedJobs = [
  {
    uid: "mock-job-1",
    title: "Senior Frontend Developer",
    company: "Innovate Inc.",
    status: "Interview Pending",
  },
  {
    uid: "mock-job-2",
    title: "Product Manager",
    company: "Solutions Co.",
    status: "Application Submitted",
  },
];

export default function SeekerDashboard() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">Job Seeker Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome, Job Seeker! Track your applications and prepare for interviews.</p>
      
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>Here are the jobs you've applied for.</CardDescription>
        </CardHeader>
        <CardContent>
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
              {appliedJobs.map((job) => (
                <TableRow key={job.uid}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell className="text-right">
                    {job.status === "Interview Pending" && (
                       <Button asChild>
                         <Link href={`/dashboard/seeker/interview/${job.uid}`}>
                           <Video className="mr-2 h-4 w-4" />
                           Start AI Interview
                         </Link>
                       </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
