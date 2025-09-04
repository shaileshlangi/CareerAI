
"use client";

import { useState, useMemo } from 'react';
import { User } from "@/lib/user";
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

interface UserListProps {
  users: User[];
}

type SortKey = keyof User;

export default function AdminUserList({ users }: UserListProps) {
    const [filter, setFilter] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'createdAt', direction: 'descending' });

    const sortedUsers = useMemo(() => {
        let sortableUsers = [...users];
        if (sortConfig !== null) {
            sortableUsers.sort((a, b) => {
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
        return sortableUsers;
    }, [users, sortConfig]);

    const filteredUsers = useMemo(() => {
        return sortedUsers.filter(user =>
          (user.displayName?.toLowerCase() || '').includes(filter.toLowerCase()) ||
          (user.email?.toLowerCase() || '').includes(filter.toLowerCase()) ||
          user.role.toLowerCase().includes(filter.toLowerCase())
        );
      }, [sortedUsers, filter]);

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
            placeholder="Filter users..."
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
                    <Button variant="ghost" onClick={() => requestSort('displayName')}>
                        Name
                        {getSortIndicator('displayName')}
                    </Button>
                </TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('email')}>
                        Email
                        {getSortIndicator('email')}
                    </Button>
                </TableHead>
                <TableHead>
                     <Button variant="ghost" onClick={() => requestSort('role')}>
                        Role
                        {getSortIndicator('role')}
                    </Button>
                </TableHead>
                <TableHead>
                     <Button variant="ghost" onClick={() => requestSort('createdAt')}>
                        Joined
                        {getSortIndicator('createdAt')}
                    </Button>
                </TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                <TableRow key={user.uid}>
                    <TableCell className="font-medium">{user.displayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                            {user.role}
                        </Badge>
                    </TableCell>
                    <TableCell>
                    {user.createdAt?.toDate().toLocaleDateString()}
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                    No users found.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
    </div>
  );
}
