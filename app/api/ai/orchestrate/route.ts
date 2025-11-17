import { NextRequest, NextResponse } from 'next/server';
import { orchestrateAdCreation } from '../../../../services/adCreativeOrchestrator';
import type { AdCreativeRequest, ProductAnalysisResult, AdConcept } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      request: adRequest,
      productAnalysis,
      selectedConcept
    }: {
      request: AdCreativeRequest;
      productAnalysis: ProductAnalysisResult;
      selectedConcept: AdConcept;
    } = body;

    if (!adRequest || !productAnalysis || !selectedConcept) {
      return NextResponse.json(
        { error: 'Request, product analysis, and selected concept are required' },
        { status: 400 }
      );
    }

    // Call the orchestrator function (without onProgress callback for API route)
    const result = await orchestrateAdCreation(
      adRequest,
      productAnalysis,
      selectedConcept
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/ai/orchestrate:', error);
    return NextResponse.json(
      { error: 'Failed to orchestrate ad creation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

