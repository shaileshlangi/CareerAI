
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const jobSeekerPlans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Get started with the essentials for your job search.',
    features: ['AI Resume Parsing (basic extraction)', '1 Resume Conversion per month', 'Limited Job Applications'],
    isPopular: false,
  },
  {
    name: 'Smart',
    price: { monthly: 299, yearly: 2990 },
    description: 'Power up your job search with advanced AI tools.',
    features: [
      'Unlimited AI Resume Conversions',
      'AI Career Suggestions',
      'Apply up to 20 Jobs/Month',
    ],
    isPopular: false,
  },
  {
    name: 'Pro',
    price: { monthly: 499, yearly: 4990 },
    description: 'The ultimate toolkit for dedicated job seekers.',
    features: [
      'AI Interview Preparation',
      'Priority Resume Review by AI',
      'Unlimited Job Applications',
    ],
    isPopular: true,
  },
  {
    name: 'Elite',
    price: { monthly: 999, yearly: 9990 },
    description: 'For those who want a premium, guided experience.',
    features: [
        'All Pro features',
        'Premium Resume Templates',
        'AI-generated Cover Letters',
        '1-on-1 AI Career Coaching',
    ],
    isPopular: false,
  },
];

const employerPlans = [
    {
        name: 'Starter',
        price: { monthly: 1999, yearly: 19990 },
        description: 'Perfect for small businesses with occasional hiring needs.',
        features: ['Post up to 3 Jobs', 'Access to Candidate Search (Basic)', 'AI Matching Suggestions'],
        isPopular: false,
      },
      {
        name: 'Growth',
        price: { monthly: 6999, yearly: 69990 },
        description: 'For growing companies hiring at a steady pace.',
        features: [
          'Post up to 15 Jobs',
          'Resume Database Access (up to 100 profiles)',
          'AI Shortlisting Support',
        ],
        isPopular: true,
      },
      {
        name: 'Enterprise',
        price: { monthly: 14999, yearly: 149990 },
        description: 'For large companies scaling their teams.',
        features: [
            'Unlimited Job Posts',
            'Unlimited Candidate Search',
            'AI Screening & Scheduling Agent',
            'Analytics Dashboard for Hiring'
        ],
        isPopular: false,
      },
      {
        name: 'Custom Corporate',
        price: { monthly: 'Custom', yearly: 'Custom' },
        description: 'Bespoke solutions for your organization.',
        features: [
          'Tailored Solutions for Bulk Hiring',
          'API Integrations with Company ATS',
          'Advanced AI Reports & HR Tools',
        ],
        isPopular: false,
      },
];


export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    jobSeeker: jobSeekerPlans,
    employer: employerPlans,
  };

  const getPrice = (price: { monthly: number | string, yearly: number | string }) => {
    const value = price[billingCycle];
    if (typeof value === 'number') {
      return `₹${value.toLocaleString()}`;
    }
    return value;
  }

  const getButtonText = (plan: { name: string; price: { monthly: number | string } }) => {
    if (plan.price.monthly === 'Custom') {
        return 'Contact Sales';
    }
    if (plan.price.monthly === 0) {
        return 'Get Started';
    }
    return 'Subscribe';
  }

  return (
    <div className="py-12 md:py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-gray-900 dark:to-slate-900">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-headline text-4xl font-bold sm:text-5xl">Flexible Pricing for Everyone</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find the perfect plan to accelerate your career or your hiring process.
          </p>
        </div>

        <div className="flex justify-center items-center space-x-4 my-8">
          <Label htmlFor="billing-cycle" className="font-medium">Monthly</Label>
          <Switch
            id="billing-cycle"
            checked={billingCycle === 'yearly'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
          />
          <Label htmlFor="billing-cycle" className="font-medium">
            Yearly <span className="text-primary font-semibold">(Save up to 16%)</span>
          </Label>
        </div>

        <div className="mt-12">
            <h2 className="text-center font-headline text-3xl font-bold mb-8">For Job Seekers</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 items-stretch">
              {plans.jobSeeker.map((plan) => (
                <Card key={plan.name} className={cn('flex flex-col rounded-xl shadow-lg transition-transform hover:scale-[1.02]', plan.isPopular && 'border-primary ring-2 ring-primary')}>
                  {plan.isPopular && (
                    <div className="py-1.5 px-4 bg-primary text-primary-foreground text-center text-sm font-semibold rounded-t-xl -mt-px">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="pt-8">
                    <CardTitle className="font-bold text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-extrabold tracking-tight">{getPrice(plan.price)}</span>
                      {typeof plan.price[billingCycle] === 'number' && plan.price.monthly !== 0 &&(
                        <span className="ml-1.5 text-muted-foreground">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                      )}
                    </div>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-4">
                    <Button className="w-full" variant={plan.isPopular ? 'default' : 'outline'} size="lg">
                      {getButtonText(plan)}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <h2 className="text-center font-headline text-3xl font-bold mt-20 mb-8">For Companies</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 items-stretch">
              {plans.employer.map((plan) => (
                <Card key={plan.name} className={cn('flex flex-col rounded-xl shadow-lg transition-transform hover:scale-[1.02]', plan.isPopular && 'border-primary ring-2 ring-primary')}>
                   {plan.isPopular && (
                    <div className="py-1.5 px-4 bg-primary text-primary-foreground text-center text-sm font-semibold rounded-t-xl -mt-px">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="pt-8">
                    <CardTitle className="font-bold text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <div className="flex items-baseline">
                      <span className="text-4xl font-extrabold tracking-tight">{getPrice(plan.price)}</span>
                      {typeof plan.price[billingCycle] === 'number' && plan.price.monthly !== 0 && (
                        <span className="ml-1.5 text-muted-foreground">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                      )}
                    </div>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-4">
                    <Button className="w-full" variant={plan.isPopular ? 'default' : 'outline'} size="lg">
                      {getButtonText(plan)}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}
