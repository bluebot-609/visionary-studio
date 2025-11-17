import { extractReferenceStyle } from './agents/referenceStyleExtractorAgent';
import { generateFromReference } from './geminiService';
import type { UploadedFile, ReferenceStyleAnalysis, ReferenceImageRefinements, AdCreative } from '../types';

/**
 * Analyzes reference image and extracts style elements
 */
export const analyzeReferenceStyle = async (
  referenceImage: UploadedFile,
  userNotes?: string,
  onProgress?: (step: string, progress: number) => void
): Promise<ReferenceStyleAnalysis> => {
  onProgress?.('Analyzing reference image...', 100);
  return await extractReferenceStyle(referenceImage, userNotes);
};

/**
 * Generates product photo from reference image with style transfer
 */
export const generateFromReferenceImage = async (
  productImage: UploadedFile,
  referenceImage: UploadedFile,
  styleAnalysis: ReferenceStyleAnalysis,
  refinements: ReferenceImageRefinements,
  aspectRatio: '1:1' | '3:4' | '9:16' | '16:9',
  onProgress?: (step: string, progress: number) => void
): Promise<AdCreative> => {
  onProgress?.('Generating image with style transfer...', 50);
  
  const { images, prompt } = await generateFromReference(
    productImage,
    referenceImage,
    styleAnalysis,
    refinements,
    aspectRatio
  );

  onProgress?.('Image generated', 100);

  if (!images || images.length === 0 || !images[0]) {
    throw new Error('No image was generated from reference');
  }

  return {
    id: `reference-creative-${Date.now()}`,
    base64: images[0],
    prompt: prompt,
    referenceStyleAnalysis: styleAnalysis
  };
};

