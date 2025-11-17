import { NextRequest, NextResponse } from 'next/server';
import { analyzeReferenceStyle } from '../../../../../services/referenceImageOrchestrator';
import type { UploadedFile } from '../../../../../types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      referenceImage: UploadedFile;
      userNotes?: string;
    };

    if (!body.referenceImage) {
      return NextResponse.json(
        { error: 'Reference image is required' },
        { status: 400 }
      );
    }

    const result = await analyzeReferenceStyle(
      body.referenceImage,
      body.userNotes
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/ai/reference/analyze:', error);
    return NextResponse.json(
      { error: 'Failed to analyze reference image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


