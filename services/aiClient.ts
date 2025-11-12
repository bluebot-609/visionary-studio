/**
 * Client-side service for calling AI API routes
 * This replaces direct imports of AI agents to keep API keys server-side
 */

import type { AdConcept, ProductAnalysisResult, AdCreative, AdCreativeRequest, SeductiveCaptions } from '../types';

/**
 * Generate ad concepts via API route
 */
export const generateConceptsForSelection = async (
  request: AdCreativeRequest,
  onProgress?: (step: string, progress: number) => void
): Promise<{ productAnalysis: ProductAnalysisResult; concepts: AdConcept[] }> => {
  onProgress?.('Analyzing product...', 30);
  
  const response = await fetch('/api/ai/concepts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate concepts');
  }

  onProgress?.('Generating concepts...', 70);
  const data = await response.json();
  onProgress?.('Concepts generated', 100);
  
  return data;
};

/**
 * Orchestrate full ad creation via API route
 */
export const orchestrateAdCreation = async (
  request: AdCreativeRequest,
  productAnalysis: ProductAnalysisResult,
  selectedConcept: AdConcept,
  onProgress?: (step: string, progress: number) => void
): Promise<AdCreative> => {
  onProgress?.('Finalizing creative direction...', 25);
  
  const response = await fetch('/api/ai/orchestrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      request,
      productAnalysis,
      selectedConcept,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to orchestrate ad creation');
  }

  onProgress?.('Determining photography specifications...', 50);
  onProgress?.('Translating specs to artistic prompt...', 75);
  const data = await response.json();
  onProgress?.('Image generated', 100);
  
  return data;
};

/**
 * Generate captions for an image via API route
 */
export const generateCaptions = async (base64Image: string): Promise<SeductiveCaptions> => {
  const response = await fetch('/api/ai/captions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Image }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate captions');
  }

  const data = await response.json();
  return data.captions;
};

