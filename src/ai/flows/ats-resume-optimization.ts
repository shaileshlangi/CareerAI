'use server';

/**
 * @fileOverview This file defines a Genkit flow for optimizing a resume for
 * Applicant Tracking Systems (ATS). It takes a job description and a resume as
 * input, and returns suggestions for optimizing the resume.
 *
 * - optimizeResumeForAts - A function that handles the resume optimization process.
 * - AtsResumeOptimizationInput - The input type for the optimizeResumeForAts function.
 * - AtsResumeOptimizationOutput - The return type for the optimizeResumeForAts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AtsResumeOptimizationInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description for which to optimize the resume.'),
  resume: z.string().describe('The resume to optimize.'),
});
export type AtsResumeOptimizationInput = z.infer<
  typeof AtsResumeOptimizationInputSchema
>;

const AtsResumeOptimizationOutputSchema = z.object({
  optimizedResumeSuggestions: z
    .string()
    .describe(
      'Suggestions for optimizing the resume for the given job description, tailored for ATS systems.'
    ),
});
export type AtsResumeOptimizationOutput = z.infer<
  typeof AtsResumeOptimizationOutputSchema
>;

export async function optimizeResumeForAts(
  input: AtsResumeOptimizationInput
): Promise<AtsResumeOptimizationOutput> {
  return atsResumeOptimizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'atsResumeOptimizationPrompt',
  input: {schema: AtsResumeOptimizationInputSchema},
  output: {schema: AtsResumeOptimizationOutputSchema},
  prompt: `You are an expert resume optimizer, specializing in tailoring resumes for Applicant Tracking Systems (ATS). Your goal is to provide actionable suggestions to improve the resume's compatibility and ranking within ATS systems, increasing the likelihood of the candidate being selected for an interview.

Analyze the provided resume in relation to the job description. Focus on identifying missing keywords, areas for improved formatting for ATS parsing, and sections that need enhancement to align with the job requirements.

Job Description: {{{jobDescription}}}

Resume: {{{resume}}}

Provide specific, clear, and concise suggestions for optimizing the resume. These suggestions should be directly applicable and easy to implement. Consider the following aspects:

  *   **Keyword Optimization:** Identify relevant keywords from the job description that are missing in the resume. Suggest where and how to incorporate these keywords naturally within the resume content.
  *   **Formatting Improvements:** Advise on formatting changes that can improve ATS parsing accuracy. This may include using standard section headings (e.g., "Summary," "Experience," "Education"), avoiding tables or images that can confuse ATS, and ensuring clear and consistent formatting throughout the document.
  *   **Content Enhancement:** Suggest specific improvements to the content of each section, such as quantifying achievements with metrics, highlighting relevant skills and experiences, and tailoring the summary to match the job requirements.
  *   **ATS Compatibility:** Ensure suggestions adhere to ATS best practices, such as using a simple and clean font, avoiding headers and footers, and saving the resume in a compatible file format (e.g., .docx or .pdf).

Output the suggested resume improvements as a string.
`,
});

const atsResumeOptimizationFlow = ai.defineFlow(
  {
    name: 'atsResumeOptimizationFlow',
    inputSchema: AtsResumeOptimizationInputSchema,
    outputSchema: AtsResumeOptimizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
