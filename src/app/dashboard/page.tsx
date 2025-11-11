
"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth is still loading, wait.
    if (loading) {
      return;
    }

    // If loading is finished and we have a user with a role, redirect.
    if (user && user.role) {
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
          // If role is unknown, redirect to login as a fallback.
          router.replace('/login');
          break;
      }
    } else if (!user) {
      // If loading is finished and there's no user, redirect to login.
      router.replace('/login');
    }
    // The dependency array ensures this effect runs only when loading or user state changes.
  }, [user, loading, router]);

  // Display a loading spinner while the redirection logic is processing.
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
