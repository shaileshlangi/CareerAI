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
    features: ['Upload resume', 'Apply to limited jobs', '1 free AI resume optimization'],
    isPopular: false,
  },
  {
    name: 'Basic',
    price: { monthly: 199, yearly: 1990 },
    description: 'For those who want to step up their job search.',
    features: [
      'Unlimited applications',
      'AI resume optimization (up to 3/month)',
    ],
    isPopular: true,
  },
  {
    name: 'Pro',
    price: { monthly: 499, yearly: 4990 },
    description: 'For serious job seekers aiming for the top.',
    features: [
      'Unlimited applications',
      'Unlimited AI resume optimization',
      'Mock AI telephonic interview',
      'Job alerts',
      'Priority profile',
    ],
    isPopular: false,
  },
  {
    name: 'Premium',
    price: { monthly: 999, yearly: 9990 },
    description: 'The ultimate toolkit for your career.',
    features: [
        'All Pro features',
        'AI online interview practice',
        'Priority recruiter visibility'
    ],
    isPopular: false,
  },
];

const employerPlans = [
    {
        name: 'Free',
        price: { monthly: 0, yearly: 0 },
        description: 'For small businesses with occasional hiring needs.',
        features: ['Post 1 job/month', 'Limited candidate views'],
        isPopular: false,
      },
      {
        name: 'Starter',
        price: { monthly: 999, yearly: 9990 },
        description: 'For growing companies that hire regularly.',
        features: [
          'Post up to 5 jobs',
          'Shortlist candidates',
          'View AI scores',
        ],
        isPopular: true,
      },
      {
        name: 'Growth',
        price: { monthly: 2499, yearly: 24990 },
        description: 'For companies scaling their teams.',
        features: [
          'Post 15 jobs',
          'Access candidate resume optimization',
          'AI telephonic interview reports',
        ],
        isPopular: false,
      },
      {
        name: 'Enterprise',
        price: { monthly: 'Custom', yearly: 'Custom' },
        description: 'For large organizations and recruitment agencies.',
        features: [
          'Unlimited jobs',
          'Recruiter dashboard',
          'Full AI online interview reports',
          'Agency integration',
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

  const getPrice = (price: { monthly: number | string, yearly: number | string }) => {
    const value = price[billingCycle];
    if (typeof value === 'number') {
      return `₹${value.toLocaleString('en-IN')}`;
    }
    return value;
  }

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
            Yearly <span className="text-primary font-semibold">(Save ~16%)</span>
          </Label>
        </div>

        <div className="mt-12">
            <h2 className="text-center font-headline text-3xl font-bold mb-8">For Job Seekers</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
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
                      <span className="text-4xl font-bold">{getPrice(plan.price)}</span>
                      {typeof plan.price[billingCycle] === 'number' && plan.price.monthly !== 0 &&(
                        <span className="ml-1 text-muted-foreground">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                      )}
                    </div>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
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
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
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
                      <span className="text-4xl font-bold">{getPrice(plan.price)}</span>
                      {typeof plan.price[billingCycle] === 'number' && plan.price.monthly !== 0 && (
                        <span className="ml-1 text-muted-foreground">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                      )}
                    </div>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
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
