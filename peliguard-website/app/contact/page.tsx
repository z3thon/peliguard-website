'use client';

import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Contact() {
  const [activeTab, setActiveTab] = useState<'general' | 'wholesale'>('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectPrefix = activeTab === 'wholesale' ? '[Wholesale Inquiry] ' : '';
    const bodyPrefix = activeTab === 'wholesale' ? 'Inquiry Type: Wholesale\n\n' : '';
    window.location.href = `mailto:sales@peliguard.com?subject=${encodeURIComponent(subjectPrefix + formData.subject)}&body=${encodeURIComponent(`${bodyPrefix}Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
              Contact <span style={{ fontWeight: 800 }}>Us</span>
            </h1>
            <p className="hero-subheading">
              Get in touch with our team to discuss your protective equipment needs. 
              We're here to help you protect your workforce.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Information Section */}
      <section className="features-section">
        <div className="section-container">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Tabbed Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass-form-container tabbed-container">
                {/* Tab Navigation */}
                <div className="tab-navigation">
                  <button
                    type="button"
                    onClick={() => setActiveTab('general')}
                    className={`tab-button ${activeTab === 'general' ? 'tab-active' : ''}`}
                  >
                    General Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('wholesale')}
                    className={`tab-button ${activeTab === 'wholesale' ? 'tab-active' : ''}`}
                  >
                    Wholesale Inquiry
                  </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content-wrapper">
                  {activeTab === 'general' && (
                    <div className="tab-content">
                        <form onSubmit={handleSubmit}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ marginBottom: 0 }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-900" style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
                                  Name
                                </label>
                                <input
                                  type="text"
                                  id="name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  className="glass-input rounded-full"
                                  style={{
                                    width: '100%',
                                    paddingLeft: '1.5rem',
                                    paddingRight: '1.5rem',
                                    textAlign: 'left',
                                  }}
                                  placeholder="Your name"
                                  required
                                />
                              </div>
                            </div>
                            <div style={{ marginBottom: 0 }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-900" style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
                                  Email
                                </label>
                                <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  className="glass-input rounded-full"
                                  style={{
                                    width: '100%',
                                    paddingLeft: '1.5rem',
                                    paddingRight: '1.5rem',
                                    textAlign: 'left',
                                  }}
                                  placeholder="your.email@example.com"
                                  required
                                />
                              </div>
                            </div>
                            <div style={{ marginBottom: 0 }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label htmlFor="subject" className="block text-sm font-semibold text-gray-900" style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
                                  Subject
                                </label>
                                <input
                                  type="text"
                                  id="subject"
                                  name="subject"
                                  value={formData.subject}
                                  onChange={handleChange}
                                  className="glass-input rounded-full"
                                  style={{
                                    width: '100%',
                                    paddingLeft: '1.5rem',
                                    paddingRight: '1.5rem',
                                    textAlign: 'left',
                                  }}
                                  placeholder="What is this regarding?"
                                  required
                                />
                              </div>
                            </div>
                            <div style={{ marginBottom: 0 }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-900" style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
                                  Message
                                </label>
                                <textarea
                                  id="message"
                                  name="message"
                                  value={formData.message}
                                  onChange={handleChange}
                                  rows={5}
                                  className="glass-input rounded-[2rem] resize-none"
                                  style={{
                                    width: '100%',
                                    paddingLeft: '1.5rem',
                                    paddingRight: '1.5rem',
                                    paddingTop: '1rem',
                                    paddingBottom: '1rem',
                                    textAlign: 'left',
                                  }}
                                  placeholder="Your message..."
                                  required
                                />
                              </div>
                            </div>
                            <div style={{ marginTop: '0.5rem' }}>
                              <button
                                type="submit"
                                className="checkout-primary-button w-full"
                              >
                                Send Message
                              </button>
                            </div>
                          </div>
                        </form>
                    </div>
                  )}

                  {activeTab === 'wholesale' && (
                    <div className="tab-content">
                        {/* Why Partner Section */}
                        <div style={{ marginBottom: '2rem' }}>
                          <h3 className="contact-info-title" style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
                            Why Partner With Peliguard?
                          </h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
                            <div>
                              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📦</div>
                              <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem', color: '#111827' }}>
                                Reliable Supply Chain
                              </h4>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>
                                Consistent, on-time delivery with no supply disruptions
                              </p>
                            </div>
                            <div>
                              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✅</div>
                              <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem', color: '#111827' }}>
                                Quality Control
                              </h4>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>
                                Proprietary quality control ensures highest standards
                              </p>
                            </div>
                            <div>
                              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🇺🇸</div>
                              <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem', color: '#111827' }}>
                                Made in USA
                              </h4>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>
                                All products assembled in Independence, Louisiana
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Contact Form */}
                        <form onSubmit={handleSubmit}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ marginBottom: 0 }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label htmlFor="name-wholesale" className="block text-sm font-semibold text-gray-900" style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
                                  Name
                                </label>
                                <input
                                  type="text"
                                  id="name-wholesale"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  className="glass-input rounded-full"
                                  style={{
                                    width: '100%',
                                    paddingLeft: '1.5rem',
                                    paddingRight: '1.5rem',
                                    textAlign: 'left',
                                  }}
                                  placeholder="Your name"
                                  required
                                />
                              </div>
                            </div>
                            <div style={{ marginBottom: 0 }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label htmlFor="email-wholesale" className="block text-sm font-semibold text-gray-900" style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
                                  Email
                                </label>
                                <input
                                  type="email"
                                  id="email-wholesale"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  className="glass-input rounded-full"
                                  style={{
                                    width: '100%',
                                    paddingLeft: '1.5rem',
                                    paddingRight: '1.5rem',
                                    textAlign: 'left',
                                  }}
                                  placeholder="your.email@example.com"
                                  required
                                />
                              </div>
                            </div>
                            <div style={{ marginBottom: 0 }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label htmlFor="subject-wholesale" className="block text-sm font-semibold text-gray-900" style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
                                  Subject
                                </label>
                                <input
                                  type="text"
                                  id="subject-wholesale"
                                  name="subject"
                                  value={formData.subject}
                                  onChange={handleChange}
                                  className="glass-input rounded-full"
                                  style={{
                                    width: '100%',
                                    paddingLeft: '1.5rem',
                                    paddingRight: '1.5rem',
                                    textAlign: 'left',
                                  }}
                                  placeholder="What is this regarding?"
                                  required
                                />
                              </div>
                            </div>
                            <div style={{ marginBottom: 0 }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label htmlFor="message-wholesale" className="block text-sm font-semibold text-gray-900" style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
                                  Message
                                </label>
                                <textarea
                                  id="message-wholesale"
                                  name="message"
                                  value={formData.message}
                                  onChange={handleChange}
                                  rows={5}
                                  className="glass-input rounded-[2rem] resize-none"
                                  style={{
                                    width: '100%',
                                    paddingLeft: '1.5rem',
                                    paddingRight: '1.5rem',
                                    paddingTop: '1rem',
                                    paddingBottom: '1rem',
                                    textAlign: 'left',
                                  }}
                                  placeholder="Tell us about your wholesale needs..."
                                  required
                                />
                              </div>
                            </div>
                            <div style={{ marginTop: '0.5rem' }}>
                              <button
                                type="submit"
                                className="checkout-primary-button w-full"
                              >
                                Send Wholesale Inquiry
                              </button>
                            </div>
                          </div>
                        </form>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Contact Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ marginTop: '2rem' }}
            >
              <div className="glass-form-container">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                    <h3 className="contact-info-title">Email</h3>
                    <a 
                      href="mailto:sales@peliguard.com" 
                      className="contact-info-link"
                    >
                      sales@peliguard.com
                    </a>
                  </div>
                  <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    <h3 className="contact-info-title">Location</h3>
                    <div className="contact-info-address">
                      <p>51237 Mushroom Lane</p>
                      <p>Independence, LA 70443</p>
                    </div>
                  </div>
                  <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    <h3 className="contact-info-title">Visit Us</h3>
                    <p className="contact-info-description">
                      Feel free to stop by our facility in Independence, Louisiana if you're in the neighborhood. 
                      We welcome visitors.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
