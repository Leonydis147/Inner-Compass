import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const { userId, email, plan } = await req.json();

  if (!userId || !email || !plan) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Map plan to Stripe price ID
  const priceIds: Record<string, string | undefined> = {
    basic: process.env.STRIPE_PRICE_BASIC_MONTHLY,
    pro: process.env.STRIPE_PRICE_PRO_MONTHLY,
  };

  const priceId = priceIds[plan];
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  try {
    const session = await createCheckoutSession({
      userId,
      email,
      priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    // Store pending subscription in database
    await getSupabaseAdmin()
      .from('user_profiles')
      .upsert({
        id: userId,
        email,
        stripe_subscription_id: session.id,
        subscription_status: 'pending',
        updated_at: new Date().toISOString(),
      });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
