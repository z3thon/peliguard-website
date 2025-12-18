import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

// Only initialize Stripe if we have the secret key
// During build time, this may not be available, so we handle it gracefully
if (process.env.STRIPE_SECRET_KEY) {
  try {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    });
  } catch (error) {
    console.warn('Failed to initialize Stripe:', error);
  }
}

// Export a function to get stripe instance, throwing only at runtime when actually needed
export function getStripe(): Stripe {
  if (!stripeInstance) {
    throw new Error('Stripe not initialized. STRIPE_SECRET_KEY environment variable is required.');
  }
  return stripeInstance;
}

// For backward compatibility, export stripe instance
// This will be null during build if env var is not set, but that's okay
export const stripe = stripeInstance as Stripe;
