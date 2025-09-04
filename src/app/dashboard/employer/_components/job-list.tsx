
"use client";

import { useState } from 'react';
import { Job, deleteJob } from "@/lib/job";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Edit, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"

interface JobListProps {
  jobs: Job[];
  onJobDeleted: (jobId: string) => void;
}

export default function JobList({ jobs, onJobDeleted }: JobListProps) {
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    try {
      await deleteJob(jobToDelete);
      onJobDeleted(jobToDelete);
      toast({
        title: "Success",
        description: "Job has been deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete job.",
      });
    } finally {
      setIsAlertOpen(false);
      setJobToDelete(null);
    }
  };

  return (
    <>
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Posted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <TableRow key={job.uid}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>
                  <Badge variant={job.status === "open" ? "default" : "secondary"}>
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  {job.createdAt?.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/employer/jobs/${job.uid}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                         <Link href={`/dashboard/employer/jobs/${job.uid}/applicants`}>
                            <Users className="mr-2 h-4 w-4" />
                            <span>View Applicants</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(job.uid)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>              
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                You haven't posted any jobs yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this job posting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
