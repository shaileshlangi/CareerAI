
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { getAllUsers, User } from '@/lib/user';
import { getAllJobs, Job } from '@/lib/job';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, Briefcase, BarChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminUserList from './_components/user-list';
import AdminJobList from './_components/job-list';

// We need to adjust the Job and User types on the client to handle the serialized date
type SerializableUser = Omit<User, 'createdAt'> & { createdAt: string | null };
type SerializableJob = Omit<Job, 'createdAt' | 'updatedAt'> & { createdAt: string | null; updatedAt: string | null };


export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<SerializableUser[]>([]);
    const [jobs, setJobs] = useState<SerializableJob[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'admin') {
                router.push('/dashboard');
            }
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        async function fetchData() {
            if (user?.role === 'admin') {
                setLoadingData(true);
                try {
                    const [fetchedUsers, fetchedJobs] = await Promise.all([
                        getAllUsers(),
                        getAllJobs()
                    ]);
                    setUsers(fetchedUsers as SerializableUser[]);
                    setJobs(fetchedJobs as SerializableJob[]);
                } catch (error) {
                    console.error("Failed to fetch admin data", error);
                } finally {
                    setLoadingData(false);
                }
            }
        }

        if (user && !authLoading) {
            fetchData();
        }
    }, [user, authLoading]);

    if (authLoading || loadingData) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }
    
    if (!user) {
      return null;
    }

    const totalUsers = users.length;
    const totalJobs = jobs.length;
    const openJobs = jobs.filter(job => job.status === 'open').length;

    const clientSideUsers = users.map(u => ({...u, createdAt: u.createdAt ? new Date(u.createdAt) : new Date()}));
    const clientSideJobs = jobs.map(j => ({...j, createdAt: j.createdAt ? new Date(j.createdAt) : new Date()}));


    return (
        <div className="container py-12">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mb-8">Welcome, {user.displayName || 'Admin'}!</p>

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
                           <AdminUserList users={clientSideUsers} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="jobs">
                     <Card>
                        <CardHeader>
                            <CardTitle>Job Management</CardTitle>
                        </Header>
                        <CardContent>
                           <AdminJobList jobs={clientSideJobs} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
