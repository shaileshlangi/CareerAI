
"use client";

import { useState, useMemo } from 'react';
import { Job } from "@/lib/job";
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
import { ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface JobListProps {
  jobs: Job[];
}

type SortKey = keyof Job;

export default function AdminJobList({ jobs }: JobListProps) {
    const [filter, setFilter] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'createdAt', direction: 'descending' });

    const sortedJobs = useMemo(() => {
        let sortableJobs = [...jobs];
        if (sortConfig !== null) {
            sortableJobs.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                
                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;
                
                let comparison = 0;
                if (sortConfig.key === 'createdAt' && aValue.toDate && bValue.toDate) {
                    comparison = aValue.toDate().getTime() - bValue.toDate().getTime();
                } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                    comparison = aValue.localeCompare(bValue);
                } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                    comparison = aValue - bValue;
                }

                return sortConfig.direction === 'ascending' ? comparison : -comparison;
            });
        }
        return sortableJobs;
    }, [jobs, sortConfig]);

    const filteredJobs = useMemo(() => {
        return sortedJobs.filter(job =>
          (job.title?.toLowerCase() || '').includes(filter.toLowerCase()) ||
          (job.location?.toLowerCase() || '').includes(filter.toLowerCase()) ||
          job.status.toLowerCase().includes(filter.toLowerCase())
        );
    }, [sortedJobs, filter]);

    const requestSort = (key: SortKey) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: SortKey) => {
        if (!sortConfig || sortConfig.key !== key) {
          return <ArrowUpDown className="ml-2 h-4 w-4" />;
        }
        return sortConfig.direction === 'ascending' ? '▲' : '▼';
    };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter jobs..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('title')}>
                    Title
                    {getSortIndicator('title')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('status')}>
                    Status
                    {getSortIndicator('status')}
                </Button>
              </TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => requestSort('location')}>
                    Location
                    {getSortIndicator('location')}
                 </Button>
              </TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => requestSort('createdAt')}>
                    Posted
                    {getSortIndicator('createdAt')}
                 </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <TableRow key={job.uid}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>
                    <Badge variant={job.status === "open" ? "default" : "secondary"}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    {job.createdAt?.toDate().toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No jobs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
