'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/Footer';

function AccountSetupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [setupMethod, setSetupMethod] = useState<'password' | 'google' | null>(null);

  const handlePasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement Firebase password setup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/account');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to set up password. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      // TODO: Implement Google Sign-In
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/account');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to link Google account. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen">
        <section className="hero-section">
          <div className="hero-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="hero-content"
            >
              <h1 className="hero-heading">
                Account Set Up <span style={{ fontWeight: 800 }}>Successfully!</span>
              </h1>
              <p className="hero-subheading">
                Your account has been configured. Redirecting you to your account dashboard...
              </p>
            </motion.div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

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
              Set Up Your <span style={{ fontWeight: 800 }}>Account</span>
            </h1>
            <p className="hero-subheading">
              Choose how you'd like to access your account
            </p>
          </motion.div>
        </div>
      </section>

      {/* Account Setup Section */}
      <section className="features-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            <div className="glass-form-container">
              {!setupMethod ? (
                <>
                  <div className="checkout-options-grid">
                    <button
                      onClick={() => setSetupMethod('password')}
                      className="glass-card"
                      style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                        Set Password
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                        Create a password to sign in with your email
                      </p>
                    </button>
                    <button
                      onClick={() => setSetupMethod('google')}
                      className="glass-card"
                      style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                        Link Google Account
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                        Sign in quickly with your Google account
                      </p>
                    </button>
                  </div>
                </>
              ) : setupMethod === 'password' ? (
                <form onSubmit={handlePasswordSetup}>
                  <div className="section-header" style={{ marginBottom: '2rem' }}>
                    <h2 className="section-title">Create Password</h2>
                    <p className="section-subtitle">
                      Set a secure password for your account
                    </p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass-input rounded-full w-full px-4 text-gray-900 placeholder-gray-500 font-medium"
                      required
                      disabled
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="glass-input rounded-full w-full px-4 text-gray-900 placeholder-gray-500 font-medium"
                      required
                      minLength={8}
                      placeholder="At least 8 characters"
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="glass-input rounded-full w-full px-4 text-gray-900 placeholder-gray-500 font-medium"
                      required
                      minLength={8}
                    />
                  </div>

                  {error && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#dc2626',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.75rem',
                      marginBottom: '1rem',
                      fontSize: '0.875rem'
                    }}>
                      {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button
                      type="button"
                      onClick={() => setSetupMethod(null)}
                      className="glass-button"
                      style={{ padding: '0.875rem 2rem' }}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="cta-button"
                      style={{ flex: 1 }}
                    >
                      {loading ? 'Setting Up...' : 'Set Password'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="section-header" style={{ marginBottom: '2rem' }}>
                    <h2 className="section-title">Link Google Account</h2>
                    <p className="section-subtitle">
                      Click the button below to link your Google account. You'll be able to sign in with Google in the future.
                    </p>
                  </div>

                  {error && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#dc2626',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.75rem',
                      marginBottom: '1rem',
                      fontSize: '0.875rem'
                    }}>
                      {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button
                      type="button"
                      onClick={() => setSetupMethod(null)}
                      className="glass-button"
                      style={{ padding: '0.875rem 2rem' }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleGoogleAuth}
                      disabled={loading}
                      className="glass-button"
                      style={{ flex: 1, padding: '0.875rem 2rem' }}
                    >
                      {loading ? 'Linking...' : '🔗 Link Google Account'}
                    </button>
                  </div>
                </>
              )}

              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Already have an account? <Link href="/account/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function AccountSetupPage() {
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
      <AccountSetupContent />
    </Suspense>
  );
}
