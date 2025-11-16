/**
 * Client-side service for calling AI API routes
 * This replaces direct imports of AI agents to keep API keys server-side
 */

import type { AdConcept, ProductAnalysisResult, AdCreative, AdCreativeRequest, SeductiveCaptions, UploadedFile } from '../types';

/**
 * Analyze product and get preset recommendations via API route
 */
export const analyzeProductForPresets = async (
  imageFile?: UploadedFile,
  textDescription?: string,
  onProgress?: (step: string, progress: number) => void
): Promise<{ productAnalysis: ProductAnalysisResult; recommendedPresets: string[] }> => {
  onProgress?.('Analyzing product...', 50);
  
  const response = await fetch('/api/ai/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageFile,
      textDescription,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to analyze product');
  }

  onProgress?.('Analysis complete', 100);
  const data = await response.json();
  
  return {
    productAnalysis: data.productAnalysis,
    recommendedPresets: data.recommendedPresets || []
  };
};

/**
 * Generate ad concepts via API route
 */
export const generateConceptsForSelection = async (
  request: AdCreativeRequest,
  existingProductAnalysis?: ProductAnalysisResult,
  onProgress?: (step: string, progress: number) => void
): Promise<{ productAnalysis: ProductAnalysisResult; concepts: AdConcept[]; recommendedPresets: string[] }> => {
  if (!existingProductAnalysis) {
    onProgress?.('Analyzing product...', 30);
  } else {
    onProgress?.('Generating concepts...', 30);
  }
  
  const response = await fetch('/api/ai/concepts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...request,
      existingProductAnalysis,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate concepts');
  }

  onProgress?.('Generating concepts...', 70);
  const data = await response.json();
  onProgress?.('Concepts generated', 100);
  
  // Extract recommendedPresets from productAnalysis
  return {
    ...data,
    recommendedPresets: data.productAnalysis?.recommendedPresets || []
  };
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

