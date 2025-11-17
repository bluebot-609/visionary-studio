import { GoogleGenAI, Type } from "@google/genai";
import type { ProductAnalysisResult, CreativeDirectorDecision, AdConcept } from '../../types';
import { CREATIVE_DIRECTOR_PROMPT, LUXURY_VISUAL_INTELLIGENCE_PROMPT } from './prompts';
import { evaluateLuxuryAlignment, getLVIRecommendations, getVisualIdentity } from './luxuryVisualIntelligence';
import { getPresetById } from '../presets';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Generate multiple concepts for user selection
export const generateConcepts = async (
  productAnalysis: ProductAnalysisResult,
  platformPreference?: string
): Promise<AdConcept[]> => {
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
    const jsonText = response.text?.trim() || '';
    if (!jsonText) {
      throw new Error("Empty response from AI");
    }
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
  platformPreference?: string,
  selectedPreset?: string
): Promise<CreativeDirectorDecision> => {
  const isLuxury = evaluateLuxuryAlignment(productAnalysis);
  const lviRecommendations = isLuxury ? getLVIRecommendations(
    productAnalysis,
    selectedConcept.mood,
    selectedConcept.aesthetic
  ) : null;

  // Load preset data if provided
  const preset = selectedPreset ? getPresetById(selectedPreset) : undefined;

  const prompt = `${CREATIVE_DIRECTOR_PROMPT}

${preset ? `
=== PRESET AESTHETIC DIRECTION ===
The user has selected the "${preset.name}" aesthetic preset. This preset defines the overall creative direction:

**Aesthetic Overview:**
- Target Mood: ${preset.mood}
- Lighting Approach: ${preset.lighting}
- Background Style: ${preset.background}
- Best Suited For: ${preset.bestFor.join(', ')}

**CRITICAL: PRODUCT PLACEMENT GUIDELINES**
Follow these specific placement principles for the "${preset.name}" aesthetic:
${preset.placementGuidelines}

**CRITICAL: MODEL POSE GUIDELINES**
If a model is required, follow these specific pose principles for the "${preset.name}" aesthetic:
${preset.poseGuidelines}

${preset.propGuidance ? `
**PROP & SURROUNDING INTERACTION GUIDANCE**
- Allowed: ${preset.propGuidance.allowed ? 'Yes - recommended within this preset' : 'No - keep scene prop-free unless functionality demands it'}
- Philosophy: ${preset.propGuidance.philosophy}
- Guidelines: ${preset.propGuidance.guidelines}
- Suggested Props: ${preset.propGuidance.suggestedProps?.join(', ') || 'None'}
- Abstract-Friendly: ${preset.propGuidance.abstractFriendly ? 'Yes, conceptual or geometric props may be used when aligned with the story.' : 'No, keep props literal or omit them entirely.'}

If props are allowed, determine SPECIFIC supporting props for this product, aligning with the preset philosophy. If props are discouraged, explain why and disable them.
` : ''}

**YOUR TASK:**
Analyze the product, selected concept, and this preset's detailed guidelines. Then make intelligent creative decisions that:

1. **Product Placement**: Apply the preset's placement guidelines intelligently:
   - Interpret the placement philosophy (e.g., "rule-of-thirds", "centered", "asymmetrical")
   - Determine the EXACT positioning that serves THIS specific product's features and category
   - Consider the product's size, shape, and key selling points when applying placement rules
   - Specify precise composition details (e.g., "product positioned on left third, angled 15 degrees toward camera")

2. **Model Poses** (if model required): Apply the preset's pose guidelines intelligently:
   - Interpret the pose style (e.g., "neutral and composed", "dramatic and relaxed", "action-oriented")
   - Determine the EXACT pose that serves THIS product and concept
   - Specify precise pose details (e.g., "model standing straight, facing camera, holding product at chest height with open palms")
   - Ensure product visibility and prominence while following preset pose style

3. **Integration**: Ensure placement and poses work together:
   - Product placement and model pose should complement each other
   - Spatial relationship between product and model should be clearly defined
   - Both should serve the preset's aesthetic direction while highlighting the product

4. **Tailoring**: Adapt preset guidelines to product specifics:
   - If preset suggests "centered placement" → determine exact center positioning for THIS product's dimensions
   - If preset suggests "rule-of-thirds" → specify which third and why it serves this product
   - If preset suggests "asymmetrical" → determine the specific asymmetry that creates visual interest for THIS product
   - If preset suggests specific poses → adapt them to show THIS product's features effectively

**IMPORTANT**: Use the preset guidelines as your foundation, but create SPECIFIC, DETAILED decisions tailored to this exact product. The preset provides the aesthetic direction; you provide the intelligent, product-specific implementation with precise placement and pose specifications.
` : ''}

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
${preset ? `
**PRESET POSE & PLACEMENT GUIDANCE:**
The "${preset.name}" preset provides specific guidelines for model poses and product placement. Apply these guidelines when defining the spatial relationship:
- Placement: ${preset.placementGuidelines}
- Poses: ${preset.poseGuidelines}

Use these preset guidelines as your foundation, but adapt them specifically for this product and concept.
` : ''}
- Provide clear "productInteraction" guidance describing WHERE and HOW the product appears relative to the model
- Provide clear "poseGuidance" that follows the preset's pose style (if preset selected) or creates an appropriate pose for this product
- Examples of productInteraction:
  * "Model holds the perfume bottle at chest level, prominently displayed in their hand"
  * "Watch is worn on model's wrist, positioned prominently in the foreground"
  * "Perfume bottle sits on a table in the foreground while model gazes at it from behind"
  * "Model cradles the product delicately in both hands at center frame"
  * "Product is placed on a surface in the foreground, with model slightly out of focus in the background"
- The product MUST remain visible and prominent - never obscured by the model or background
- Consider the product category: wearables (watches, jewelry) = on model; perfumes/cosmetics = held or displayed; larger items = placed near model
${preset ? `
- Ensure the poseGuidance aligns with the preset's pose style: ${preset.poseGuidelines}
- Ensure the productInteraction aligns with the preset's placement approach: ${preset.placementGuidelines}
` : ''}
` : ''}

