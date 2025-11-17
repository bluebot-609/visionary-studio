import { GoogleGenAI, Type, Modality, Part } from "@google/genai";
import type { UploadedFile, ImageData, CreativeConcept, GeneratedContent } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// --- Reference Project Functions ---

/**
 * Generate creative concepts for a product image
 * Uses the exact prompt template from the reference project
 */
export const generateCreativeConcepts = async (
  productImage: ImageData,
  theme?: string,
  prompt?: string
): Promise<CreativeConcept[]> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set");
  }

  let conceptPrompt = `You are a professional product photographer and creative director. You have been given an image of a product. Your task is to brainstorm THREE distinct and compelling photoshoot concepts for this product. The concepts should be creative, visually interesting, and suitable for high-quality commercial use.`;

  if (theme) {
    conceptPrompt += `\n\nThe overall theme for these concepts must be: **${theme}**. Ensure all three concepts strongly align with the "${theme}" aesthetic.`;
  }

  if (prompt) {
    conceptPrompt += `\n\nThe user has provided the following creative direction to guide your concept generation: "${prompt}". Use this as inspiration and incorporate these ideas into the three concepts you create.`;
  }

  conceptPrompt += `\n\nFor each concept, provide:
1.  A short, catchy title.
2.  A detailed description of the scene, including props, background, and overall aesthetic.
3.  A description of the lighting (e.g., 'dramatic high-contrast lighting', 'soft, ethereal backlighting').
4.  A description of the product's arrangement and placement in the scene (e.g., 'centered and heroic', 'part of a larger flat-lay composition').
5.  A description of the overall mood (e.g., 'mysterious and moody', 'energetic and vibrant').`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: {
        parts: [
          { inlineData: { mimeType: productImage.mimeType, data: productImage.data } },
          { text: conceptPrompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              scene_description: { type: Type.STRING },
              lighting: { type: Type.STRING },
              product_arrangement: { type: Type.STRING },
              mood: { type: Type.STRING },
            },
            required: ["title", "scene_description", "lighting", "product_arrangement", "mood"]
          }
        }
      }
    });

    const jsonText = response.text?.trim() || '';
    if (!jsonText) {
      throw new Error("Empty response from AI");
    }
    const concepts = JSON.parse(jsonText);
    if (!concepts || !Array.isArray(concepts) || concepts.length === 0) {
      throw new Error("The AI failed to generate creative concepts. Please try again.");
    }
    return concepts;
  } catch (error: any) {
    console.error("Error calling Gemini API for creative concepts:", error);
    throw new Error(`Failed to brainstorm creative concepts. ${error.message}`);
  }
};

/**
 * Generate photoshoot image from product image with optional reference
 * Uses the exact prompt template from the reference project
 */
export const generatePhotoshootImage = async (
  productImage: ImageData,
  referenceImage: ImageData | null,
  prompt: string,
  modelAppearance?: string,
  aspectRatio: '1:1' | '9:16' | '4:3' | '3:4' | '16:9' = '1:1'
): Promise<GeneratedContent> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set");
  }

  // --- Call 1: Generate Image ---
  const imageGenerationParts: Part[] = [];

  imageGenerationParts.push({
    inlineData: {
      mimeType: productImage.mimeType,
      data: productImage.data,
    },
  });

  if (referenceImage) {
    imageGenerationParts.push({
      inlineData: {
        mimeType: referenceImage.mimeType,
        data: referenceImage.data,
      }
    });
  }

  let finalPrompt: string;
  const modelInstruction = `If the product in the first image is an item of clothing, accessory, or other wearable, feature it on a model. Otherwise, stage the product as the central focus of the scene.`;

  if (referenceImage) {
    // Reference image flow: use reference image for style guidance
    finalPrompt = 'You are an expert AI product photographer. Your task is to generate a realistic and professional photoshoot image.';
    finalPrompt += ' The first image contains the product to be featured. The second image is a reference for style, composition, product placement, lighting, and mood.';
    finalPrompt += ' Your goal is to recreate the scene from the reference image, but replace its main subject with the product from the first image.';
    finalPrompt += ' If the reference image contains a person, you MUST NOT copy their face or exact appearance. Instead, generate a new, unique model that fits the overall style and theme.';

    if (modelAppearance) {
      finalPrompt += ` The new model should match this description: "${modelAppearance}".`;
    }

    // This instruction is still useful to tell the AI when to use a model,
    // especially if the product is wearable but the reference is an abstract scene.
    finalPrompt += ` ${modelInstruction}`;

    if (prompt) {
      finalPrompt += ` Follow this additional creative direction: "${prompt}".`;
    }
  } else {
    // No reference image: use the detailed concept prompt
    finalPrompt = 'You are an expert AI product photographer. Your task is to generate a realistic and professional photoshoot image.';
    finalPrompt += ` The subject of the photoshoot is the product from the image provided. ${modelInstruction}`;
    finalPrompt += ` The creative direction for the scene, lighting, arrangement, and mood is as follows: "${prompt}".`;
  }

  finalPrompt += ` Please generate the final image now.`;
  imageGenerationParts.push({ text: finalPrompt });

  let generatedImageData: string;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: imageGenerationParts },
      config: {
        responseModalities: [Modality.IMAGE],
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    if (response.promptFeedback?.blockReason) {
      let reason = `Request was blocked. Reason: ${response.promptFeedback.blockReason}.`;
      if (response.promptFeedback.safetyRatings) {
        reason += ` Safety ratings: ${JSON.stringify(response.promptFeedback.safetyRatings)}`;
      }
      throw new Error(reason);
    }

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePart?.inlineData?.data) {
      generatedImageData = imagePart.inlineData.data;
    } else {
      console.error("Full API response for image generation:", JSON.stringify(response, null, 2));

      const finishReason = response.candidates?.[0]?.finishReason;
      let errorMessage = "Image generation failed. The model did not return an image.";

      if (finishReason === "OTHER") {
        errorMessage += " This can happen if the request is out of the model's capabilities or the prompt is ambiguous. Try rephrasing your description or using different images.";
      } else if (finishReason === "SAFETY") {
        errorMessage += " The request was blocked by safety filters. Please adjust your prompt or images.";
      } else if (finishReason) {
        errorMessage += ` Reason: ${finishReason}.`;
      }

      const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
      if (textPart?.text) {
        errorMessage += ` The model responded with text: "${textPart.text}"`;
      }

      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error("Error calling Gemini API for image generation:", error);
    throw new Error(`Failed to generate image. ${error.message}`);
  }

  // Return image without description (removed as per requirements)
  return {
    image: generatedImageData,
    description: '', // No description needed
  };
};