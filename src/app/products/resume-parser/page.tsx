
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { optimizeResumeForAts } from '@/ai/flows/ats-resume-optimization';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  jobDescription: z.string().min(50, {
    message: "Job description must be at least 50 characters.",
  }),
  resume: z.string().min(50, {
    message: "Resume must be at least 50 characters.",
  }),
});

type ResumeParserFormValues = z.infer<typeof formSchema>;

export default function ResumeParserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState('');
  const { toast } = useToast();

  const form = useForm<ResumeParserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: '',
      resume: '',
    },
  });

  const handleSubmit = async (values: ResumeParserFormValues) => {
    setIsLoading(true);
    setOptimizedResume('');
    try {
      const result = await optimizeResumeForAts(values);
      setOptimizedResume(result.optimizedResumeSuggestions);
      toast({
        title: "Success!",
        description: "Your resume has been optimized.",
      });
    } catch (error) {
      console.error("Error optimizing resume:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to optimize resume. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span>AI Resume Optimizer</span>
          </CardTitle>
          <CardDescription>
            Paste a job description and your resume below to get an ATS-optimized version tailored to the role, using only your existing experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste the full job description here."
                          className="min-h-[300px] text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="resume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Your Resume</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your current resume content here."
                          className="min-h-[300px] text-sm"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        We'll only use the experience you provide.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Optimizing...
                  </>
                ) : (
                  <>
                   <Sparkles className="mr-2 h-4 w-4" /> Optimize My Resume
                  </>
                )}
              </Button>
            </form>
          </Form>

          {optimizedResume && (
            <div className="mt-8">
                <Separator className="my-6" />
                <h3 className="text-2xl font-bold mb-4">Optimized Resume Suggestions</h3>
                <Card className="bg-muted/50">
                    <CardContent className="p-6">
                        <pre className="whitespace-pre-wrap font-sans text-sm">{optimizedResume}</pre>
                    </CardContent>
                </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
