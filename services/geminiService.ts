import { GoogleGenAI, Modality, Part, Type } from "@google/genai";
import type { ImageData, GeneratedContent, CreativeConcept, ShotType } from "../types";

export const generateCreativeConcepts = async (
  productImage: ImageData,
  theme?: string,
  userPrompt?: string,
  isProMode: boolean = false,
  autoGenerateText: boolean = false,
  shotType: ShotType = "product"
): Promise<CreativeConcept[]> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = "gemini-2.5-flash";

  let prompt = `You are a professional product photographer and creative director. You have been given an image of a product. Your task is to brainstorm THREE distinct and compelling photoshoot concepts for this product. The concepts should be creative, visually interesting, and suitable for high-quality commercial use.`;

  if (shotType === "model") {
    prompt += `\n\nCONSTRAINT: These concepts MUST feature the product on a model (person). Ensure the scene descriptions involve a model interacting with the product.`;
  } else {
    prompt += `\n\nCONSTRAINT: These concepts MUST be product hero shots. The product should be the sole focus. Do NOT include models or people in the scene descriptions.`;
  }

  if (theme) {
    prompt += `\n\nThe overall theme for these concepts must be: **${theme}**. Ensure all three concepts strongly align with the "${theme}" aesthetic.`;
  }

  if (userPrompt) {
    prompt += `\n\nAdditionally, the user has provided the following creative direction that you must incorporate into your concepts: "${userPrompt}".`;
  }

  if (isProMode && autoGenerateText) {
    prompt += `\n\nSince we are using an advanced generation model and the user requested text, please suggest a "Text Overlay" for each concept. This could be a catchy slogan, the product name, or a sale message that would look good on the image.`;
  }

  prompt += `

For each concept, provide:
1.  A short, catchy title.
2.  A detailed description of the scene, including props, background, and overall aesthetic.
3.  A description of the lighting (e.g., 'dramatic high-contrast lighting', 'soft, ethereal backlighting').
4.  A description of the product's arrangement and placement in the scene.
5.  A description of the overall mood.
${isProMode && autoGenerateText ? "6.  A suggestion for text overlay (content, font style, and placement)." : ""}
`;

  const schemaProperties: any = {
    title: { type: Type.STRING },
    scene_description: { type: Type.STRING },
    lighting: { type: Type.STRING },
    product_arrangement: { type: Type.STRING },
    mood: { type: Type.STRING },
  };

  if (isProMode && autoGenerateText) {
    schemaProperties.text_overlay_suggestion = {
      type: Type.OBJECT,
      properties: {
        text_content: { type: Type.STRING },
        font_style: { type: Type.STRING },
        placement: { type: Type.STRING },
      },
      required: ["text_content", "font_style", "placement"],
    };
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: productImage.mimeType, data: productImage.data } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: schemaProperties,
            required: [
              "title",
              "scene_description",
              "lighting",
              "product_arrangement",
              "mood",
              ...(isProMode && autoGenerateText ? ["text_overlay_suggestion"] : []),
            ],
          },
        },
      },
    });

    const concepts = JSON.parse(response.text || "");
    if (!concepts || !Array.isArray(concepts) || concepts.length === 0) {
      throw new Error("The AI failed to generate creative concepts. Please try again.");
    }
    return concepts;
  } catch (error: any) {
    console.error("Error calling Gemini API for creative concepts:", error);
    throw new Error(`Failed to brainstorm creative concepts. ${error.message}`);
  }
};

