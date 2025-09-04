import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Bot, Briefcase, LayoutDashboard } from 'lucide-react';

const features = [
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'AI Resume Optimization',
    description: 'Optimize your resume for any job description with our AI-powered ATS checker.',
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI Interview Agent',
    description: 'Practice and ace your interviews with our realistic AI-powered mock interview agents.',
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'Smart Job Board',
    description: 'Find jobs that match your skills and experience, and apply with one click.',
  },
  {
    icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
    title: 'Recruitment Dashboard',
    description: 'For agencies and employers to track jobs, candidates, and client submissions seamlessly.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="container py-12">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to succeed
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          From finding your dream job to hiring the perfect candidate, we've got you covered.
        </p>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="relative overflow-hidden rounded-lg bg-background/50 p-px shadow-lg shadow-black/5">
            <div className="relative h-full rounded-lg bg-card p-6 backdrop-blur-xl backdrop-filter">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
