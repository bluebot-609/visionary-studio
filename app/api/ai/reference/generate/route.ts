import { NextRequest, NextResponse } from 'next/server';
import { generateFromReferenceImage } from '../../../../../services/referenceImageOrchestrator';
import type { UploadedFile, ReferenceStyleAnalysis, ReferenceImageRefinements } from '../../../../../types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      productImage: UploadedFile;
      referenceImage: UploadedFile;
      styleAnalysis: ReferenceStyleAnalysis;
      refinements?: ReferenceImageRefinements;
      aspectRatio?: '1:1' | '3:4' | '9:16' | '16:9';
    };

    if (!body.productImage || !body.referenceImage || !body.styleAnalysis) {
      return NextResponse.json(
        { error: 'Product image, reference image, and style analysis are required' },
        { status: 400 }
      );
    }

    const result = await generateFromReferenceImage(
      body.productImage,
      body.referenceImage,
      body.styleAnalysis,
      body.refinements || { faceReplacement: true },
      body.aspectRatio || '1:1'
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/ai/reference/generate:', error);
    return NextResponse.json(
      { error: 'Failed to generate from reference', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

