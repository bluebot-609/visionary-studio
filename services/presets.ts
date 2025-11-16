export interface PhotographyPreset {
  id: string;
  name: string;
  mood: string;
  lighting: string;
  background: string;
  productPlacement: string;
  modelPoses: string;
  bestFor: string[];
  // Detailed guidelines for AI interpretation
  placementGuidelines: string;
  poseGuidelines: string;
}

export const ALL_PRESETS: PhotographyPreset[] = [
  {
    id: 'minimalist-clean',
    name: 'Minimalist & Clean',
    mood: 'Simplicity, elegance, sophistication, and modern refinement',
    lighting: 'Soft, even lighting with no harsh shadows; often uses natural light or diffused studio lighting to create uniform illumination',
    background: 'Pure white (#FFFFFF), light gray, or neutral tones; ample negative space surrounds the product',
    productPlacement: 'Centered or rule-of-thirds positioning with symmetrical arrangements; products face forward to highlight key features',
    modelPoses: 'Simple, understated poses with minimal movement; standing straight with hands relaxed or gently touching the product; neutral expressions that don\'t distract',
    bestFor: ['E-commerce platforms (Amazon, eBay)', 'Tech products', 'Luxury items', 'Wellness products', 'Brands emphasizing quality and craftsmanship'],
    placementGuidelines: 'Center the product or use rule-of-thirds arrangements for calm geometry. Ample negative space surrounds the product—nothing to compete visually. Align edges and labels parallel to the image frame for order and polish. Props, if used, are sparse and arranged symmetrically or in simple, single layers.',
    poseGuidelines: 'Models appear neutral, still, and composed—standing straight, facing forward, hands at sides or gently interacting with the product. Expressions remain relaxed and non-distracting. If holding a product, hands present it squarely, often at chest or waist height with open palms.'
  },
  {
    id: 'dark-moody',
    name: 'Dark & Moody',
    mood: 'Mystery, luxury, sophistication, drama, and emotional depth',
    lighting: 'Low-key lighting with a single directional light source; creates deep shadows, rich blacks, and strategic golden highlights',
    background: 'Dark tones (black, charcoal, deep navy); heavy use of negative space to build tension',
    productPlacement: 'Asymmetrical compositions using rule of thirds; products positioned to catch dramatic lighting that emphasizes texture and depth',
    modelPoses: 'Contemplative and mysterious—looking away from camera, partial profiles, look-over-shoulder poses; relaxed yet purposeful body language with S-curve poses for elegance',
    bestFor: ['Premium brands', 'Luxury goods', 'Fashion and lifestyle products', 'Jewelry', 'Spirits', 'High-end electronics'],
    placementGuidelines: 'Asymmetrical compositions using the rule-of-thirds add intrigue and depth. Products are positioned to catch raking or directional light; highlights emphasize textures, contours, and finishes. Often set back from the background, casting controlled, soft shadows and enhancing atmosphere. Layering with lux props (velvet, metal) adds complexity and sophistication.',
    poseGuidelines: 'Dramatic, relaxed yet deliberate poses: angled body, partial profile, or subtle movement. Gaze may be averted or directed beyond camera for mystery; often a "look over shoulder" pose. Hands draped, lightly touching the product, or gently resting on textured surfaces.'
  },
  {
    id: 'bright-airy',
    name: 'Bright & Airy',
    mood: 'Freshness, purity, approachability, tranquility, and optimism',
    lighting: 'Natural light or soft artificial lighting; often shot during golden hour or overcast days for gentle, diffused illumination',
    background: 'White, pastel tones, or soft neutrals with generous breathing room around products',
    productPlacement: 'Flat lay arrangements with organic patterns; triangle compositions for balanced movement; generous negative space',
    modelPoses: 'Natural, effortless poses—casually sitting with one knee bent, gentle movements showing garment flow, relaxed interactions with products',
    bestFor: ['Beauty and skincare products', 'Baby items', 'Organic products', 'Wellness brands', 'Soft goods'],
    placementGuidelines: 'Active use of negative space for a breezy feel; products aren\'t crowded. Flat lays or tabletop shots with products scattered in gentle, natural patterns. Props are light, organic, and minimal, arranged loosely. Backdrops are soft white, pastel, or faintly textured for lift.',
    poseGuidelines: 'Casual, comfortable, and spontaneous: sitting naturally, walking, turning gently, or engaging in small, joyful movements. Movements show product flow—fabrics in the breeze, hands holding lightweight goods, light twirls, or natural smiles. Direct interaction with product is key—such as spraying a mist, opening a box, or showing a texture.'
  },
  {
    id: 'lifestyle-contextual',
    name: 'Lifestyle & Contextual',
    mood: 'Authenticity, relatability, aspiration, and real-world connection',
    lighting: 'Natural environmental lighting that matches the setting; golden hour for outdoor shoots or ambient interior lighting',
    background: 'Real-world environments—homes, offices, outdoor locations, cafes; settings that tell a story about product usage',
    productPlacement: 'Integrated into scenes rather than isolated; products shown in use with contextual props that build narrative',
    modelPoses: 'Active lifestyle poses showing products in use—walking, turning, reaching, engaging with environment; natural movements demonstrating functionality',
    bestFor: ['Apparel', 'Home goods', 'Food and beverage', 'Outdoor gear', 'Consumer electronics', 'Lifestyle brands'],
    placementGuidelines: 'Products seamlessly integrated within real-world scenes or vignettes—kitchen, living room, office, outdoors. Surrounded by authentic props and contextual elements relating to their daily use (e.g., coffee cup on table, skincare in bathroom). Slight angle or offset alignment mimics natural, unforced use.',
    poseGuidelines: 'Action poses dominate: pouring, sitting at a table, cooking, using the product in a plausible activity. Attitude is relaxed and genuine—models are caught mid-gesture, laughing, reaching, interacting with surroundings. Eye line may follow product engagement rather than face the camera.'
  },
  {
    id: 'monochromatic',
    name: 'Monochromatic',
    mood: 'Sophistication, visual harmony, modern minimalism, and striking simplicity',
    lighting: 'Controlled studio lighting that maintains consistent color temperature; soft to moderate shadows for tonal variation',
    background: 'Single color in varying shades—from light tints to deep saturated tones of the same hue',
    productPlacement: 'Symmetrical arrangements with side-by-side identical items; central positioning with matching tonal props',
    modelPoses: 'Structured geometric poses like hip-pop (weight shifted to one leg); minimal movement to maintain refined aesthetic',
    bestFor: ['Modern fashion brands', 'Design-focused products', 'Art supplies', 'Brands with strong color identities'],
    placementGuidelines: 'Arranged symmetrically or in carefully balanced patterns—reflecting the single color palette. Elements lined up, stacked, or grouped in tidy clusters for visual harmony. Props, surfaces, and product variants in varying shades/tints of the key color.',
    poseGuidelines: 'Strong, geometric lines—classic hip-pop or triangular leg arrangements. Simple standing or seated poses, minimal movement. Pose and attire echo the monochrome scheme, reinforcing unity and color focus.'
  },
  {
    id: 'high-key-white-studio',
    name: 'High-Key/White Studio',
    mood: 'Professional, clean, clinical, trustworthy, and distraction-free',
    lighting: 'Bright, even lighting from multiple angles to eliminate all shadows; overexposed background for pure white',
    background: 'Seamless white backdrop that appears infinite; no visible edges or textures',
    productPlacement: 'Front-facing angles showing overall key features; multiple angles (front, back, overhead, side) for comprehensive views',
    modelPoses: 'Standard catalog poses—standing straight facing camera, hands on hips, or arms at sides; clear view of product details without obstruction',
    bestFor: ['E-commerce platforms requiring standardized images', 'Medical products', 'Electronics', 'Any product needing accurate color representation'],
    placementGuidelines: 'Standardized angles: product faces front, with additional side, back, and overhead shots for e-commerce. Clean, shadowless presentation; items centered or neatly aligned. No distracting props, but supporting items (e.g., size reference objects) may be used sparingly.',
    poseGuidelines: 'Classic catalog stance: upright, arms relaxed, facing forward. Hands may touch product but don\'t obscure key features. Neutral posture, clean lines, and balanced weight convey professionalism.'
  },
  {
    id: 'textured-layered',
    name: 'Textured & Layered',
    mood: 'Depth, sophistication, artistic flair, tactile appeal, and visual richness',
    lighting: 'Directional lighting that emphasizes surface textures; side lighting or raking light to create shadows that reveal material qualities',
    background: 'Textured surfaces (wood, fabric, stone, paper) or layered materials creating dimensional backdrops',
    productPlacement: 'Products positioned on or against textured surfaces; composition includes 2-3 complementary props with interesting textures',
    modelPoses: 'Poses that allow interaction with textured elements—leaning against surfaces, sitting on textured furniture, holding props that add layers',
    bestFor: ['Artisanal products', 'Handcrafted items', 'Organic goods', 'Premium fashion', 'Brands emphasizing quality materials'],
    placementGuidelines: 'Products rest on or against tactile backgrounds (wood, linen, stone) to highlight material qualities. Layer props—like folded towels, stacked books, or textured sheets—beneath or beside product for depth. Slight product angles or overlap create 3D interest; avoid flat, dead-center setups.',
    poseGuidelines: 'Touch or interact with textures (e.g., leaning on tables, running hands over surfaces, holding textile products). Body angled, limbs draped naturally to echo the background\'s lines and layers. Clothing fits the tactile theme for harmony.'
  },
  {
    id: 'gradient-modern',
    name: 'Gradient & Modern',
    mood: 'Contemporary, dynamic, on-trend, calm sophistication, and digital-native appeal',
    lighting: 'Clean studio lighting with optional colored gels to enhance gradient effects; soft shadows that complement color transitions',
    background: 'Smooth gradient transitions between complementary colors—typically two or three colors blending seamlessly',
    productPlacement: 'Off-center using rule of thirds; products positioned to align with or contrast gradient flow; shallow depth of field to blur background',
    modelPoses: 'Contemporary confident poses—leaning against surfaces, turning body at angles to create visual interest parallel to gradient direction',
    bestFor: ['Tech products', 'Digital services', 'Cosmetics', 'Beverages', 'Brands targeting social media audiences'],
    placementGuidelines: 'Products set off-center, aligned with or visually contrasted against background gradients. Use diagonals or dynamic angles for energy and modernity. Composition guides viewers\' eyes along the gradient or towards the product.',
    poseGuidelines: 'Modern, confident poses: leaning, shifting weight, turning, or interacting with edges/background. Play with directionality—body or gaze moves along or against the gradient\'s flow. Poses slightly experimental, echoing the visual dynamism of the background.'
  },
  {
    id: 'editorial-conceptual',
    name: 'Editorial & Conceptual',
    mood: 'Artistic, narrative-driven, aspirational, fashion-forward, and emotionally evocative',
    lighting: 'Varies by concept—can be dramatic, natural, or experimental; lighting serves the story being told',
    background: 'Diverse creative settings ranging from abstract environments to styled studio sets; backgrounds support the narrative',
    productPlacement: 'Unconventional angles and compositions; products treated as characters within larger visual stories; creative use of negative space',
    modelPoses: 'Fashion editorial poses—experimental angles, partial body shots, dynamic movements, poses that blur lines between art and commerce',
    bestFor: ['Fashion and beauty brands', 'Lifestyle publications', 'Premium consumer goods', 'Brands building aspirational identities'],
    placementGuidelines: 'Bold, unconventional angles—products may float, tilt, or be partially shown for artistic narrative. Props and backgrounds become part of the visual story—arranged to support the concept, not just display. Use negative space creatively for mood or to highlight key story points.',
    poseGuidelines: 'Fashion editorial style: angled, stretched, cropped, or in-motion for drama. Intense expressions, expressive body language, and interactions with conceptual props or environment. Poses are tailored to the campaign concept; art-directed for maximum impact and creativity.'
  }
];

export const getPresetById = (id: string): PhotographyPreset | undefined => {
  return ALL_PRESETS.find(preset => preset.id === id);
};

