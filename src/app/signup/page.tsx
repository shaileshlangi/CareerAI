
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="font-headline text-4xl font-bold sm:text-5xl">Join CareerAI</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose your path and let's get started.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>For Job Seekers</CardTitle>
                    <CardDescription>Find your dream job, powered by AI.</CardDescription>
                </CardHeader>
                <CardContent className='flex-grow'>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>AI-powered resume optimization</li>
                        <li>Personalized job recommendations</li>
                        <li>Practice interviews with AI agents</li>
                    </ul>
                </CardContent>
                <div className="p-6 pt-0">
                    <Button asChild className="w-full">
                        <Link href="/signup-seeker">
                            Get Started as a Job Seeker
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>For Employers & Recruiters</CardTitle>
                    <CardDescription>Hire the best talent, faster.</CardDescription>
                </CardHeader>
                <CardContent className='flex-grow'>
                     <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Post jobs and reach millions</li>
                        <li>AI-powered candidate matching</li>
                        <li>Streamline your hiring workflow</li>
                    </ul>
                </CardContent>
                <div className="p-6 pt-0">
                    <Button asChild className="w-full">
                        <Link href="/signup-employer">
                            Get Started as an Employer
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
