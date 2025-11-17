import { NextRequest, NextResponse } from 'next/server';
import { generatePhotoshootImage } from '../../../../services/geminiService';
import type { UploadedFile } from '../../../../types';

const fileToImageData = (file: UploadedFile) => {
  return {
    mimeType: file.type,
    data: file.base64,
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      productImage: UploadedFile;
      referenceImage?: UploadedFile;
      prompt: string;
      modelAppearance?: string;
      aspectRatio?: '1:1' | '9:16' | '4:3' | '3:4' | '16:9';
    };

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

    const result = await generatePhotoshootImage(
      productImageData,
      referenceImageData,
      body.prompt || '',
      body.modelAppearance,
      body.aspectRatio || '1:1'
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/ai/generate:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

