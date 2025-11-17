import { NextRequest, NextResponse } from 'next/server';
import { generateCaptions } from '../../../../services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { base64Image } = body;

    if (!base64Image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Call the gemini service server-side
    const captions = await generateCaptions(base64Image);

    return NextResponse.json({ captions });
  } catch (error) {
    console.error('Error in /api/ai/captions:', error);
    return NextResponse.json(
      { error: 'Failed to generate captions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

