import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const seekerFeatures = ['AI Resume Scan', 'Job Application Tracking', 'AI Interview Prep'];
const employerFeatures = ['Job Posting', 'Candidate Search', 'Recruitment Automation'];

export default function PricingHomeSection() {
  return (
    <section className="bg-card/50 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Flexible Plans for Everyone
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose a plan that works for you. Get started for free.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="rounded-lg border bg-background p-8">
            <h3 className="text-2xl font-bold">For Job Seekers</h3>
            <p className="mt-2 text-muted-foreground">
              Everything you need to land your dream job.
            </p>
            <ul className="mt-6 space-y-2">
              {seekerFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border bg-background p-8">
            <h3 className="text-2xl font-bold">For Employers</h3>
            <p className="mt-2 text-muted-foreground">
              Find and hire the best talent, faster.
            </p>
            <ul className="mt-6 space-y-2">
              {employerFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="default">
            <Link href="/pricing">View All Pricing Plans</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
