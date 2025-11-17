import { analyzeProduct } from './agents/productAnalysisAgent';
import { generateConcepts, getCreativeDirection } from './agents/creativeDirectorAgent';
import { getPhotographerSpecs } from './agents/photographerAgent';
import { translateSpecsToArtisticPrompt } from './agents/promptArchitectAgent';
import { generateImages } from './geminiService';
import type { AdCreativeRequest, AgentOrchestrationResult, AdCreative, AdConcept, ProductAnalysisResult, UploadedFile } from '../types';

// Map aspect ratio to supported formats
const mapAspectRatio = (aspectRatio: string): "1:1" | "3:4" | "4:3" | "9:16" | "16:9" => {
  const ratioMap: Record<string, "1:1" | "3:4" | "4:3" | "9:16" | "16:9"> = {
    '1:1': '1:1',
    '4:5': '4:3', // Map 4:5 to closest supported (4:3)
    '3:4': '3:4',
    '4:3': '4:3',
    '9:16': '9:16',
    '16:9': '16:9',
  };
  return ratioMap[aspectRatio] || '1:1'; // Default to 1:1 if not found
};

// Analyze product and get preset recommendations (called early in the flow)
export const analyzeProductForPresets = async (
  imageFile?: UploadedFile,
  textDescription?: string,
  onProgress?: (step: string, progress: number) => void
): Promise<{ productAnalysis: ProductAnalysisResult; recommendedPresets: string[] }> => {
  onProgress?.('Analyzing product...', 100);
  const productAnalysis = await analyzeProduct(imageFile, textDescription);
  
  return {
    productAnalysis,
    recommendedPresets: productAnalysis.recommendedPresets || []
  };
};

// Phase 1: Generate concepts for user selection
export const generateConceptsForSelection = async (
  request: AdCreativeRequest,
  existingProductAnalysis?: ProductAnalysisResult,
  onProgress?: (step: string, progress: number) => void
): Promise<{ productAnalysis: ProductAnalysisResult; concepts: AdConcept[]; recommendedPresets: string[] }> => {
  // Use existing analysis if provided, otherwise analyze
  const productAnalysis = existingProductAnalysis || await analyzeProduct(request.imageFile, request.textDescription);
  
  if (!existingProductAnalysis) {
    onProgress?.('Analyzing product...', 50);
  }
  
  onProgress?.('Generating concepts...', 100);
  const concepts = await generateConcepts(
    productAnalysis,
    request.platformPreference
  );

  return { 
    productAnalysis, 
    concepts, 
    recommendedPresets: productAnalysis.recommendedPresets || [] 
  };
};

// Phase 2: Generate final ad creative with selected concept
export const orchestrateAdCreation = async (
  request: AdCreativeRequest,
  productAnalysis: ProductAnalysisResult,
  selectedConcept: AdConcept,
  onProgress?: (step: string, progress: number) => void
): Promise<AdCreative> => {
  const totalSteps = 4; // <-- INCREASED STEPS FROM 3 to 4
  let currentStep = 0;

  // Step 1: Creative Direction (with selected concept)
  onProgress?.('Finalizing creative direction...', (++currentStep / totalSteps) * 100);
  const creativeDirection = await getCreativeDirection(
    productAnalysis,
    selectedConcept,
    request.platformPreference,
    request.selectedPreset
  );

  // Step 2: Photographer Specifications
  onProgress?.('Determining photography specifications...', (++currentStep / totalSteps) * 100);
  const photographerSpecs = await getPhotographerSpecs(productAnalysis, creativeDirection);

  // --- STEP 3: NEW! TRANSLATE SPECS TO ARTISTIC PROMPT ---
  onProgress?.('Translating specs to artistic prompt...', (++currentStep / totalSteps) * 100);
  const artisticPrompt = await translateSpecsToArtisticPrompt(
    productAnalysis,
    creativeDirection,
    photographerSpecs
  );
  
  // This step used to be Step 3, now it's Step 4
  onProgress?.('Generating image...', (++currentStep / totalSteps) * 100);
  // If caller provided an explicit aspect ratio, prefer it over AI decision
  const chosenAspectRatio = request.aspectRatio || creativeDirection.aspectRatio;
  const mappedAspectRatio = mapAspectRatio(chosenAspectRatio);
  
  // --- PASS THE NEW ARTISTIC PROMPT TO THE IMAGE MODEL ---
  const { images, prompt } = await generateImages(
    artisticPrompt, // <-- USE THE NEW ARTISTIC PROMPT
    mappedAspectRatio,
    request.imageFile
  );

  const agentDecisions: AgentOrchestrationResult = {
    productAnalysis,
    creativeDirection,
    photographerSpecs,
    masterPrompt: artisticPrompt // <-- Store the new prompt for debugging
  };

  return {
    id: `ad-creative-${Date.now()}`,
    base64: images[0],
    prompt: artisticPrompt, // <-- Store the new prompt
    agentDecisions
  };
};

// This function is no longer needed here as it's handled by the new agent
/*
export const generateMasterPrompt = (
  productAnalysis: any,
  creativeDirection: any,
  photographerSpecs: any
): string => {
  return MASTER_PROMPT_TEMPLATE(productAnalysis, creativeDirection, photographerSpecs);
};
*/

