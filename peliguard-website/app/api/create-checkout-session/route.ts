import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// TODO: Replace with actual product prices from your Stripe products
// For now, using placeholder pricing structure
const PRODUCT_PRICES: Record<string, Record<string, number>> = {
  nitrile: {
    XS: 2500, // $25.00 in cents
    S: 2500,
    M: 2500,
    L: 2500,
    XL: 2500,
    XXL: 2500,
  },
  vinyl: {
    XS: 2000, // $20.00 in cents
    S: 2000,
    M: 2000,
    L: 2000,
    XL: 2000,
    XXL: 2000,
  },
};

type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      gloveType,
      purchaseType,
      sizeQuantities,
      email,
    }: {
      gloveType: 'nitrile' | 'vinyl';
      purchaseType: 'subscription' | 'one-time';
      sizeQuantities: Record<Size, number>;
      email: string;
    } = body;

    if (!gloveType || !purchaseType || !sizeQuantities || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Filter out sizes with 0 quantity
    const selectedSizes = Object.entries(sizeQuantities).filter(
      ([_, quantity]) => quantity > 0
    ) as [Size, number][];

    if (selectedSizes.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one size with quantity' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Build line items for each size/quantity combination
    const lineItems = selectedSizes.map(([size, quantity]) => {
      const unitAmount = PRODUCT_PRICES[gloveType]?.[size] || 2500;
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${gloveType.charAt(0).toUpperCase() + gloveType.slice(1)} Gloves - Size ${size}`,
            description: `${purchaseType === 'subscription' ? 'Monthly subscription' : 'One-time purchase'}: ${gloveType} gloves, size ${size}`,
          },
          unit_amount: unitAmount,
          ...(purchaseType === 'subscription' && {
            recurring: {
              interval: 'month',
            },
          }),
        },
        quantity: quantity,
      };
    });

    // Build metadata with all size quantities
    const metadata: Record<string, string> = {
      gloveType,
      purchaseType,
      email,
    };

    // Add each size quantity to metadata
    selectedSizes.forEach(([size, quantity]) => {
      metadata[`size_${size}`] = quantity.toString();
    });

    if (purchaseType === 'subscription') {
      // Create subscription checkout session
      const session = await stripe.checkout.sessions.create({
        customer_email: email,
        mode: 'subscription',
        line_items: lineItems,
        metadata,
        subscription_data: {
          metadata,
        },
        shipping_address_collection: {
          allowed_countries: ['US'],
        },
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout/cancel`,
      });

      return NextResponse.json({ url: session.url });
    } else {
      // Create one-time payment checkout session
      const session = await stripe.checkout.sessions.create({
        customer_email: email,
        mode: 'payment',
        line_items: lineItems,
        metadata,
        shipping_address_collection: {
          allowed_countries: ['US'],
        },
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout/cancel`,
      });

      return NextResponse.json({ url: session.url });
    }
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