**SUPPORTING PROPS REQUIREMENT**
- Always include a "supportingProps" object in your JSON response.
- If props enhance this preset/concept, set enabled=true and describe the strategy, provide 3-4 propIdeas, note interaction guidance, and specify whether it should feel "abstract", "literal", or "minimal".
- If props should be avoided, set enabled=false with a short rationale in the strategy field.

${selectedConcept.modelRequired ? `
**MODEL EXPRESSION & EMOTIONAL TRANSLATION**
- Map the campaign mood into a precise emotional cue for the model.
- Provide micro-expression notes (eyes, mouth, brows) that keep the model human and alive.
- Define body language cues that reinforce the mood (weight shift, tension vs relaxation, gesture dynamics).
- Specify gaze direction or focus to anchor the viewer connection.
- Note the overall energy level ('serene', 'magnetic', 'playful', 'commanding', etc.).
- Return this in an "expressionGuidance" object so downstream agents and prompts preserve believable emotional nuance.
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
          },
          supportingProps: {
            type: Type.OBJECT,
            properties: {
              enabled: { type: Type.BOOLEAN },
              strategy: { type: Type.STRING },
              propIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
              interactionNotes: { type: Type.STRING },
              abstractionLevel: { type: Type.STRING }
            }
          },
          expressionGuidance: {
            type: Type.OBJECT,
            properties: {
              emotion: { type: Type.STRING },
              facialExpression: { type: Type.STRING },
              bodyLanguage: { type: Type.STRING },
              gazeDirection: { type: Type.STRING },
              energyLevel: { type: Type.STRING }
            }
          }
        },
        required: ['adType', 'platformRecommendation', 'location', 'modelRequired', 'presentationStyle', 'mood', 'colorPalette', 'compositionApproach', 'aspectRatio']
      }
    }
  });

  try {
    const jsonText = response.text?.trim() || '';
    if (!jsonText) {
      throw new Error("Empty response from AI");
    }
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

