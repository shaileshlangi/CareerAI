
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { getAllUsers, User } from '@/lib/user';
import { getAllJobs, Job } from '@/lib/job';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, Briefcase, DollarSign, BarChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminUserList from './_components/user-list';
import AdminJobList from './_components/job-list';

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && user?.role !== 'admin') {
            router.push('/dashboard');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user?.role === 'admin') {
            async function fetchData() {
                try {
                    const [fetchedUsers, fetchedJobs] = await Promise.all([
                        getAllUsers(),
                        getAllJobs()
                    ]);
                    setUsers(fetchedUsers);
                    setJobs(fetchedJobs);
                } catch (error) {
                    console.error("Failed to fetch admin data", error);
                } finally {
                    setLoading(false);
                }
            }
            fetchData();
        }
    }, [user]);

    if (authLoading || loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }
    
    const totalUsers = users.length;
    const totalJobs = jobs.length;
    const openJobs = jobs.filter(job => job.status === 'open').length;

    return (
        <div className="container py-12">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mb-8">Welcome, Admin!</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Jobs Posted</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalJobs}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{openJobs}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="users">
                <TabsList>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="jobs">Jobs</TabsTrigger>
                </TabsList>
                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <AdminUserList users={users} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="jobs">
                     <Card>
                        <CardHeader>
                            <CardTitle>Job Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <AdminJobList jobs={jobs} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
