
import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/ai/flows/chat';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    
    // In a production app, you might want to stream the response.
    // For this example, we'll await the full response.
    const reply = await chat(prompt);

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('[Gemini API Error]', error);

    // Provide a generic error response
    return NextResponse.json(
      { error: 'An unexpected error occurred.', details: error.message },
      { status: 500 }
    );
  }
}
