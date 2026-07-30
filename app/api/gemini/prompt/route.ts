import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 400 });
    }

    const { deckId, deckName } = await req.json();

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are generating a single, deeply thought-provoking, 1-sentence prompt for a 2-minute daily vocal practice app called Echo.
The user is in the room: "${deckName || deckId}".
The prompt must follow these guidelines:
- Exactly 1 short, poetic, or insightful question or statement.
- No introductory text, quotes formatting surrounding it, explanations, or meta commentary.
- Pure question string (e.g., "What belief have you changed your mind about?" or "Describe a boundary lesson you had to learn the hard way.").
- Tone: Calm, reflective, minimalist, non-judgmental.`,
    });

    const text = response.text?.trim().replace(/^["']|["']$/g, '') || '';
    return NextResponse.json({ prompt: text });
  } catch (error: any) {
    console.error('Gemini API Prompt Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate prompt' },
      { status: 500 }
    );
  }
}
