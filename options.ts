
export const CREATIVE_BRIEF_OPTIONS = {
  aspectRatio: ['1:1', '4:5', '9:16', '16:9', '4:3'],
  cameraAngle: [
    // General
    'Eye-level', 
    'Medium Shot',
    'Long Shot',
    'Two Shot',
    'High-angle', 
    'Low-angle', 
    'Overhead Shot',
    'Hip-level Shot',
    'Ground-level Shot',
    'Dutch Angle',
    // Zoom & Detail
    'Close-up', 
    'Macro', 
    'Ultra Macro',
    'Extreme Zoom',
    'Extreme Full View',
    // Product Specific
    'Profile Angle (Product)',
    'Front Angle (Product)',
    'Angled Shot (25-75 degrees) (Product)',
    'Flat Lay (Overhead Angle) (Product)',
  ],
  modelType: ['Male', 'Female', 'Non-binary', 'Lifestyle Couple', 'Product-Only'],
  environment: ['Studio', 'Indoor', 'Room', 'Bedroom', 'Outdoor Nature', 'Urban City', 'Outdoor City', 'Outdoor Street', 'Road', 'Minimalist', 'Fantasy'],
  presentation: ['Flat Lay', 'On-Model', 'Floating', 'Abstract', 'In-Context'],
  mood: ['Energetic', 'Calm', 'Luxurious', 'Mysterious', 'Joyful', 'Nostalgic'],
  colorGrading: [
    'None',
    'Natural',
    'Cinematic Teal & Orange', 
    'Pastel Dreams', 
    'Monochromatic', 
    'Vibrant & Saturated', 
    'Vintage Film',
    'High Contrast Black & White',
    'Sepia Tone',
    'Cyberpunk Neon',
    'Golden Hour Glow',
    'Muted Earth Tones',
    'Bleach Bypass'
  ],
  lighting: ['Softbox', 'Natural Sunlight', 'Dramatic Hard Light', 'Neon', 'Golden Hour'],
  realismLevel: ['Photorealistic', 'Hyperrealistic', 'Ultra-realistic'],
  skinTexture: ['Natural', 'Smooth & Airbrushed', 'Detailed Pores', 'Matte Finish', 'Dewy Glow'],
  hairDetail: ['Natural Flow', 'Sharp Individual Strands', 'Soft & Wispy', 'Intricate Braids', 'Wet Look'],
  manipulationStyle: ['None', 'Surreal Composite', 'Double Exposure', 'Color Splash', 'Glitch Art', 'Pixel Sorting'],
};

// FIX: Added the missing TRENDING_STYLES export.
export const TRENDING_STYLES = [
    '3D Glassmorphism',
    'AI Surrealism',
    'Y2K Revival',
    'Retro Futurism',
    'Bauhaus Inspired',
    'Anti-Design',
    'Holographic & Iridescent',
    'Abstract Gradients',
    'Kinetic Typography',
    'Brutalism',
    'Neomorphism',
    'Cottagecore Aesthetics'
];
