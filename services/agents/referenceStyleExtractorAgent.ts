import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { UploadedFile, ReferenceStyleAnalysis } from '../../types';
import { REFERENCE_STYLE_EXTRACTION_PROMPT } from './prompts';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const fileToGenerativePart = (file: UploadedFile) => {
  return {
    inlineData: {
      data: file.base64,
      mimeType: file.type
    },
  };
};

/**
 * Analyzes a reference image and extracts style, pose, composition, and aesthetic elements
 */
export const extractReferenceStyle = async (
  referenceImage: UploadedFile,
  userNotes?: string
): Promise<ReferenceStyleAnalysis> => {
  const imagePart = fileToGenerativePart(referenceImage);
  
  const prompt = `${REFERENCE_STYLE_EXTRACTION_PROMPT}

${userNotes ? `User Notes: ${userNotes}` : ''}

Analyze the reference image and extract the style elements. Return your analysis in JSON format.`;

  const contents = {
    parts: [
      imagePart,
      { text: prompt }
    ]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          style: { type: Type.STRING },
          pose: { type: Type.STRING },
          composition: { type: Type.STRING },
          background: { type: Type.STRING },
          lighting: { type: Type.STRING },
          aesthetic: { type: Type.STRING },
          colorPalette: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          }
        },
        required: ['style', 'pose', 'composition', 'background', 'lighting', 'aesthetic']
      }
    }
  });

  try {
    const jsonText = response.text?.trim() || '';
    if (!jsonText) {
      throw new Error("Empty response from Reference Style Extractor");
    }
    const result = JSON.parse(jsonText);
    return result as ReferenceStyleAnalysis;
  } catch (e) {
    console.error("Failed to parse reference style analysis JSON:", e);
    throw new Error("Failed to extract reference style");
  }
};


