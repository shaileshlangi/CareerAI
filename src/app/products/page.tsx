import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, FileText, Briefcase, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

const products = [
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'AI Resume Parser',
    description: 'Paste a job description and get instant feedback on how to tailor your resume for any ATS.',
    status: 'Live',
    href: '/products/resume-parser'
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI Interview Agent',
    description: 'Sharpen your interview skills with an AI that provides real-time feedback and coaching.',
    status: 'Coming Soon',
    href: '#'
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'Job Posting',
    description: 'Reach thousands of qualified candidates by posting your job openings on our platform.',
    status: 'Live',
    href: '/jobs/post'
  },
  {
    icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
    title: 'Agency Dashboard',
    description: 'A complete tool for recruitment agencies to manage candidates, clients, and jobs in one place.',
    status: 'Beta',
    href: '/dashboard'
  },
];

export default function ProductsPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-headline text-4xl font-bold sm:text-5xl">Our Products</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A suite of AI-powered tools designed to revolutionize recruitment and job searching.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
          {products.map((product) => (
            <Link key={product.title} href={product.href} className="block hover:shadow-lg transition-shadow rounded-lg">
              <Card className="h-full flex flex-col sm:flex-row items-start p-6">
                <div className="mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                    {product.icon}
                  </div>
                </div>
                <div className="flex-grow">
                  <CardHeader className="p-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{product.title}</CardTitle>
                      <Badge variant={product.status === 'Live' ? 'default' : 'secondary'}>{product.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 mt-2">
                    <CardDescription>{product.description}</CardDescription>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
