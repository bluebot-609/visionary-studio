import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to get current session
 * Used by middleware and client-side auth checks
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: session.user });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error getting session:', error);
    }
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}

/**
 * API route to clear auth session
 * Called from client on logout
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error clearing session:', error);
    }
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 }
    );
  }
}
