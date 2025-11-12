import { NextRequest, NextResponse } from 'next/server';
import { getCreativeDirection } from '../../../../services/agents/creativeDirectorAgent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selectedConcept, productDescription, userPreferences, targetAudience, brandPersonality } = body;

    if (!selectedConcept || !productDescription) {
      return NextResponse.json(
        { error: 'Selected concept and product description are required' },
        { status: 400 }
      );
    }

    const direction = await getCreativeDirection({
      selectedConcept,
      productDescription,
      userPreferences,
      targetAudience,
      brandPersonality,
    });

    return NextResponse.json({ direction });
  } catch (error) {
    console.error('Error in /api/ai/direction:', error);
    return NextResponse.json(
      { error: 'Failed to get creative direction', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

