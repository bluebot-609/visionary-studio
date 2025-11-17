import { NextRequest, NextResponse } from 'next/server';
import { analyzeProductForPresets } from '../../../../services/adCreativeOrchestrator';
import type { UploadedFile } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      imageFile?: UploadedFile;
      textDescription?: string;
    };

    if (!body.imageFile && !body.textDescription) {
      return NextResponse.json(
        { error: 'Either image file or text description is required' },
        { status: 400 }
      );
    }

    // Call the orchestrator function for product analysis
    const result = await analyzeProductForPresets(
      body.imageFile,
      body.textDescription
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/ai/analyze:', error);
    return NextResponse.json(
      { error: 'Failed to analyze product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

