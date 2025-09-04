
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating interview questions
 * based on a job description.
 *
 * - generateInterviewQuestions - A function that handles the question generation process.
 * - InterviewQuestionsInput - The input type for the function.
 * - InterviewQuestions - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterviewQuestionsInputSchema = z.object({
  jobTitle: z.string().describe('The title of the job.'),
  jobDescription: z
    .string()
    .describe('The job description for which to generate questions.'),
});
export type InterviewQuestionsInput = z.infer<
  typeof InterviewQuestionsInputSchema
>;

const InterviewQuestionsSchema = z.object({
  questions: z
    .array(z.string())
    .describe(
      'A list of 5-7 relevant interview questions based on the job description.'
    ),
});
export type InterviewQuestions = z.infer<
  typeof InterviewQuestionsSchema
>;

export async function generateInterviewQuestions(
  input: InterviewQuestionsInput
): Promise<InterviewQuestions> {
  return interviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewQuestionsPrompt',
  input: {schema: InterviewQuestionsInputSchema},
  output: {schema: InterviewQuestionsSchema},
  prompt: `You are an expert recruitment consultant. Your task is to generate a list of 5 to 7 insightful interview questions for a candidate applying for the role of '{{{jobTitle}}}'.

The questions should be based on the provided job description to assess the candidate's suitability, skills, and experience. Include a mix of technical, behavioral, and situational questions.

Job Description:
{{{jobDescription}}}

Generate the questions.
`,
});

const interviewQuestionsFlow = ai.defineFlow(
  {
    name: 'interviewQuestionsFlow',
    inputSchema: InterviewQuestionsInputSchema,
    outputSchema: InterviewQuestionsSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
