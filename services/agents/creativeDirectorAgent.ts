import { GoogleGenAI, Type } from "@google/genai";
import type { ProductAnalysisResult, CreativeDirectorDecision, AdConcept, UserPreferences } from '../../types';
import { CREATIVE_DIRECTOR_PROMPT, LUXURY_VISUAL_INTELLIGENCE_PROMPT } from './prompts';
import { evaluateLuxuryAlignment, getLVIRecommendations, getVisualIdentity } from './luxuryVisualIntelligence';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Generate multiple concepts for user selection
export const generateConcepts = async (
  productAnalysis: ProductAnalysisResult,
  platformPreference?: string,
  userPreferences?: UserPreferences
): Promise<AdConcept[]> => {
  const preferencesNote = userPreferences ? `
User Preferences:
${userPreferences.modelPreference && userPreferences.modelPreference !== 'let-ai-decide' ? `- Model Preference: ${userPreferences.modelPreference}` : ''}
${userPreferences.aestheticStyle && userPreferences.aestheticStyle !== 'let-ai-decide' ? `- Aesthetic Style: ${userPreferences.aestheticStyle}` : ''}
${userPreferences.styleDirection && userPreferences.styleDirection !== 'let-ai-decide' ? `- Style Direction: ${userPreferences.styleDirection}` : ''}
` : '';

  const prompt = `You are a world-class creative director with decades of experience in advertising and marketing. Based on the product analysis provided, use your expertise to generate 3 distinct, compelling ad concepts that would work best for this specific product.

IMPORTANT: Do not limit yourself to predefined concept types. Analyze the product deeply and create concepts that:
- Are uniquely suited to this product's category, attributes, and target audience
- Offer different strategic approaches (some may be product-focused, others lifestyle, others conceptual, or entirely different angles)
- Each concept should explore a different creative direction that would be effective for this specific product
- Consider what would work best for this product type - don't force concepts that don't fit

**BE ARTISTIC!** Think like a high-fashion photographer. For the 'visualDescription', don't just describe the scene. Describe the **LIGHTING**, the **MOOD**, and the **COMPOSITION**.

-   **Use Compositional Rules:** "Rule of Thirds," "Leading Lines," "Framing."

-   **Good Example:** "A model placed on the right-third of the frame, with a road acting as a **leading line** to draw the eye."

-   **Good Example:** "The subject is **framed** by a dark doorway, creating a sense of intimacy and depth."

-   **Good Example:** "A man sits on the floor in a single, dramatic shaft of warm sunlight, casting a long shadow. The mood is introspective and minimal."

-   **Bad Example:** "A model in a red shirt."

${preferencesNote}

Product Analysis:
- Category: ${productAnalysis.productCategory}
- Type: ${productAnalysis.productType}
- Attributes: ${JSON.stringify(productAnalysis.productAttributes)}
- Target Audience: ${productAnalysis.targetAudience}
- Key Selling Points: ${productAnalysis.keySellingPoints.join(', ')}
- Recommended Mood: ${productAnalysis.recommendedMood || 'Not specified'}
- Recommended Aesthetic: ${productAnalysis.recommendedAesthetic || 'Not specified'}
- Brand Tier: ${productAnalysis.brandTier || 'undetermined'}
${productAnalysis.visualIdentity ? `- Visual Identity: ${productAnalysis.visualIdentity}` : ''}
${productAnalysis.luxuryIndicators && productAnalysis.luxuryIndicators.length > 0 ? `- Luxury Indicators: ${productAnalysis.luxuryIndicators.join(', ')}` : ''}

${platformPreference ? `Platform: ${platformPreference}` : ''}

${evaluateLuxuryAlignment(productAnalysis) ? `
=== LUXURY VISUAL INTELLIGENCE (LVI) ===
${LUXURY_VISUAL_INTELLIGENCE_PROMPT}

This product aligns with luxury/premium positioning. Apply Luxury Visual Intelligence framework:
- Use category-specific visual DNA for this product category
- Apply luxury model behavior guidelines (restraint, confidence, minimal emoting)
- Use luxury location and composition principles (architectural backdrops, negative space, minimalism)
- Apply luxury lighting, color, and texture logic
- Ensure visual descriptions reflect luxury discipline (no clutter, whitespace-driven, controlled palettes)

Visual Identity: ${getVisualIdentity(productAnalysis)}
` : ''}

This product analysis was derived from a comprehensive analysis of provided inputs (text description, image, or both). Use all available information intelligently:

- Extract and utilize ALL key selling points - each represents an opportunity for concept development
- The recommended mood and aesthetic reflect synthesized insights from both text and visual analysis
- Target audience details provide deep insights for creating resonant concepts
- Product attributes from both sources should inform concept design

Think strategically about what concepts would be most effective for this product. Consider:
- What makes this product unique or special? (Use all key selling points from the analysis)
- What emotional triggers would resonate with the target audience? (Use the recommended mood as a guide)
- What visual approaches would best showcase the product's strengths? (Use the recommended aesthetic as a foundation)
- What creative angles haven't been overdone for this category?
- How can each concept emphasize different aspects from the comprehensive product analysis?

Ensure that each concept reflects the depth and richness of information provided in the product analysis. The analysis synthesizes insights from all provided sources, so use it fully to create robust, well-informed concepts.

Generate 3 distinct concepts, each with:
- Title (short, descriptive, creative)
- Description (what makes this concept unique and why it works for this product)
- Ad type (e.g., product-showcase, lifestyle, testimonial, comparison, conceptual, etc.)
- Model requirement (true/false - based on whether human presence would enhance or distract)
- Model style (if model required - e.g., professional, casual, aspirational, etc.)
- Presentation style (e.g., flat-lay, on-model, floating, abstract, environmental, etc.)
- Mood (the emotional tone)
- Aesthetic (the visual style)
- **visualDescription (A detailed, artistic, and evocative description of the final image. Focus on light, shadow, pose, and composition as described in the instructions above.)**

Return as JSON array.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            adType: { type: Type.STRING },
            modelRequired: { type: Type.BOOLEAN },
            modelStyle: { type: Type.STRING },
            presentationStyle: { type: Type.STRING },
            mood: { type: Type.STRING },
            aesthetic: { type: Type.STRING },
            visualDescription: { type: Type.STRING }
          },
          required: ['title', 'description', 'adType', 'modelRequired', 'presentationStyle', 'mood', 'aesthetic', 'visualDescription']
        }
      }
    }
  });

  try {
    const jsonText = response.text.trim();
    const concepts = JSON.parse(jsonText) as any[];
    return concepts.map((concept, index) => ({
      ...concept,
      id: concept.id || `concept-${index + 1}`
    })) as AdConcept[];
  } catch (e) {
    console.error("Failed to parse concepts JSON:", e);
    throw new Error("Failed to generate concepts");
  }
};

export const getCreativeDirection = async (
  productAnalysis: ProductAnalysisResult,
  selectedConcept: AdConcept,
  platformPreference?: string
): Promise<CreativeDirectorDecision> => {
  const isLuxury = evaluateLuxuryAlignment(productAnalysis);
  const lviRecommendations = isLuxury ? getLVIRecommendations(
    productAnalysis,
    selectedConcept.mood,
    selectedConcept.aesthetic
  ) : null;

  const prompt = `${CREATIVE_DIRECTOR_PROMPT}

${isLuxury ? `
=== LUXURY VISUAL INTELLIGENCE (LVI) ===
${LUXURY_VISUAL_INTELLIGENCE_PROMPT}

This product aligns with luxury/premium positioning. Apply Luxury Visual Intelligence framework:
- Use category-specific visual DNA for color palette inference
- Apply luxury space use principles (whitespace, negative space)
- Use LVI recommendations for lighting, texture, and composition
- Integrate luxury model behavior guidelines
- Visual Identity: ${getVisualIdentity(productAnalysis)}
` : ''}

Product Analysis:
- Category: ${productAnalysis.productCategory}
- Type: ${productAnalysis.productType}
- Attributes: ${JSON.stringify(productAnalysis.productAttributes)}
- Target Audience: ${productAnalysis.targetAudience}
- Key Selling Points: ${productAnalysis.keySellingPoints.join(', ')}
- Brand Tier: ${productAnalysis.brandTier || 'undetermined'}
${productAnalysis.visualIdentity ? `- Visual Identity: ${productAnalysis.visualIdentity}` : ''}

Selected Concept:
- Title: ${selectedConcept.title}
- Description: ${selectedConcept.description}
- Ad Type: ${selectedConcept.adType}
- Model Required: ${selectedConcept.modelRequired}
- Presentation Style: ${selectedConcept.presentationStyle}
- Mood: ${selectedConcept.mood}
- Aesthetic: ${selectedConcept.aesthetic}
- Visual Description: ${selectedConcept.visualDescription}

${platformPreference ? `Platform Preference: ${platformPreference}` : ''}

${isLuxury && lviRecommendations ? `
LVI Recommendations to integrate:
- Lighting Type: ${lviRecommendations.lightingType}
- Composition Depth: ${lviRecommendations.compositionDepth}
- Texture Priority: ${lviRecommendations.texturePriority}
- Color Emotion: ${lviRecommendations.colorEmotion}
- Space Use: ${lviRecommendations.spaceUse}
` : ''}

${selectedConcept.modelRequired ? `
**CRITICAL: PRODUCT-MODEL SPATIAL RELATIONSHIP**
Since this concept requires a model, you MUST define how the product and model interact spatially:
- Provide clear "productInteraction" guidance describing WHERE and HOW the product appears relative to the model
- Examples:
  * "Model holds the perfume bottle at chest level, prominently displayed in their hand"
  * "Watch is worn on model's wrist, positioned prominently in the foreground"
  * "Perfume bottle sits on a table in the foreground while model gazes at it from behind"
  * "Model cradles the product delicately in both hands at center frame"
  * "Product is placed on a surface in the foreground, with model slightly out of focus in the background"
- The product MUST remain visible and prominent - never obscured by the model or background
- Consider the product category: wearables (watches, jewelry) = on model; perfumes/cosmetics = held or displayed; larger items = placed near model
` : ''}

Based on the selected concept, make final strategic creative decisions (platform, location, color palette, composition, aspect ratio) and provide your recommendations in JSON format.
${isLuxury ? 'Include luxuryVisualGuidelines object with LVI framework variables when applicable.' : ''}
${selectedConcept.modelRequired ? 'IMPORTANT: Include productInteraction field with clear spatial guidance for product-model relationship.' : ''}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          adType: { type: Type.STRING },
          platformRecommendation: { type: Type.STRING },
          location: { type: Type.STRING },
          modelRequired: { type: Type.BOOLEAN },
          modelType: { type: Type.STRING },
          modelCount: { type: Type.NUMBER },
          poseGuidance: { type: Type.STRING },
          productInteraction: { type: Type.STRING },
          presentationStyle: { type: Type.STRING },
          mood: { type: Type.STRING },
          colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
          compositionApproach: { type: Type.STRING },
          aspectRatio: { type: Type.STRING },
          luxuryVisualGuidelines: {
            type: Type.OBJECT,
            properties: {
              lightingType: { type: Type.STRING },
              compositionDepth: { type: Type.STRING },
              texturePriority: { type: Type.STRING },
              colorEmotion: { type: Type.STRING },
              spaceUse: { type: Type.STRING }
            }
          }
        },
        required: ['adType', 'platformRecommendation', 'location', 'modelRequired', 'presentationStyle', 'mood', 'colorPalette', 'compositionApproach', 'aspectRatio']
      }
    }
  });

  try {
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    // Merge selected concept details into the decision
    return {
      ...result,
      adType: selectedConcept.adType,
      modelRequired: selectedConcept.modelRequired,
      presentationStyle: selectedConcept.presentationStyle,
      mood: selectedConcept.mood
    } as CreativeDirectorDecision;
  } catch (e) {
    console.error("Failed to parse creative direction JSON:", e);
    throw new Error("Failed to get creative direction");
  }
};