export const generatePhotoshootImage = async (
  productImage: ImageData,
  referenceImage: ImageData | null,
  prompt: string,
  modelAppearance?: string,
  aspectRatio: string = "1:1",
  isProMode: boolean = false,
  resolution: string = "1K",
  textOverlay?: string,
  autoGenerateText: boolean = false,
  shotType: ShotType = "product"
): Promise<GeneratedContent> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const modelName = isProMode ? "gemini-3-pro-image-preview" : "gemini-2.5-flash-image";

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
      },
    });
  }

  let finalPrompt: string;
  let shotInstruction = "";

  if (shotType === "model") {
    shotInstruction =
      "Feature the product on a professional model. The model should interact with the product naturally (wearing it if it is clothing/accessory, holding it otherwise).";
    if (modelAppearance) {
      shotInstruction += ` The model should match this description: "${modelAppearance}".`;
    }
  } else {
    shotInstruction =
      "Create a product hero shot. The product should be the sole focus of the image. Do NOT include any people or models in the scene. The image must focus exclusively on the product.";
  }

  if (referenceImage) {
    finalPrompt =
      "You are an expert AI product photographer. Your task is to generate a realistic and professional photoshoot image.";
    finalPrompt +=
      " The first image contains the product to be featured. The second image is a reference for style, composition, product placement, lighting, and mood.";
    finalPrompt +=
      " Your goal is to recreate the scene from the reference image, but replace its main subject with the product from the first image.";
    finalPrompt +=
      " If the reference image contains a person, but the instruction is for a product hero shot, IGNORE the person and generate a product-only scene.";

    if (shotType === "model") {
      finalPrompt +=
        " If the reference image contains a person, you MUST NOT copy their face or exact appearance. Instead, generate a new, unique model that fits the overall style and theme.";
    }

    finalPrompt += ` ${shotInstruction}`;

    if (prompt) {
      finalPrompt += ` Follow this additional creative direction: "${prompt}".`;
    }
  } else {
    finalPrompt =
      "You are an expert AI product photographer. Your task is to generate a realistic and professional photoshoot image.";
    finalPrompt += ` The subject of the photoshoot is the product from the image provided. ${shotInstruction}`;
    finalPrompt += ` The creative direction for the scene, lighting, arrangement, and mood is as follows: "${prompt}".`;
  }

  if (isProMode) {
    if (textOverlay && textOverlay.trim().length > 0) {
      finalPrompt += ` \n\nIMPORTANT: Add a text overlay to the image. The text MUST read: "${textOverlay}". Ensure the font style, color, and placement are professional, legible, and aesthetically consistent with the scene's mood.`;
    } else if (autoGenerateText) {
      finalPrompt +=
        " \n\nIMPORTANT: Create a creative and catchy text overlay suitable for an advertisement of this product. Choose a font and placement that enhances the composition.";
    } else {
      finalPrompt += " \n\nEnsure there is NO text overlay on the image.";
    }
  }

  finalPrompt += " Please generate the final image now.";

  imageGenerationParts.push({ text: finalPrompt });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: imageGenerationParts },
      config: {
        responseModalities: [Modality.IMAGE],
        imageConfig: {
          aspectRatio,
          // imageSize is only supported by gemini-3-pro-image-preview
          imageSize: isProMode ? resolution : undefined,
        } as any,
      },
    });

    if (response.promptFeedback?.blockReason) {
      let reason = `Request to ${modelName} was blocked. Reason: ${response.promptFeedback.blockReason}.`;
      if (response.promptFeedback.safetyRatings) {
        reason += ` Safety ratings: ${JSON.stringify(response.promptFeedback.safetyRatings)}`;
      }
      throw new Error(reason);
    }

    const imagePart = response.candidates?.[0]?.content?.parts?.find((part) => part.inlineData);
    const imageUrl = imagePart?.inlineData ? `data:image/png;base64,${imagePart.inlineData.data}` : null;

    if (!imageUrl) {
      const textPart = response.candidates?.[0]?.content?.parts?.find((p) => p.text);
      throw new Error(`Generation failed. ${textPart ? textPart.text : "No image returned."}`);
    }

    return {
      imageUrl,
      usedModel: isProMode ? "Nano Banana Pro" : "Nano Banana",
    };
  } catch (error: any) {
    console.error(`${modelName} generation failed:`, error);
    throw error;
  }
};


