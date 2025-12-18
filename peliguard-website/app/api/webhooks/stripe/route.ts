import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminAuth, adminFirestore } from '@/lib/firebase-admin';
import Stripe from 'stripe';

// Disable body parsing for webhook route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!adminAuth || !adminFirestore) {
    return NextResponse.json(
      { error: 'Firebase Admin not initialized' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.metadata && session.metadata.email) {
        const email = session.metadata.email;
        const gloveType = session.metadata.gloveType as 'nitrile' | 'vinyl';
        const purchaseType = session.metadata.purchaseType as 'subscription' | 'one-time';
        
        // Extract size quantities from metadata
        const sizeQuantities: Record<string, number> = {};
        const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        if (session.metadata) {
          sizes.forEach((size) => {
            const qty = session.metadata![`size_${size}`];
            if (qty) {
              sizeQuantities[size] = parseInt(qty);
            }
          });
        }
        
        const totalQuantity = Object.values(sizeQuantities).reduce((sum, qty) => sum + qty, 0);

        // Create or get Firebase user
        let firebaseUser;
        try {
          firebaseUser = await adminAuth.getUserByEmail(email);
        } catch (error: any) {
          if (error.code === 'auth/user-not-found') {
            // Create new user
            firebaseUser = await adminAuth.createUser({
              email,
              emailVerified: false,
            });
          } else {
            throw error;
          }
        }

        // Store user data in Firestore
        await adminFirestore.collection('users').doc(firebaseUser.uid).set({
          email,
          createdAt: new Date(),
          accountSetupComplete: false,
          authProvider: null,
        }, { merge: true });

        // Create order document
        const orderData = {
          userId: firebaseUser.uid,
          stripePaymentIntentId: session.payment_intent as string,
          stripeSessionId: session.id,
          gloveType,
          sizeQuantities,
          totalQuantity,
          purchaseType,
          status: 'completed',
          createdAt: new Date(),
        };

        await adminFirestore.collection('orders').doc(session.id).set(orderData);

        // If subscription, create subscription document
        if (purchaseType === 'subscription' && session.subscription) {
          const subscriptionData = {
            userId: firebaseUser.uid,
            stripeSubscriptionId: session.subscription as string,
            stripeCustomerId: session.customer as string,
            gloveType,
            sizeQuantities,
            totalQuantity,
            frequency: 'monthly',
            status: 'active',
            createdAt: new Date(),
            nextDeliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          };

          await adminFirestore
            .collection('subscriptions')
            .doc(session.subscription as string)
            .set(subscriptionData);

          // TODO: Send welcome email with account setup link
          // You'll need to integrate an email service (SendGrid, Resend, etc.)
          console.log(`Account created for ${email}. Send welcome email with setup link.`);
        } else {
          // TODO: Send welcome email for one-time purchases
          console.log(`Account created for ${email}. Send welcome email with setup link.`);
        }
      }
    }

    // Handle subscription events
    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Update subscription document in Firestore
      const subscriptionDoc = await adminFirestore
        .collection('subscriptions')
        .doc(subscription.id)
        .get();

      if (subscriptionDoc.exists) {
        await adminFirestore
          .collection('subscriptions')
          .doc(subscription.id)
          .update({
            status: subscription.status === 'active' ? 'active' : 'cancelled',
            updatedAt: new Date(),
          });
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Mark subscription as cancelled
      await adminFirestore
        .collection('subscriptions')
        .doc(subscription.id)
        .update({
          status: 'cancelled',
          cancelledAt: new Date(),
        });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
