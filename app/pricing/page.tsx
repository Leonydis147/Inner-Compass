'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$9.99',
    period: '/month',
    description: 'Essential journaling with AI insights',
    features: [
      '5 journal entries per day',
      'Basic emotion detection',
      'Weekly summaries',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19.99',
    period: '/month',
    description: 'Advanced coaching with full archetype tracking',
    features: [
      'Unlimited journal entries',
      'Advanced archetype analysis',
      'Vector memory search',
      'Priority support',
      'Export your data',
    ],
    popular: true,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    setLoading(plan);
    
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user', // Replace with actual user ID from auth
          email: 'user@example.com', // Replace with actual user email
          plan,
        }),
      });

      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Something went wrong');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Invest in your mental and spiritual growth
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-8 rounded-2xl border-2 ${
                plan.popular
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-sm font-semibold rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-blue-700'
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                } disabled:opacity-50`}
              >
                {loading === plan.id ? 'Loading...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p>Secure payments powered by Stripe</p>
          <p className="text-sm mt-2">
            Cancel anytime. No hidden fees.
          </p>
        </div>
      </div>
    </div>
  );
}
