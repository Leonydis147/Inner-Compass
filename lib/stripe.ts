import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

export const STRIPE_PRICES = {
  // Monthly subscription plans
  BASIC_MONTHLY: process.env.STRIPE_PRICE_BASIC_MONTHLY,
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY,
  
  // One-time purchases
  SESSION_PACK_5: process.env.STRIPE_PRICE_SESSION_PACK_5,
  SESSION_PACK_10: process.env.STRIPE_PRICE_SESSION_PACK_10,
};

export interface CheckoutSessionParams {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
}: CheckoutSessionParams) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function createPortalSession(userId: string, returnUrl: string) {
  // Note: In production, store Stripe customer_id in your database
  // This is a simplified example - you'll need to query your DB for the customer_id
  throw new Error(
    'createPortalSession: Store customer_id in your database and retrieve it for user: ' + userId
  );
}
