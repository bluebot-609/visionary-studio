import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase-server';
import { addCredits } from '@/services/creditService';

// Credit package mapping from packageId to credits
const PACKAGE_CREDITS: Record<string, number> = {
  'starter': 120,
  'popular': 240,
  'pro': 480,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentId, signature, packageId } = body;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Verify payment signature
    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (generatedSignature !== signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Verify payment with Razorpay
    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      return NextResponse.json(
        { error: 'Payment not successful' },
        { status: 400 }
      );
    }

    // Extract credits from packageId (format: credits_packageId_creditsCount)
    const packageMatch = packageId?.match(/^credits_(.+?)_(\d+)$/);
    const credits = packageMatch 
      ? parseInt(packageMatch[2], 10)
      : PACKAGE_CREDITS[packageId] || 120; // Default to smallest package if not found

    // Add credits to user account
    const result = await addCredits(
      user.id,
      credits,
      `razorpay_order_${orderId}`,
      {
        orderId,
        paymentId,
        packageId,
        amount: payment.amount,
        currency: payment.currency,
      }
    );

    if (!result.success) {
      console.error('Error adding credits:', result.error);
      return NextResponse.json(
        { error: 'Failed to add credits to account', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      creditsAdded: credits,
      newBalance: result.newBalance,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}




