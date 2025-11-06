import type { ProductAnalysisResult, LuxuryVisualGuidelines } from '../../types';

/**
 * Luxury Visual Intelligence (LVI) Module
 * Provides context-aware luxury visual guidelines based on product analysis
 */

export interface LVIRecommendations {
  lightingType: string;
  compositionDepth: string;
  texturePriority: string;
  colorEmotion: string;
  spaceUse: string;
  modelExpression?: string;
  locationStyle?: string;
}

// Category-specific visual DNA mappings
const CATEGORY_VISUAL_DNA: Record<string, {
  visualIdentity: string;
  colorTheme: string[];
  modelExpression: string;
  lightingStyle: string;
  compositionStyle: string;
}> = {
  'fashion': {
    visualIdentity: 'Iconic, Minimal, Cinematic',
    colorTheme: ['Neutral', 'Gold', 'Cream', 'Black', 'White'],
    modelExpression: 'Stoic, Confident, Restrained',
    lightingStyle: 'Soft directional, cinematic gradients',
    compositionStyle: 'Symmetrical or intentional asymmetry, architectural'
  },
  'tech': {
    visualIdentity: 'Precise, Clean, Modern',
    colorTheme: ['White', 'Silver', 'Graphite', 'Neutral'],
    modelExpression: 'Absent or Neutral',
    lightingStyle: 'Sterile precision, futuristic minimalism',
    compositionStyle: 'Whitespace dominance, architectural design'
  },
  'beauty': {
    visualIdentity: 'Soft, Radiant',
    colorTheme: ['Pastel', 'Nude', 'Beige', 'Soft tones'],
    modelExpression: 'Gentle, Graceful',
    lightingStyle: 'Natural diffused, oceanic light',
    compositionStyle: 'Clean composition, soft focus'
  },
  'automotive': {
    visualIdentity: 'Powerful, Commanding',
    colorTheme: ['Black', 'Chrome', 'Red', 'Metallics'],
    modelExpression: 'Subtle Masculine',
    lightingStyle: 'Dramatic but controlled, power and serenity',
    compositionStyle: 'Studio or architectural backdrops'
  },
  'jewelry': {
    visualIdentity: 'Detailed, Opulent',
    colorTheme: ['Gold', 'Ivory', 'Silver', 'Metallic'],
    modelExpression: 'Calm, Elegant',
    lightingStyle: 'Heritage meets power, metallic shine',
    compositionStyle: 'Ornate yet minimalist displays'
  },
  'watches': {
    visualIdentity: 'Heritage, Power, Precision',
    colorTheme: ['Gold', 'Silver', 'Black', 'Metallic'],
    modelExpression: 'Masculine Confidence',
    lightingStyle: 'Metallic shine, controlled highlights',
    compositionStyle: 'Heritage meets modern, architectural'
  }
};

/**
 * Evaluates if product aligns with luxury/premium positioning
 */
export const evaluateLuxuryAlignment = (productAnalysis: ProductAnalysisResult): boolean => {
  if (!productAnalysis.brandTier) return false;
  
  return productAnalysis.brandTier === 'luxury' || productAnalysis.brandTier === 'premium';
};

/**
 * Gets Luxury Visual Intelligence recommendations based on product analysis
 */
