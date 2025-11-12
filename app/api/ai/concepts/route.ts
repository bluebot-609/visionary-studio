import { NextRequest, NextResponse } from 'next/server';
import { generateConceptsForSelection } from '../../../../services/adCreativeOrchestrator';
import type { AdCreativeRequest } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as AdCreativeRequest;

    if (!body.imageFile && !body.textDescription) {
      return NextResponse.json(
        { error: 'Either image file or text description is required' },
        { status: 400 }
      );
    }

    // Call the orchestrator function (without onProgress callback for API route)
    const result = await generateConceptsForSelection(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/ai/concepts:', error);
    return NextResponse.json(
      { error: 'Failed to generate concepts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

