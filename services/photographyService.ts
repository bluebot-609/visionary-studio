import type { CreativeBrief, PhotoSettings, CameraSettings, LightingSettings, CompositionSettings, BackgroundSettings, AestheticSettings, Light } from '../types';

const getCameraSetup = (brief: CreativeBrief): CameraSettings => {
    let focal_length_mm = 50;
    let aperture = 'f/5.6';

    if (brief.presentation === 'Flat Lay' || brief.cameraAngle.includes('Overhead')) {
        focal_length_mm = 50;
        aperture = 'f/8';
    } else if (brief.presentation === 'On-Model' || brief.cameraAngle.includes('Medium') || brief.cameraAngle.includes('Two Shot')) {
        focal_length_mm = 85;
        aperture = 'f/2.8';
    } else if (brief.cameraAngle.includes('Macro')) {
        focal_length_mm = 100;
        aperture = 'f/11';
    } else if (brief.cameraAngle.includes('Long Shot')) {
        focal_length_mm = 35;
        aperture = 'f/4';
    }

    if (brief.mood === 'Luxurious' || brief.mood === 'Nostalgic') {
        aperture = 'f/2.8';
    } else if (brief.mood === 'Energetic') {
        aperture = 'f/4';
    }

    return {
        type: 'Full Frame Mirrorless',
        model: 'Canon EOS R5',
        lens: {
            type: focal_length_mm >= 85 ? 'Prime' : (focal_length_mm >= 100 ? 'Macro' : 'Standard Prime'),
            focal_length_mm,
            aperture
        },
        exposure: {
            shutter_speed: '1/160s',
            iso: 200,
            white_balance: '5600K (Daylight)'
        }
    };
};

const getLightingSetup = (brief: CreativeBrief): LightingSettings => {
    const lights: Light[] = [];
    let setup_type = '3-point';

    switch(brief.lighting) {
        case 'Natural Sunlight':
            setup_type = 'Natural Light Simulation';
            lights.push({ name: 'Key Light', type: 'Soft Natural Window Light', position: '45° front-left', intensity_percent: 80 });
            lights.push({ name: 'Fill Light', type: 'White Reflector', position: 'opposite key light', intensity_percent: 30 });
            break;
        case 'Dramatic Hard Light':
            setup_type = '1-point High Contrast';
            lights.push({ name: 'Key Light', type: 'Direct Hard Light (Bare Bulb or Snoot)', position: 'side (90°)', intensity_percent: 90 });
            break;
        case 'Neon':
            setup_type = 'Multi-point Colored Light';
            lights.push({ name: 'Key Light', type: 'Blue Neon Tube', position: '45° front-left', intensity_percent: 60 });
            lights.push({ name: 'Fill Light', type: 'Magenta Neon Tube', position: '45° front-right', intensity_percent: 40 });
            lights.push({ name: 'Back Light', type: 'Rim Light', position: 'behind subject', intensity_percent: 20 });
            break;
        case 'Golden Hour':
            setup_type = 'Warm, Low-Angle Light';
            lights.push({ name: 'Key Light', type: 'Low-angle Golden Hour Sunlight', position: 'side (75°)', intensity_percent: 85 });
            lights.push({ name: 'Fill Light', type: 'Gold Reflector', position: 'low, opposite key', intensity_percent: 25 });
            break;
        case 'Softbox':
        default:
            setup_type = 'Classic 3-point Studio';
            lights.push({ name: 'Key Light', type: 'Large Softbox', position: '45° front-left, slightly above', intensity_percent: 70 });
            lights.push({ name: 'Fill Light', type: 'Medium Softbox or Reflector', position: '45° front-right', intensity_percent: 40 });
            lights.push({ name: 'Back Light', type: 'Rim Light or Hair Light', position: 'behind and above subject', intensity_percent: 30 });
            break;
    }
    return { setup_type, lights };
};

const getComposition = (brief: CreativeBrief, camera: CameraSettings): CompositionSettings => {
    let depth_of_field: 'Shallow' | 'Moderate' | 'Deep' = 'Moderate';
    const apertureValue = parseFloat(camera.lens.aperture.replace('f/', ''));
    if (apertureValue <= 2.8) {
        depth_of_field = 'Shallow';
    } else if (apertureValue >= 8) {
        depth_of_field = 'Deep';
    }

    return {
        angle: brief.cameraAngle,
        framing: brief.presentation === 'Flat Lay' ? 'Top-down, symmetrically arranged' : 'Centered subject with leading lines',
        depth_of_field,
    };
};

const getBackground = (brief: CreativeBrief): BackgroundSettings => {
    let type = 'Studio';
    let surface = 'Matte';
    let material = 'Seamless Paper';
    let description = `A clean, professional ${brief.environment} environment.`;

    if (brief.environment.includes('Outdoor') || brief.environment.includes('Urban')) {
        type = 'Environmental';
        material = 'Natural Elements';
        description = `A realistic ${brief.environment} scene, with the background slightly out of focus to emphasize the subject.`;
    } else if (brief.environment === 'Minimalist') {
        type = 'Gradient or Solid Color';
        surface = 'Matte';
        description = 'An ultra-clean, minimalist background with no distractions.'
    } else if (brief.environment === 'Studio') {
        surface = brief.mood === 'Luxurious' ? 'Glossy' : 'Matte';
        material = brief.mood === 'Luxurious' ? 'Acrylic or Marble' : 'Seamless Paper';
        description = `A professional studio setting with a ${surface} ${material} surface.`
    }

    return { type, surface, material, description };
};

const getAesthetic = (brief: CreativeBrief): AestheticSettings => {
    switch (brief.mood) {
        case 'Luxurious':
            return { style: 'Luxury', tone: 'Warm', contrast: 'Medium-High', shadow_depth: 'Deep but soft', highlight_rolloff: 'Smooth' };
        case 'Energetic':
            return { style: 'Dynamic', tone: 'Vibrant', contrast: 'High', shadow_depth: 'Hard-edged', highlight_rolloff: 'Specular' };
        case 'Calm':
            return { style: 'Minimalist', tone: 'Neutral or Cool', contrast: 'Low', shadow_depth: 'Soft and minimal', highlight_rolloff: 'Gentle' };
        case 'Mysterious':
            return { style: 'Cinematic', tone: 'Cool', contrast: 'High', shadow_depth: 'Very Deep (Low-Key)', highlight_rolloff: 'Controlled' };
        case 'Joyful':
            return { style: 'Commercial', tone: 'Bright and Warm', contrast: 'Medium', shadow_depth: 'Light and airy', highlight_rolloff: 'Bright' };
        case 'Nostalgic':
            return { style: 'Vintage Film', tone: 'Warm with faded colors', contrast: 'Low', shadow_depth: 'Soft, lifted blacks', highlight_rolloff: 'Blooming' };
        default:
            return { style: 'Standard Commercial', tone: 'Neutral', contrast: 'Medium', shadow_depth: 'Soft', highlight_rolloff: 'Smooth' };
    }
};


export const translateBriefToPhotoSettings = (brief: CreativeBrief): PhotoSettings => {
    const camera = getCameraSetup(brief);
    const lighting = getLightingSetup(brief);
    const composition = getComposition(brief, camera);
    const background = getBackground(brief);
    const aesthetic = getAesthetic(brief);
    
    return {
        camera,
        lighting,
        composition,
        background,
        aesthetic
    };
};
