
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Job } from '@/lib/job';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  skills: z.string().min(1, "Please list at least one skill."),
  salary: z.coerce.number().min(0, "Salary must be a positive number."),
  location: z.string().min(2, "Location is required."),
});

type JobFormValues = z.infer<typeof formSchema>;

interface JobFormProps {
  onSubmit: (values: Omit<Job, 'uid' | 'employerId' | 'createdAt' | 'updatedAt' | 'status' | 'skills'> & { skills: string[] }) => void;
  initialData?: Job;
}

export default function JobForm({ onSubmit, initialData }: JobFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<JobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: initialData?.title || '',
        description: initialData?.description || '',
        skills: initialData?.skills?.join(', ') || '',
        salary: initialData?.salary || 0,
        location: initialData?.location || '',
    },
  });

  const handleSubmit = (values: JobFormValues) => {
    setIsLoading(true);
    const skillsArray = values.skills.split(',').map(skill => skill.trim());
    onSubmit({ ...values, skills: skillsArray });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Senior Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the role, responsibilities, and requirements." {...field} className="min-h-[150px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Skills</FormLabel>
              <FormControl>
                <Input placeholder="e.g. React, Node.js, TypeScript" {...field} />
              </FormControl>
              <FormDescription>
                Please provide a comma-separated list of skills.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Annual Salary (₹)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g. 1200000" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. Mumbai, India" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : (initialData ? 'Save Changes' : 'Post Job')}
        </Button>
      </form>
    </Form>
  );
}
