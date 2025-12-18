'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <h1 className="hero-heading">
              Order <span style={{ fontWeight: 800 }}>Confirmed!</span>
            </h1>
            <p className="hero-subheading">
              Thank you for your order. Your payment has been processed successfully.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Success Content Section */}
      <section className="features-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: '900px', margin: '0 auto' }}
          >
            <div className="glass-form-container">
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)',
                  color: 'white',
                  fontSize: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
                }}>
                  ✓
                </div>
                {sessionId && (
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '2rem' }}>
                    Order ID: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#111827' }}>{sessionId}</span>
                  </p>
                )}
              </div>

              <div className="section-header" style={{ marginBottom: '2rem' }}>
                <h2 className="section-title">What's Next?</h2>
                <p className="section-subtitle">
                  Here's what happens after your order
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)',
                    color: 'white',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    1
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>
                      Account Created
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                      We've automatically created an account for you using your email address.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)',
                    color: 'white',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    2
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>
                      Check Your Email
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                      You'll receive an email shortly with a link to set up your password or link your Google account.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)',
                    color: 'white',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    3
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>
                      Order Processing
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                      Your order is being processed and you'll receive a shipping confirmation email once it's on its way.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <Link href="/" className="cta-button" style={{ flex: 1, minWidth: '150px', textAlign: 'center' }}>
                  Return Home
                </Link>
                <Link href="/account/setup" className="glass-button" style={{ flex: 1, minWidth: '150px', textAlign: 'center', padding: '1.25rem 3rem' }}>
                  Set Up Account Now
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen">
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-heading">Loading...</h1>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
