import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing session_id' },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    return NextResponse.json({
      valid: session.payment_status === 'paid',
      customerId: session.customer,
      subscriptionId: session.subscription,
    });
  } catch (error) {
    console.error('Session verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 400 }
    );
  }
}
