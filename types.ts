export interface CreativeBrief {
  aspectRatio: string;
  cameraAngle: string;
  modelType: string;
  environment: string;
  presentation: string;
  mood: string;
  colorGrading: string;
  lighting: string;
  creativeGoal: string;
  textOverlay: boolean;
  dominantColor?: string;
  realismLevel: string;
  skinTexture: string;
  hairDetail: string;
  manipulationStyle: string;
}

export interface UploadedFile {
  name: string;
  type: string;
  base64: string;
}

export interface ReferenceStyleAnalysis {
  style: string;
  pose: string;
  composition: string;
  background: string;
  lighting: string;
  aesthetic: string;
  colorPalette?: string[];
}

export interface GeneratedImage {
  id: string;
  base64: string;
  captions: GeneratedCaptions | null;
  hue: number; // For hue-rotate filter (-180 to 180)
  saturation: number; // For saturate filter (0 to 200)
}

export interface GeneratedCaptions {
  hinglish: string;
  hindi: string;
  english: string;
}

export interface SeductiveCaptions extends GeneratedCaptions {
    seductiveHinglish: string;
    seductiveHindi: string;
    seductiveEnglish: string;
}

// FIX: Added Concept interface to be used across the application.
export interface Concept {
    title: string;
    description: string;
}

// --- Professional Photography Settings ---

export interface CameraSettings {
  type: string;
  model: string;
  lens: {
    type: string;
    focal_length_mm: number;
    aperture: string;
  };
  exposure: {
    shutter_speed: string;
    iso: number;
    white_balance: string;
  };
}

export interface Light {
  name: 'Key Light' | 'Fill Light' | 'Back Light' | 'Rim Light';
  type: string;
  position: string;
  intensity_percent: number;
}

export interface LightingSettings {
  setup_type: string;
  lights: Light[];
  ambient?: {
    enabled: boolean;
    source: string;
    intensity_percent: number;
  };
}

export interface CompositionSettings {
  angle: string;
  framing: string;
  depth_of_field: 'Shallow' | 'Moderate' | 'Deep';
}

export interface BackgroundSettings {
  type: string;
  surface: string;
  material: string;
  description: string;
}

export interface AestheticSettings {
  style: string;
  tone: string;
  contrast: string;
  shadow_depth: string;
  highlight_rolloff: string;
}

export interface PhotoSettings {
  camera: CameraSettings;
  lighting: LightingSettings;
  composition: CompositionSettings;
  background: BackgroundSettings;
  aesthetic: AestheticSettings;
}

// --- Multi-Agent System Types ---

export interface ProductAnalysisResult {
  productCategory: string;
  productAttributes: {
    size?: string;
    color?: string;
    material?: string;
    features?: string[];
  };
  targetAudience: string;
  keySellingPoints: string[];
  productType: 'physical' | 'service' | 'lifestyle' | 'digital';
  recommendedMood?: string;
  recommendedAesthetic?: string;
  brandTier?: 'luxury' | 'premium' | 'mid-tier' | 'mass-market' | 'undetermined';
  luxuryIndicators?: string[];
  visualIdentity?: string; // e.g., 'Fashion Luxury', 'Tech Premium', 'Beauty Luxury', etc.
  recommendedPresets?: string[]; // Array of preset IDs, top 3 most suitable
}

export interface LuxuryVisualGuidelines {
  lightingType: string; // 'Natural Diffused' | 'Softbox Edge Light' | 'Backlit Glow'
  compositionDepth: string; // 'Flat' | '3D Layered' | 'Cinematic Focus Pull'
  texturePriority: string; // 'Matte' | 'Reflective' | 'Velvet' | 'Organic'
  colorEmotion: string; // 'Neutral Calm' | 'Bold Luxury' | 'Warm Serenity'
  spaceUse: string; // 'Whitespace-driven' | 'Layered Environment' | 'Dynamic Diagonal'
}

