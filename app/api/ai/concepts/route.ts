import { NextRequest, NextResponse } from 'next/server';
import { generateCreativeConcepts } from '../../../../services/geminiService';
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
      theme?: string;
      prompt?: string;
    };

    if (!body.productImage) {
      return NextResponse.json(
        { error: 'Product image is required' },
        { status: 400 }
      );
    }

    const imageData = fileToImageData(body.productImage);
    const concepts = await generateCreativeConcepts(imageData, body.theme, body.prompt);

    return NextResponse.json({ concepts });
  } catch (error) {
    console.error('Error in /api/ai/concepts:', error);
    return NextResponse.json(
      { error: 'Failed to generate concepts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
