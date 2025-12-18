'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Repeat, Package } from 'lucide-react';

type GloveType = 'nitrile' | 'vinyl';
type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
type PurchaseType = 'subscription' | 'one-time';

interface CheckoutData {
  gloveType: GloveType | null;
  purchaseType: PurchaseType | null;
  sizeQuantities: Record<Size, number>;
  email: string;
}

const ALL_SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    gloveType: null,
    purchaseType: null,
    sizeQuantities: {
      XS: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0,
    },
    email: '',
  });

  const totalSteps = 4;

  const handleGloveTypeSelect = (type: GloveType) => {
    setCheckoutData({ ...checkoutData, gloveType: type });
    setCurrentStep(2);
  };

  const handlePurchaseTypeSelect = (type: PurchaseType) => {
    setCheckoutData({ ...checkoutData, purchaseType: type });
    setCurrentStep(3);
  };

  const handleSizeQuantityChange = (size: Size, quantity: number) => {
    setCheckoutData({
      ...checkoutData,
      sizeQuantities: {
        ...checkoutData.sizeQuantities,
        [size]: Math.max(0, quantity),
      },
    });
  };

  const handleEmailChange = (email: string) => {
    setCheckoutData({ ...checkoutData, email });
  };

  const getTotalQuantity = () => {
    return Object.values(checkoutData.sizeQuantities).reduce((sum, qty) => sum + qty, 0);
  };

  const getSelectedSizes = () => {
    return ALL_SIZES.filter(size => checkoutData.sizeQuantities[size] > 0);
  };

  const handleSubmit = async () => {
    if (!checkoutData.email || !checkoutData.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    if (getTotalQuantity() === 0) {
      alert('Please select at least one size with quantity');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

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
              Order <span style={{ fontWeight: 800 }}>Now</span>
            </h1>
            <p className="hero-subheading">
              Select your gloves and complete your order in just a few simple steps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Checkout Flow Section */}
      <section className="features-section">
        <div className="section-container">
          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="checkout-progress-wrapper"
          >
            <div className="checkout-progress">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="checkout-progress-step">
                  <div
                    className={`checkout-progress-dot ${
                      index + 1 <= currentStep ? 'active' : ''
                    }`}
                  >
                    {index + 1 < currentStep && '✓'}
                  </div>
                  {index < totalSteps - 1 && (
                    <div
                      className={`checkout-progress-line ${
                        index + 1 < currentStep ? 'active' : ''
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Checkout Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ maxWidth: '900px', margin: '0 auto' }}
          >
            <div className="glass-form-container">
              <AnimatePresence mode="wait">
                {/* Step 1: Glove Type */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="checkout-step-content"
                  >
                    <div className="section-header" style={{ marginBottom: '2rem' }}>
                      <h2 className="section-title">Choose Glove Type</h2>
                      <p className="section-subtitle">
                        Select the type of gloves you need
                      </p>
                    </div>
                    <div className="checkout-options-grid">
                      <button
                        onClick={() => handleGloveTypeSelect('nitrile')}
                        className={`glass-card checkout-option-card ${
                          checkoutData.gloveType === 'nitrile' ? 'selected' : ''
                        }`}
                        style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', border: checkoutData.gloveType === 'nitrile' ? '2px solid rgba(59, 130, 246, 0.6)' : '1px solid rgba(255, 255, 255, 0.4)' }}
                      >
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧤</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                          Nitrile
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                          Premium nitrile gloves for medical and industrial use
                        </p>
                      </button>
                      <button
                        onClick={() => handleGloveTypeSelect('vinyl')}
                        className={`glass-card checkout-option-card ${
                          checkoutData.gloveType === 'vinyl' ? 'selected' : ''
                        }`}
                        style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', border: checkoutData.gloveType === 'vinyl' ? '2px solid rgba(59, 130, 246, 0.6)' : '1px solid rgba(255, 255, 255, 0.4)' }}
                      >
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧤</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                          Vinyl
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                          Cost-effective vinyl gloves for food service and general use
                        </p>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Purchase Type */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="checkout-step-content"
                  >
                    <div className="section-header" style={{ marginBottom: '2rem' }}>
                      <h2 className="section-title">Choose Purchase Type</h2>
                      <p className="section-subtitle">
                        Select subscription or one-time purchase
                      </p>
                    </div>
                    <div className="checkout-options-grid">
                      <button
                        onClick={() => handlePurchaseTypeSelect('subscription')}
                        className={`glass-card checkout-option-card ${
                          checkoutData.purchaseType === 'subscription'
                            ? 'selected'
                            : ''
                        }`}
                        style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', border: checkoutData.purchaseType === 'subscription' ? '2px solid rgba(59, 130, 246, 0.6)' : '1px solid rgba(255, 255, 255, 0.4)' }}
                      >
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '64px', height: '64px', margin: '0 auto 1rem' }}>
                          <Repeat size={64} strokeWidth={1.5} color="#3b82f6" style={{ display: 'block' }} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                          Subscription
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                          Monthly delivery with automatic billing
                        </p>
                      </button>
                      <button
                        onClick={() => handlePurchaseTypeSelect('one-time')}
                        className={`glass-card checkout-option-card ${
                          checkoutData.purchaseType === 'one-time' ? 'selected' : ''
                        }`}
                        style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', border: checkoutData.purchaseType === 'one-time' ? '2px solid rgba(59, 130, 246, 0.6)' : '1px solid rgba(255, 255, 255, 0.4)' }}
                      >
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '64px', height: '64px', margin: '0 auto 1rem' }}>
                          <Package size={64} strokeWidth={1.5} color="#3b82f6" style={{ display: 'block' }} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                          One-Time
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                          Single carton purchase
                        </p>
                      </button>
                    </div>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="checkout-back-button"
                      style={{ marginTop: '2rem' }}
                    >
                      ← Back
                    </button>
                  </motion.div>
                )}

                {/* Step 3: Size Quantities & Email */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="checkout-step-content"
                  >
                    <div className="section-header" style={{ marginBottom: '2rem' }}>
                      <h2 className="section-title">
                        {checkoutData.purchaseType === 'subscription'
                          ? 'Select Sizes & Quantities'
                          : 'Select Sizes & Quantities'}
                      </h2>
                      <p className="section-subtitle">
                        Choose quantities for each size you need
                      </p>
                    </div>

                    {/* Size Quantity Selectors */}
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {ALL_SIZES.map((size, index) => (
                          <div key={size}>
                            <div
                              style={{
                                padding: '1.5rem 0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '1rem',
                              }}
                            >
                              <div style={{ minWidth: '80px', flexShrink: 0 }}>
                                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>
                                  {size}
                                  {checkoutData.sizeQuantities[size] > 0 && (
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', marginLeft: '0.5rem' }}>
                                      ({checkoutData.sizeQuantities[size]} carton{checkoutData.sizeQuantities[size] !== 1 ? 's' : ''})
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() =>
                                    handleSizeQuantityChange(
                                      size,
                                      checkoutData.sizeQuantities[size] - 1
                                    )
                                  }
                                  className="quantity-button"
                                  disabled={checkoutData.sizeQuantities[size] === 0}
                                  style={{
                                    opacity: checkoutData.sizeQuantities[size] === 0 ? 0.5 : 1,
                                    cursor: checkoutData.sizeQuantities[size] === 0 ? 'not-allowed' : 'pointer',
                                  }}
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={checkoutData.sizeQuantities[size]}
                                  onChange={(e) =>
                                    handleSizeQuantityChange(
                                      size,
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="glass-input rounded-full"
                                  style={{
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    width: '70px',
                                  }}
                                />
                                <button
                                  onClick={() =>
                                    handleSizeQuantityChange(
                                      size,
                                      checkoutData.sizeQuantities[size] + 1
                                    )
                                  }
                                  className="quantity-button"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            {index < ALL_SIZES.length - 1 && (
                              <div
                                style={{
                                  height: '1px',
                                  background: 'rgba(0, 0, 0, 0.15)',
                                  margin: '0',
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Email Input */}
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label className="block text-sm font-semibold text-gray-900" style={{ marginBottom: 0 }}>
                          Email Address <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="email"
                          value={checkoutData.email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          placeholder="your.email@example.com"
                          className="glass-input rounded-full"
                          style={{
                            width: '100%',
                            paddingLeft: '1.5rem',
                            paddingRight: '1.5rem',
                            textAlign: 'left',
                            fontWeight: 700,
                          }}
                          required
                        />
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: 0, lineHeight: 1.5 }}>
                          We'll create an account for you to manage your{' '}
                          {checkoutData.purchaseType === 'subscription'
                            ? 'subscription'
                            : 'orders'}
                          . You'll receive an email to set up your password.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="checkout-back-button"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => setCurrentStep(4)}
                        disabled={
                          !checkoutData.email ||
                          !checkoutData.email.includes('@') ||
                          getTotalQuantity() === 0
                        }
                        className="checkout-primary-button"
                        style={{ flex: 1, minWidth: '200px' }}
                      >
                        Continue to Review
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="checkout-step-content"
                  >
                    <div className="section-header" style={{ marginBottom: '2rem' }}>
                      <h2 className="section-title">Review Your Order</h2>
                      <p className="section-subtitle">
                        Please review your order details before proceeding
                      </p>
                    </div>
                    <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                          <span style={{ fontWeight: 600, color: '#6b7280' }}>Glove Type:</span>
                          <span style={{ fontWeight: 700, color: '#111827' }}>
                            {checkoutData.gloveType === 'nitrile'
                              ? 'Nitrile'
                              : 'Vinyl'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                          <span style={{ fontWeight: 600, color: '#6b7280' }}>Type:</span>
                          <span style={{ fontWeight: 700, color: '#111827' }}>
                            {checkoutData.purchaseType === 'subscription'
                              ? 'Monthly Subscription'
                              : 'One-Time Purchase'}
                          </span>
                        </div>
                        {getSelectedSizes().map((size) => (
                          <div
                            key={size}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              paddingBottom: '1rem',
                              borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                            }}
                          >
                            <span style={{ fontWeight: 600, color: '#6b7280' }}>
                              Size {size}:
                            </span>
                            <span style={{ fontWeight: 700, color: '#111827' }}>
                              {checkoutData.sizeQuantities[size]} carton
                              {checkoutData.sizeQuantities[size] !== 1 ? 's' : ''}
                            </span>
                          </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                          <span style={{ fontWeight: 600, color: '#6b7280' }}>Total Quantity:</span>
                          <span style={{ fontWeight: 700, color: '#111827', fontSize: '1.125rem' }}>
                            {getTotalQuantity()} carton
                            {getTotalQuantity() !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
                          <span style={{ fontWeight: 600, color: '#6b7280' }}>Email:</span>
                          <span style={{ fontWeight: 700, color: '#111827' }}>
                            {checkoutData.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="checkout-back-button"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="checkout-primary-button"
                        style={{ flex: 1, minWidth: '200px' }}
                      >
                        {loading ? 'Processing...' : 'Proceed to Payment'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
