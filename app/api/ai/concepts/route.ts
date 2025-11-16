import { NextRequest, NextResponse } from 'next/server';
import { generateConceptsForSelection } from '../../../../services/adCreativeOrchestrator';
import type { AdCreativeRequest, ProductAnalysisResult } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as AdCreativeRequest & {
      existingProductAnalysis?: ProductAnalysisResult;
    };

    if (!body.imageFile && !body.textDescription) {
      return NextResponse.json(
        { error: 'Either image file or text description is required' },
        { status: 400 }
      );
    }

    // Call the orchestrator function (without onProgress callback for API route)
    // Pass existing product analysis if provided to avoid re-analyzing
    const result = await generateConceptsForSelection(
      body,
      body.existingProductAnalysis
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/ai/concepts:', error);
    return NextResponse.json(
      { error: 'Failed to generate concepts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

