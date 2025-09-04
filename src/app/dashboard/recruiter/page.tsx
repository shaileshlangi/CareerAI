
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockCandidates = [
    { id: 'cand1', name: 'Aisha Khan', status: 'AI Interview', submittedTo: 'TechCorp' },
    { id: 'cand2', name: 'Ben Carter', status: 'Client Submission', submittedTo: 'Innovate LLC' },
    { id: 'cand3', name: 'Carlos Gomez', status: 'Sourced', submittedTo: '' },
    { id: 'cand4', name: 'Diana Smith', status: 'Offer', submittedTo: 'TechCorp' },
];


export default function RecruiterDashboard() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage your candidate pipeline and client submissions.</p>

      <Card>
        <CardHeader>
            <CardTitle>Candidate Pipeline</CardTitle>
            <CardDescription>Track all your candidates from sourcing to placement.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted To</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockCandidates.map((candidate) => (
                         <TableRow key={candidate.id}>
                            <TableCell className="font-medium">{candidate.name}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{candidate.status}</Badge>
                            </TableCell>
                            <TableCell>{candidate.submittedTo || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                        <DropdownMenuItem>View Interview Report</DropdownMenuItem>
                                        <DropdownMenuItem>Submit to Client</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
