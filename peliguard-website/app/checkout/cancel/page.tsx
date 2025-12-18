'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

export default function CheckoutCancelPage() {
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
              Order <span style={{ fontWeight: 800 }}>Cancelled</span>
            </h1>
            <p className="hero-subheading">
              Your checkout was cancelled. No payment has been processed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cancel Content Section */}
      <section className="features-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            <div className="glass-form-container">
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)',
                  color: 'white',
                  fontSize: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
                }}>
                  ✕
                </div>
                <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.6 }}>
                  If you experienced any issues or have questions, please don't hesitate to contact us.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/checkout" className="cta-button" style={{ flex: 1, minWidth: '150px', textAlign: 'center' }}>
                  Try Again
                </Link>
                <Link href="/" className="glass-button" style={{ flex: 1, minWidth: '150px', textAlign: 'center', padding: '1.25rem 3rem' }}>
                  Return Home
                </Link>
                <Link href="/contact" className="glass-button" style={{ flex: 1, minWidth: '150px', textAlign: 'center', padding: '1.25rem 3rem' }}>
                  Contact Us
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
