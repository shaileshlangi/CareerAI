
'use server';

/**
 * @fileOverview A simple Genkit flow for handling chat interactions.
 * - chat - A function that takes a string prompt and returns an AI-generated response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the flow for chat operations
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt) => {

    // If no API key is available, return a mock response.
    // This allows the UI to be tested without a valid API key.
    if (!process.env.GEMINI_API_KEY) {
      console.log('No GEMINI_API_KEY found, returning mock response.');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      return `This is a mock response because the Gemini API key is not configured. You asked: "${prompt}"`;
    }

    const llm = ai.getModel('googleai/gemini-2.5-flash');

    const response = await ai.generate({
      prompt: prompt,
      model: llm,
      config: {
        // Optional: Adjust safety settings if needed
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_ONLY_HIGH',
          },
        ],
      },
    });

    return response.text;
  }
);


// Export a simple async function that runs the flow
export async function chat(prompt: string): Promise<string> {
  return chatFlow(prompt);
}
