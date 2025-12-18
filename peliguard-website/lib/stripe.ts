import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
  });
} else if (process.env.NODE_ENV === 'production') {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = stripeInstance!;
