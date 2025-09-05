
"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { getJob, Job } from '@/lib/job';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Video, Mic, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { generateInterviewQuestions, InterviewQuestions } from '@/ai/flows/interview-questions';
import { Progress } from '@/components/ui/progress';

export default function AIInterviewPage() {
  const { user } = useAuth();
  const params = useParams();
  const jobId = params.jobId as string;
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [interviewState, setInterviewState] = useState<'idle' | 'starting' | 'inprogress' | 'finished'>('idle');
  const [questions, setQuestions] = useState<InterviewQuestions | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    async function fetchJob() {
      if (!user || !jobId) return;
      try {
        setLoading(true);
        const fetchedJob = await getJob(jobId);
        setJob(fetchedJob);
      } catch (error) {
        console.error("Failed to fetch job", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch job details.' });
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [user, jobId, toast]);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera and microphone permissions in your browser settings to start the interview.',
        });
      }
    };
    getCameraPermission();
  }, [toast]);

  const startInterview = async () => {
    if (!job) return;
    setInterviewState('starting');
    try {
        const generatedQuestions = await generateInterviewQuestions({
            jobTitle: job.title,
            jobDescription: job.description
        });
        setQuestions(generatedQuestions);
        setInterviewState('inprogress');
    } catch (error) {
        console.error("Error generating interview questions:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not start the interview. Please try again."})
        setInterviewState('idle');
    }
  }

  const renderContent = () => {
    switch (interviewState) {
        case 'idle':
            return (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Prepare for your AI Interview</h2>
                    <p className="text-muted-foreground mb-6">You will be asked a series of questions related to the job. <br/> Make sure you are in a quiet environment.</p>
                    <Button onClick={startInterview} size="lg" disabled={!hasCameraPermission}>
                        <Video className="mr-2 h-5 w-5" />
                        Start Interview
                    </Button>
                </div>
            )
        case 'starting':
             return (
                <div className="flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Generating your interview questions...</p>
                </div>
             )
        case 'inprogress':
            if (!questions) return null;
            const progress = ((currentQuestionIndex) / questions.questions.length) * 100;
            return (
                 <div>
                    <Progress value={progress} className="mb-4" />
                    <Card className="bg-muted">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Bot className="h-8 w-8 text-primary" />
                            <div>
                                <CardTitle>Question {currentQuestionIndex + 1} of {questions.questions.length}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-semibold">{questions.questions[currentQuestionIndex]}</p>
                        </CardContent>
                    </Card>
                    <div className="mt-6 flex justify-center gap-4">
                        <Button variant="outline" disabled>
                            <Mic className="mr-2 h-4 w-4" /> Recording...
                        </Button>
                        <Button 
                            onClick={() => setCurrentQuestionIndex(i => i + 1)} 
                            disabled={currentQuestionIndex >= questions.questions.length - 1}
                        >
                            Next Question
                        </Button>
                    </div>
                </div>
            )
        case 'finished':
            return <p>Interview Finished!</p>
    }
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>AI Video Interview</CardTitle>
                        <CardDescription>For the role: {job?.title || 'loading...'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video bg-black rounded-md mb-4 flex items-center justify-center">
                            <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                        </div>
                        {hasCameraPermission === false && (
                            <Alert variant="destructive">
                                <AlertTitle>Camera and Microphone Access Required</AlertTitle>
                                <AlertDescription>
                                Please allow camera and microphone access in your browser to use this feature.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="sticky top-24">
                <Card className="min-h-[300px] flex items-center justify-center">
                    <CardContent className="pt-6">
                        {renderContent()}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
