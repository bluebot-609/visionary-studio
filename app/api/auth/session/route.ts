import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to set auth session cookie
 * Called from client after successful Firebase authentication
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    // Set httpOnly cookie with ID token
    // In production, you should verify this token with Firebase Admin SDK
    const response = NextResponse.json({ success: true });
    
    response.cookies.set('auth-token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error setting auth session:', error);
    }
    return NextResponse.json(
      { error: 'Failed to set session' },
      { status: 500 }
    );
  }
}

/**
 * API route to clear auth session cookie
 * Called from client on logout
 */
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth-token');
  return response;
}

