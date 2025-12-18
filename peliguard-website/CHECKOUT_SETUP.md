# Checkout System Setup Guide

This guide will help you set up the complete checkout system with Stripe and Firebase integration.

## Prerequisites

1. **Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Firebase Project**: Create a new project at [firebase.google.com](https://firebase.google.com)

## Step 1: Stripe Configuration

### 1.1 Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** and **Secret key** (use test keys for development)

### 1.2 Set Up Webhook

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_`)

### 1.3 Configure Products

You'll need to set up products in Stripe or update the pricing in `app/api/create-checkout-session/route.ts`.

Current placeholder pricing structure:
- Nitrile gloves: $25.00 per carton (all sizes)
- Vinyl gloves: $20.00 per carton (all sizes)

**To update pricing:**
1. Edit `PRODUCT_PRICES` object in `app/api/create-checkout-session/route.ts`
2. Prices are in cents (e.g., 2500 = $25.00)

## Step 2: Firebase Configuration

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project**
3. Follow the setup wizard
4. Enable **Google Analytics** (optional)

### 2.2 Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. Enable **Email/Password** provider
4. Enable **Google** provider (for Google Sign-In)
5. Add authorized domains (your production domain)

### 2.3 Set Up Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **test mode** (you'll configure security rules later)
4. Choose a location close to your users

### 2.4 Get Firebase Admin SDK Credentials

1. Go to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Extract the following values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)

### 2.5 Get Firebase Client SDK Config

1. Go to **Project Settings** → **General**
2. Scroll to **Your apps** section
3. Click the web icon (`</>`) to add a web app
4. Copy the config values:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

## Step 3: Environment Variables

Create a `.env.local` file in the `peliguard-website` directory:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Client SDK (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:...

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important Notes:**
- For production, update `NEXT_PUBLIC_SITE_URL` to your production domain
- The `FIREBASE_PRIVATE_KEY` should include the `\n` characters (newlines)
- Never commit `.env.local` to version control

## Step 4: Firestore Security Rules

Update your Firestore security rules to allow authenticated users to read their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own user document
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only server can write
    }
    
    // Users can read their own subscriptions
    match /subscriptions/{subscriptionId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow write: if false; // Only server can write
    }
    
    // Users can read their own orders
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow write: if false; // Only server can write
    }
  }
}
```

## Step 5: Email Service (Optional but Recommended)

The webhook handler includes TODO comments for sending welcome emails. You'll need to integrate an email service:

**Recommended options:**
- **Resend** (simple, developer-friendly)
- **SendGrid** (robust, feature-rich)
- **Firebase Cloud Functions** with SendGrid/Resend

**Email to send:**
- Welcome email with account setup link after checkout
- Order confirmation
- Shipping notifications
- Subscription renewal reminders

## Step 6: Testing

### 6.1 Test Checkout Flow

1. Start your development server: `npm run dev`
2. Navigate to `/checkout`
3. Complete the checkout flow
4. Use Stripe test card: `4242 4242 4242 4242`
5. Use any future expiry date and any CVC

### 6.2 Test Webhook Locally

Use Stripe CLI to forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will give you a webhook signing secret for local testing.

### 6.3 Verify Firebase Account Creation

1. After a successful checkout, check Firebase Console → **Authentication**
2. Verify the user was created
3. Check Firestore → **orders** collection for order document
4. If subscription, check **subscriptions** collection

## Step 7: Production Deployment

### 7.1 Update Environment Variables

1. Set all environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Update `NEXT_PUBLIC_SITE_URL` to your production domain
3. Use production Stripe keys (switch from test to live)

### 7.2 Update Stripe Webhook

1. Update webhook endpoint URL to production URL
2. Update webhook signing secret in environment variables

### 7.3 Update Firebase Authorized Domains

1. In Firebase Console → **Authentication** → **Settings**
2. Add your production domain to authorized domains

## Troubleshooting

### Webhook Not Working

- Verify webhook secret is correct
- Check webhook endpoint URL is accessible
- Verify Stripe events are being sent (check Stripe Dashboard → Webhooks)

### Firebase Account Creation Fails

- Verify Firebase Admin SDK credentials are correct
- Check Firebase project has Authentication enabled
- Verify Firestore database is created

### Checkout Session Creation Fails

- Verify Stripe API keys are correct
- Check product pricing is set correctly
- Verify `NEXT_PUBLIC_SITE_URL` is set correctly

## Next Steps

1. **Set up email service** for welcome emails and notifications
2. **Create account dashboard** for users to manage subscriptions
3. **Add order history page** for users to view past orders
4. **Implement subscription management** (pause, cancel, modify)
5. **Add shipping tracking integration** with carriers

## Support

For issues or questions:
- Stripe: [stripe.com/docs](https://stripe.com/docs)
- Firebase: [firebase.google.com/docs](https://firebase.google.com/docs)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
