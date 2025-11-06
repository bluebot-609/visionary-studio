import { GoogleGenAI, Type } from "@google/genai";
import type { ProductAnalysisResult, CreativeDirectorDecision, PhotographerSpecification, CameraSettings, LightingSettings, CompositionSettings, BackgroundSettings, AestheticSettings, Light } from '../../types';
import { PHOTOGRAPHER_PROMPT } from './prompts';
import { evaluateLuxuryAlignment, getVisualIdentity } from './luxuryVisualIntelligence';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPhotographerSpecs = async (
  productAnalysis: ProductAnalysisResult,
  creativeDirection: CreativeDirectorDecision
): Promise<PhotographerSpecification> => {
  const isLuxury = evaluateLuxuryAlignment(productAnalysis);
  
  const prompt = `${PHOTOGRAPHER_PROMPT}

${isLuxury ? `
=== LUXURY CONSIDERATIONS ===
This product aligns with luxury/premium positioning. Apply luxury-specific technical considerations:
- Lighting: soft directional light, visible gradients, avoid harsh contrast unless it serves mood
- Color: monotone or tri-tone palettes, muted or controlled bolds
- Texture: emphasize tactility (velvet, satin, brushed metal, leather)
- Background: architectural backdrops, minimal, never cluttered
- Composition: symmetry or intentional asymmetry, negative space equals luxury
- Space discipline: whitespace-driven composition
- Visual Identity: ${getVisualIdentity(productAnalysis)}
${creativeDirection.luxuryVisualGuidelines ? `
LVI Guidelines:
- Lighting Type: ${creativeDirection.luxuryVisualGuidelines.lightingType}
- Composition Depth: ${creativeDirection.luxuryVisualGuidelines.compositionDepth}
- Texture Priority: ${creativeDirection.luxuryVisualGuidelines.texturePriority}
- Color Emotion: ${creativeDirection.luxuryVisualGuidelines.colorEmotion}
- Space Use: ${creativeDirection.luxuryVisualGuidelines.spaceUse}
` : ''}
` : ''}

Product Analysis:
- Category: ${productAnalysis.productCategory}
- Type: ${productAnalysis.productType}
- Attributes: ${JSON.stringify(productAnalysis.productAttributes)}
- Key Selling Points: ${productAnalysis.keySellingPoints.join(', ')}
- Brand Tier: ${productAnalysis.brandTier || 'undetermined'}

Creative Direction:
- Ad Type: ${creativeDirection.adType}
- Location: ${creativeDirection.location}
- Presentation Style: ${creativeDirection.presentationStyle}
- Mood: ${creativeDirection.mood}
- Model Required: ${creativeDirection.modelRequired}
${creativeDirection.modelType ? `- Model Type: ${creativeDirection.modelType}` : ''}
${creativeDirection.poseGuidance ? `- Pose Guidance: ${creativeDirection.poseGuidance}` : ''}
${creativeDirection.colorPalette ? `- Color Palette: ${creativeDirection.colorPalette.join(', ')}` : ''}

Determine the optimal technical photography specifications and provide them in JSON format.
${isLuxury ? 'Include luxuryConsiderations object with applyLuxuryLogic, visualIdentity, and spaceDiscipline when luxury is detected.' : ''}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          camera: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              model: { type: Type.STRING },
              lens: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  focal_length_mm: { type: Type.NUMBER },
                  aperture: { type: Type.STRING }
                },
                required: ['type', 'focal_length_mm', 'aperture']
              },
              exposure: {
                type: Type.OBJECT,
                properties: {
                  shutter_speed: { type: Type.STRING },
                  iso: { type: Type.NUMBER },
                  white_balance: { type: Type.STRING }
                },
                required: ['shutter_speed', 'iso', 'white_balance']
              }
            },
            required: ['type', 'model', 'lens', 'exposure']
          },
          lighting: {
            type: Type.OBJECT,
            properties: {
              setup_type: { type: Type.STRING },
              lights: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING },
                    position: { type: Type.STRING },
                    intensity_percent: { type: Type.NUMBER }
                  },
                  required: ['name', 'type', 'position', 'intensity_percent']
                }
              }
            },
            required: ['setup_type', 'lights']
          },
          composition: {
            type: Type.OBJECT,
            properties: {
              angle: { type: Type.STRING },
              framing: { type: Type.STRING },
              depth_of_field: { type: Type.STRING }
            },
            required: ['angle', 'framing', 'depth_of_field']
          },
          background: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              surface: { type: Type.STRING },
              material: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ['type', 'surface', 'material', 'description']
          },
          aesthetic: {
            type: Type.OBJECT,
            properties: {
              style: { type: Type.STRING },
              tone: { type: Type.STRING },
              contrast: { type: Type.STRING },
              shadow_depth: { type: Type.STRING },
              highlight_rolloff: { type: Type.STRING }
            },
            required: ['style', 'tone', 'contrast', 'shadow_depth', 'highlight_rolloff']
          },
          realismLevel: { type: Type.STRING },
          skinTexture: { type: Type.STRING },
          hairDetail: { type: Type.STRING },
          manipulationStyle: { type: Type.STRING },
          luxuryConsiderations: {
            type: Type.OBJECT,
            properties: {
              applyLuxuryLogic: { type: Type.BOOLEAN },
              visualIdentity: { type: Type.STRING },
              spaceDiscipline: { type: Type.STRING }
            }
          }
        },
        required: ['camera', 'lighting', 'composition', 'background', 'aesthetic', 'realismLevel']
      }
    }
  });

  try {
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as PhotographerSpecification;
  } catch (e) {
    console.error("Failed to parse photographer specs JSON:", e);
    throw new Error("Failed to get photographer specifications");
  }
};


