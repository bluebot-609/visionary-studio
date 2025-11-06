import { GoogleGenAI } from "@google/genai";
import type { ProductAnalysisResult, CreativeDirectorDecision, PhotographerSpecification } from '../../types';
import { MASTER_PROMPT_TEMPLATE } from './prompts';

// This is the new agent that translates your technical specs into art.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// This "meta-prompt" instructs the LLM to be a "prompt poet"
const PROMPT_ARCHITECT_SYSTEM_PROMPT = `You are a world-class prompt artist and high-fashion photographer. Your task is to translate a highly technical, structured 'Shot Plan' into a single, evocative, and artistic paragraph for an image generation model.

**Rules:**

1.  Write a single, flowing descriptive paragraph. Do NOT use bullet points, lists, or technical labels (like 'Aperture:').

2.  Synthesize all the technical details from the shot plan into a rich, sensory description.

3.  Focus on **light, shadow, texture, and mood**. Use evocative language.

4.  Descriptively incorporate camera and lighting specs. For example:

    - Instead of 'f/1.8 aperture', say 'a razor-thin shallow depth of field, melting the background into a creamy, abstract bokeh.'

    - Instead of '85mm lens', say 'a tight, intimate close-up perspective.'

    - Instead of 'Dramatic Hard Light', say 'a single, dramatic shaft of sunlight cuts across the scene, casting long, deep shadows.'

5.  Weave in the 'Luxury Visual Intelligence' guidelines (like 'minimalist space', 'controlled gradients') as part of the overall aesthetic description.

6.  The output MUST be a single paragraph of text, ready to be fed directly into an image model.

**Technical Shot Plan (Input):**

`;

/**
 * Translates a technical spec sheet into an artistic, descriptive prompt.
 */
export const translateSpecsToArtisticPrompt = async (
  productAnalysis: ProductAnalysisResult,
  creativeDirection: CreativeDirectorDecision,
  photographerSpecs: PhotographerSpecification
): Promise<string> => {
  
  // 1. Get the technical spec sheet from your existing template
  const technicalPrompt = MASTER_PROMPT_TEMPLATE(productAnalysis, creativeDirection, photographerSpecs);

  // 2. Build the "meta-prompt" for the new agent
  const finalMetaPrompt = `${PROMPT_ARCHITECT_SYSTEM_PROMPT}

${technicalPrompt}

**Artistic Prompt (Your Output):**

`;

  // 3. Call the LLM to perform the translation
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash', // Use 'gemini-2.5-pro' for more creative nuance
    contents: finalMetaPrompt,
    config: {
      responseMimeType: "text/plain", // We just want the raw text paragraph
      temperature: 0.5,
    }
  });

  return response.text.trim();
};

