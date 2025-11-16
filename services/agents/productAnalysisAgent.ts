import { GoogleGenAI, Type } from "@google/genai";
import type { ProductAnalysisResult, UploadedFile } from '../../types';
import { PRODUCT_ANALYSIS_PROMPT } from './prompts';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const fileToGenerativePart = (file: UploadedFile) => {
  return {
    inlineData: {
      data: file.base64,
      mimeType: file.type
    },
  };
};

export const analyzeProduct = async (
  imageFile?: UploadedFile,
  textDescription?: string
): Promise<ProductAnalysisResult> => {
  // Build a context-aware prompt that treats both inputs as equally valuable
  let prompt = PRODUCT_ANALYSIS_PROMPT;
  
  if (textDescription && imageFile) {
    // Both provided - create integrated analysis prompt
    prompt += `\n\n=== COMPREHENSIVE ANALYSIS ===
You have been provided with both a text description and an image. Analyze both sources thoroughly and synthesize them intelligently.

Text Description:
"${textDescription}"

Analysis Strategy:
- Extract all explicit information from the text: product details, messaging, emotional context, target audience, selling points, creative intent
- Analyze the image for visual details: appearance, colors, textures, composition, style, aesthetic qualities
- Synthesize both: combine text messaging with image visual reality to create a complete product understanding
- Use context to determine which source provides better information for each aspect
- Look for complementary information: text provides intent, image provides visual reality - combine them
- If there are discrepancies, synthesize intelligently rather than prioritizing one over the other

Create a rich, integrated analysis that leverages the unique strengths of both the text description and the image.`;
  } else if (textDescription) {
    // Text only
    prompt += `\n\n=== TEXT DESCRIPTION ANALYSIS ===
Analyze the following text description thoroughly:

"${textDescription}"

Extract all product information including:
- Product details, features, and attributes
- Target audience and messaging
- Emotional tone, mood, and aesthetic
- Key selling points and value propositions
- Brand positioning and creative intent
- Use cases and contexts
- Any specific visual or creative requirements`;
  } else if (imageFile) {
    // Image only
    prompt += `\n\n=== IMAGE ANALYSIS ===
Analyze the provided image to extract comprehensive product information including:
- Visual appearance, colors, textures, materials
- Product category and type
- Aesthetic qualities and style
- Composition and presentation
- Context and environment
- Target audience indicators
- Visual selling points`;
  }
  
  prompt += `\n\nProvide a comprehensive, detailed analysis in JSON format that captures all meaningful insights from the provided source(s).`;

  // When both are provided, use standard order (image first, then text prompt)
  // This allows the model to see the image context first, then process the text in that context
  const contents = imageFile && textDescription
    ? { parts: [fileToGenerativePart(imageFile), { text: prompt }] }
    : imageFile
    ? { parts: [fileToGenerativePart(imageFile), { text: prompt }] }
    : prompt;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productCategory: { type: Type.STRING },
          productAttributes: {
            type: Type.OBJECT,
            properties: {
              size: { type: Type.STRING },
              color: { type: Type.STRING },
              material: { type: Type.STRING },
              features: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          targetAudience: { type: Type.STRING },
          keySellingPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          productType: { type: Type.STRING },
          recommendedMood: { type: Type.STRING },
          recommendedAesthetic: { type: Type.STRING },
          brandTier: { type: Type.STRING },
          luxuryIndicators: { type: Type.ARRAY, items: { type: Type.STRING } },
          visualIdentity: { type: Type.STRING },
          recommendedPresets: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['productCategory', 'productAttributes', 'targetAudience', 'keySellingPoints', 'productType']
      }
    }
  });

  try {
    const jsonText = response.text?.trim() || '';
    if (!jsonText) {
      throw new Error("Empty response from Product Analysis Agent");
    }
    const result = JSON.parse(jsonText);
    return result as ProductAnalysisResult;
  } catch (e) {
    console.error("Failed to parse product analysis JSON:", e);
    throw new Error("Failed to analyze product");
  }
};