export const getLVIRecommendations = (
  productAnalysis: ProductAnalysisResult,
  mood?: string,
  aesthetic?: string
): LVIRecommendations | null => {
  if (!evaluateLuxuryAlignment(productAnalysis)) {
    return null;
  }

  const category = productAnalysis.productCategory.toLowerCase();
  const dna = findCategoryDNA(category);
  
  // Determine lighting type based on mood and category
  let lightingType = 'Softbox Edge Light';
  if (mood === 'calm' || mood === 'elegant') {
    lightingType = 'Natural Diffused';
  } else if (mood === 'dramatic' || mood === 'mysterious') {
    lightingType = 'Backlit Glow';
  } else if (dna.lightingStyle.includes('cinematic')) {
    lightingType = 'Softbox Edge Light';
  }

  // Determine composition depth
  let compositionDepth = '3D Layered';
  if (category.includes('tech') || category.includes('minimal')) {
    compositionDepth = 'Flat';
  } else if (mood === 'cinematic' || aesthetic === 'cinematic') {
    compositionDepth = 'Cinematic Focus Pull';
  }

  // Determine texture priority
  let texturePriority = 'Reflective';
  if (category.includes('fashion') || category.includes('textile')) {
    texturePriority = 'Velvet';
  } else if (category.includes('beauty') || category.includes('skincare')) {
    texturePriority = 'Organic';
  } else if (category.includes('tech') || category.includes('minimal')) {
    texturePriority = 'Matte';
  }

  // Determine color emotion
  let colorEmotion = 'Neutral Calm';
  if (mood === 'luxurious' || mood === 'opulent') {
    colorEmotion = 'Bold Luxury';
  } else if (mood === 'calm' || mood === 'serene') {
    colorEmotion = 'Warm Serenity';
  }

  // Determine space use
  let spaceUse = 'Whitespace-driven';
  if (category.includes('fashion') || category.includes('lifestyle')) {
    spaceUse = 'Layered Environment';
  } else if (mood === 'dynamic' || mood === 'energetic') {
    spaceUse = 'Dynamic Diagonal';
  }

  return {
    lightingType,
    compositionDepth,
    texturePriority,
    colorEmotion,
    spaceUse,
    modelExpression: dna.modelExpression,
    locationStyle: 'Architectural backdrops, minimal, never cluttered'
  };
};

/**
 * Finds category-specific visual DNA
 */
const findCategoryDNA = (category: string): typeof CATEGORY_VISUAL_DNA[keyof typeof CATEGORY_VISUAL_DNA] => {
  // Direct match
  if (CATEGORY_VISUAL_DNA[category]) {
    return CATEGORY_VISUAL_DNA[category];
  }

  // Partial match
  for (const [key, dna] of Object.entries(CATEGORY_VISUAL_DNA)) {
    if (category.includes(key) || key.includes(category)) {
      return dna;
    }
  }

  // Default to fashion luxury if luxury tier
  return CATEGORY_VISUAL_DNA['fashion'];
};

/**
 * Gets category-specific visual identity
 */
export const getVisualIdentity = (productAnalysis: ProductAnalysisResult): string => {
  if (productAnalysis.visualIdentity) {
    return productAnalysis.visualIdentity;
  }

  const category = productAnalysis.productCategory.toLowerCase();
  const dna = findCategoryDNA(category);
  const tier = productAnalysis.brandTier || 'premium';
  
  // Capitalize category name
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  return `${categoryName} ${tier === 'luxury' ? 'Luxury' : 'Premium'}`;
};

/**
 * Gets luxury model behavior guidelines
 */
export const getLuxuryModelGuidelines = (): string => {
  return `Luxury Model Behavior:
- Poses: elongated neck, relaxed shoulders, distant gaze
- Expression: serenity, authority, not over-smiling
- Styling: immaculate tailoring, subtle jewelry, controlled hair texture
- Gender roles: androgyny and grace preferred over overt sensuality
- Body language: conveys confidence and restraint, rarely emotes excessively`;
};

/**
 * Gets luxury location and composition guidelines
 */
export const getLuxuryLocationGuidelines = (): string => {
  return `Luxury Location & Composition:
- Use architectural backdrops, not random outdoor scenes
- Embrace symmetry or intentional asymmetry
- Highlight environment materials (marble, linen, glass, metal)
- Keep backgrounds minimal, never cluttered
- Negative space equals luxury
- Whitespace-driven composition`;
};

/**
 * Gets luxury lighting and color guidelines
 */
export const getLuxuryLightingColorGuidelines = (): string => {
  return `Luxury Lighting, Color & Texture:
- Lighting: soft directional light, visible gradients, avoid harsh contrast unless it serves mood
- Color: monotone or tri-tone palettes, often muted or controlled bolds
- Texture: emphasize tactility — velvet, satin, brushed metal, leather`;
};

