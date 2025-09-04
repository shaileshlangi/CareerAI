
"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
        if (!user) {
            router.replace('/login');
            return;
        }
        switch (user.role) {
            case 'admin':
                router.replace('/dashboard/admin');
                break;
            case 'employer':
                router.replace('/dashboard/employer');
                break;
            case 'seeker':
                router.replace('/dashboard/seeker');
                break;
            default:
                // Fallback for any other roles or if role is undefined
                router.replace('/login');
        }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
