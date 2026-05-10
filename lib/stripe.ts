import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
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
  // You'll need to store the Stripe customer ID in your database
  // This is a simplified example
  const customer = await stripe.customers.list({
    metadata: { userId },
    limit: 1,
  });

  if (customer.data.length === 0) {
    throw new Error('No customer found for user');
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customer.data[0].id,
    return_url: returnUrl,
  });

  return portalSession;
}
