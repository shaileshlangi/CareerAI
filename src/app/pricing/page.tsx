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
    description: 'For casual job searching and getting started.',
    features: ['1 resume scan/month', 'Job search & apply', 'Basic profile'],
    isPopular: false,
  },
  {
    name: 'Pro',
    price: { monthly: 15, yearly: 144 },
    description: 'For active job seekers who want an edge.',
    features: [
      '10 resume scans/month',
      'Advanced ATS optimization',
      'Application tracking',
      'Profile highlight',
      'Priority support',
    ],
    isPopular: true,
  },
  {
    name: 'Premium',
    price: { monthly: 30, yearly: 288 },
    description: 'The ultimate toolkit for your career.',
    features: [
      'Unlimited resume scans',
      'AI interview prep',
      'Direct recruiter messaging',
      '1-on-1 career coaching session',
      'All Pro features',
    ],
    isPopular: false,
  },
];

const employerPlans = [
  {
    name: 'Basic',
    price: { monthly: 49, yearly: 490 },
    description: 'For small businesses with occasional hiring needs.',
    features: ['1 active job post', '50 applicant views/month', 'Company profile page'],
    isPopular: false,
  },
  {
    name: 'Growth',
    price: { monthly: 199, yearly: 1990 },
    description: 'For growing companies that hire regularly.',
    features: [
      '10 active job posts',
      'Unlimited applicant views',
      'Resume parsing & search',
      'AI candidate matching',
      'Branded job page',
    ],
    isPopular: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: 'Custom', yearly: 'Custom' },
    description: 'For large organizations and recruitment agencies.',
    features: [
      'Unlimited job posts',
      'Full recruitment automation suite',
      'AI interview agents',
      'API access & integrations',
      'Dedicated account manager',
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

  return (
    <div className="py-12 md:py-20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-headline text-4xl font-bold sm:text-5xl">Pricing Plans</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the perfect plan for your needs. Simple, transparent pricing.
          </p>
        </div>

        <div className="flex justify-center items-center space-x-4 my-8">
          <Label htmlFor="billing-cycle">Monthly</Label>
          <Switch
            id="billing-cycle"
            checked={billingCycle === 'yearly'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
          />
          <Label htmlFor="billing-cycle">
            Yearly <span className="text-primary font-semibold">(Save 20%)</span>
          </Label>
        </div>

        <div className="mt-12">
            <h2 className="text-center font-headline text-3xl font-bold mb-8">For Job Seekers</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {plans.jobSeeker.map((plan) => (
                <Card key={plan.name} className={cn('flex flex-col', plan.isPopular && 'border-primary ring-2 ring-primary')}>
                  {plan.isPopular && (
                    <div className="py-1 px-4 bg-primary text-primary-foreground text-center text-sm font-semibold rounded-t-lg -mt-px">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-baseline">
                      {typeof plan.price[billingCycle] === 'number' ? (
                        <>
                          <span className="text-4xl font-bold">${plan.price[billingCycle]}</span>
                          <span className="ml-1 text-muted-foreground">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                        </>
                      ) : (
                        <span className="text-4xl font-bold">{plan.price.monthly}</span>
                      )}
                    </div>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant={plan.isPopular ? 'default' : 'outline'}>
                      {plan.price.monthly === 0 ? 'Get Started' : 'Choose Plan'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <h2 className="text-center font-headline text-3xl font-bold my-16">For Companies & Employers</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {plans.employer.map((plan) => (
                <Card key={plan.name} className={cn('flex flex-col', plan.isPopular && 'border-primary ring-2 ring-primary')}>
                  {plan.isPopular && (
                    <div className="py-1 px-4 bg-primary text-primary-foreground text-center text-sm font-semibold rounded-t-lg -mt-px">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-baseline">
                      {typeof plan.price[billingCycle] === 'number' ? (
                        <>
                          <span className="text-4xl font-bold">${plan.price[billingCycle]}</span>
                          <span className="ml-1 text-muted-foreground">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                        </>
                      ) : (
                        <span className="text-4xl font-bold">{plan.price.monthly}</span>
                      )}
                    </div>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant={plan.isPopular ? 'default' : 'outline'}>
                      {plan.price.monthly === 'Custom' ? 'Contact Sales' : 'Choose Plan'}
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
