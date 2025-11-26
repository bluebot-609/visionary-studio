import { NextRequest, NextResponse } from 'next/server';
import { generatePhotoshootImage } from '../../../../services/geminiService';
import { createClient } from '@/lib/supabase-server';
import { hasSufficientCredits, deductCredits } from '@/services/creditService';
import type { UploadedFile, ShotType } from '../../../../types';

const fileToImageData = (file: UploadedFile) => {
  return {
    mimeType: file.type,
    data: file.base64,
  };
};

const getCreditCost = (isProMode: boolean, resolution: string): number => {
  if (!isProMode) return 1;
  if (resolution === '4K') return 4;
  return 3; // default Pro 2K / other pro modes
};

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json() as {
      productImage: UploadedFile;
      referenceImage?: UploadedFile;
      prompt: string;
      modelAppearance?: string;
      aspectRatio?: string;
      isProMode?: boolean;
      resolution?: string;
      textOverlay?: string;
      autoGenerateText?: boolean;
      shotType?: ShotType;
    };

    const isProMode = body.isProMode ?? false;
    const resolution = body.resolution || '1K';
    const requiredCredits = getCreditCost(isProMode, resolution);

    // Check if user has sufficient credits
    const hasCredits = await hasSufficientCredits(user.id, requiredCredits);

    if (!hasCredits) {
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          message: `You need at least ${requiredCredits} credit${requiredCredits === 1 ? '' : 's'} to generate an image at this tier. Please purchase credits.`,
          code: 'INSUFFICIENT_CREDITS'
        },
        { status: 402 } // Payment Required
      );
    }

    if (!body.productImage) {
      return NextResponse.json(
        { error: 'Product image is required' },
        { status: 400 }
      );
    }

    // Prompt is only required if there's no reference image
    if (!body.referenceImage && !body.prompt) {
      return NextResponse.json(
        { error: 'Prompt is required when no reference image is provided' },
        { status: 400 }
      );
    }

    const productImageData = fileToImageData(body.productImage);
    const referenceImageData = body.referenceImage ? fileToImageData(body.referenceImage) : null;

    // Generate image using reference Nano Banana service
    const result = await generatePhotoshootImage(
      productImageData,
      referenceImageData,
      body.prompt || '',
      body.modelAppearance,
      body.aspectRatio || '1:1',
      isProMode,
      resolution,
      body.textOverlay,
      body.autoGenerateText ?? false,
      body.shotType || 'product'
    );

    // Deduct credits after successful generation
    const deductResult = await deductCredits(
      user.id,
      requiredCredits,
      'image_generation',
      {
        aspect_ratio: body.aspectRatio || '1:1',
        has_reference: !!body.referenceImage,
        mode: isProMode ? 'pro' : 'standard',
        resolution,
        text_overlay: !!(body.textOverlay && body.textOverlay.length),
      }
    );

    if (!deductResult.success) {
      // Log error but don't fail the request (image already generated)
      console.error('Error deducting credits after generation:', deductResult.error);
    }

    // Return result with remaining balance
    return NextResponse.json({
      ...result,
      credits: {
        deducted: requiredCredits,
        remaining: deductResult.newBalance
      }
    });
  } catch (error) {
    console.error('Error in /api/ai/generate:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