export interface PropStrategy {
  enabled: boolean;
  strategy: string;
  propIdeas: string[];
  interactionNotes?: string;
  abstractionLevel?: 'literal' | 'abstract' | 'minimal' | 'none';
}

export interface ExpressionGuidance {
  emotion: string;
  facialExpression: string;
  bodyLanguage: string;
  gazeDirection?: string;
  energyLevel?: string;
}

export interface CreativeDirectorDecision {
  adType: string; // 'product-showcase' | 'lifestyle' | 'testimonial' | etc.
  platformRecommendation: string; // 'Instagram Post' | 'Instagram Story' | 'Facebook Post' | 'Twitter Post'
  location: string; // environment/setting
  modelRequired: boolean;
  modelType?: string;
  modelCount?: number;
  poseGuidance?: string;
  productInteraction?: string; // Describes spatial relationship between product and model (e.g., "Model holds perfume at chest level")
  presentationStyle: string; // 'flat-lay' | 'on-model' | 'floating' | etc.
  mood: string;
  colorPalette: string[];
  compositionApproach: string;
  aspectRatio: string;
  concepts?: AdConcept[]; // Multiple concepts for user selection
  luxuryVisualGuidelines?: LuxuryVisualGuidelines;
  supportingProps?: PropStrategy;
  expressionGuidance?: ExpressionGuidance;
}

export interface LuxuryConsiderations {
  applyLuxuryLogic: boolean;
  visualIdentity: string;
  spaceDiscipline: string; // 'Whitespace-driven' | 'Minimal Layering' | 'Architectural'
}

export interface PhotographerSpecification {
  camera: CameraSettings;
  lighting: LightingSettings;
  composition: CompositionSettings;
  background: BackgroundSettings;
  aesthetic: AestheticSettings;
  realismLevel: string;
  skinTexture?: string;
  hairDetail?: string;
  manipulationStyle?: string;
  luxuryConsiderations?: LuxuryConsiderations;
}

export interface AgentOrchestrationResult {
  productAnalysis: ProductAnalysisResult;
  creativeDirection: CreativeDirectorDecision;
  photographerSpecs: PhotographerSpecification;
  masterPrompt: string;
}

export interface AdConcept {
  id: string;
  title: string;
  description: string;
  adType: string;
  modelRequired: boolean;
  modelStyle?: string;
  presentationStyle: string;
  mood: string;
  aesthetic: string;
  visualDescription: string;
}

export interface UserPreferences {
  modelPreference?: 'with-model' | 'product-only' | 'hybrid' | 'let-ai-decide';
  aestheticStyle?: 'luxurious' | 'minimalist' | 'energetic' | 'calm' | 'mysterious' | 'joyful' | 'let-ai-decide';
  styleDirection?: 'modern' | 'classic' | 'edgy' | 'soft' | 'let-ai-decide';
}

export interface AdCreativeRequest {
  imageFile?: UploadedFile;
  textDescription?: string;
  platformPreference?: string; // Optional override
  selectedConcept?: AdConcept; // User-selected concept
  selectedPreset?: string; // Preset ID
  aspectRatio?: '1:1' | '3:4' | '9:16' | '16:9'; // Explicit aspect ratio override
  mode?: 'ai-guided' | 'reference-image'; // Generation mode
  referenceImage?: UploadedFile; // Reference image for style transfer
  referenceNotes?: string; // Optional user guidance for reference mode
}

export interface AdCreative {
  id: string;
  base64: string;
  prompt: string;
  agentDecisions?: AgentOrchestrationResult; // Optional for reference mode
  referenceStyleAnalysis?: ReferenceStyleAnalysis; // For reference mode
}

export interface ReferenceImageRefinements {
  backgroundColorAdjustment?: string; // Optional background color/intensity
  lightingIntensity?: 'subtle' | 'moderate' | 'strong'; // Optional lighting adjustment
  faceReplacement?: boolean; // Whether to replace model face
}
