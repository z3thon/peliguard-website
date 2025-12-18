'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Images showing people wearing nitrile and vinyl gloves
  // TODO: Replace these placeholder URLs with actual images from stock photo sites
  // Recommended sites: Unsplash, Pexels, Pixabay, Rawpixel
  // Search terms: "nitrile gloves medical", "nitrile gloves food service", 
  // "vinyl gloves food service", "disposable gloves medical", "blue nitrile gloves"
  const productImages = [
    {
      src: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&q=80',
      alt: 'Medical professional wearing nitrile gloves',
      caption: 'Medical professionals trust Peliguard nitrile gloves'
    },
    {
      src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80',
      alt: 'Food service worker wearing gloves',
      caption: 'Food service workers rely on Peliguard vinyl gloves'
    },
    {
      src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&q=80',
      alt: 'Healthcare worker wearing protective gloves',
      caption: 'Quality protection for healthcare professionals'
    },
    {
      src: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=1200&q=80',
      alt: 'Chef wearing gloves preparing food',
      caption: 'FDA-approved gloves for food handling'
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <main className="min-h-screen">
      {/* Hero / Main Fold Section */}
      <section className="hero-section">
        <div className="hero-background-image-wrapper">
          <Image
            src="https://images.squarespace-cdn.com/content/v1/637f783c6a76884fff870b73/8ae3a38f-a83a-484d-8294-9b449419897b/iStock-1043592626.jpg"
            alt="American manufacturing facility"
            fill
            className="hero-background-image"
            priority
            unoptimized
          />
          <div className="hero-background-overlay" />
        </div>
        <div className="hero-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <h1 className="hero-heading">
              Protecting the American Workforce with Quality Protective Equipment
            </h1>
            <p className="hero-subheading">
              Made in Independence, Louisiana. We bring manufacturing back to America with transparent supply chains, 
              proprietary quality control, and reliable delivery you can count on.
            </p>
            <div className="hero-cta-group">
              <Link href="/contact" className="cta-primary">
                Get Started
              </Link>
              <Link href="#our-story" className="cta-secondary">
                Learn More
              </Link>
            </div>
            
            {/* Product Images Carousel */}
            <div className="hero-carousel-container">
              <div className="hero-carousel-wrapper">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="hero-carousel-slide"
                  >
                    <div className="hero-carousel-image-wrapper">
                      <Image
                        src={productImages[currentSlide].src}
                        alt={productImages[currentSlide].alt}
                        fill
                        className="hero-carousel-image"
                        priority={currentSlide === 0}
                        unoptimized
                      />
                      <div className="hero-carousel-overlay" />
                    </div>
                    <p className="hero-carousel-caption">{productImages[currentSlide].caption}</p>
                  </motion.div>
                </AnimatePresence>
                
                {/* Carousel Navigation Dots */}
                <div className="hero-carousel-dots">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`hero-carousel-dot ${index === currentSlide ? 'active' : ''}`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Social Proof Logos */}
            <div className="hero-logos">
              <div className="hero-logo-item">Trusted by American Manufacturers</div>
              <div className="hero-logo-item">ISO Certified</div>
              <div className="hero-logo-item">Made in USA</div>
              <div className="hero-logo-item">FDA Approved</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="clients-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2 className="section-title">Trusted by Industry Leaders</h2>
            <p className="section-subtitle">Peliguard protects workers across healthcare, food service, and manufacturing industries</p>
          </motion.div>
          
          <div className="clients-grid">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="client-category"
            >
              <h3 className="client-category-title">Healthcare</h3>
              <div className="client-logos-row">
                <div className="client-logo-placeholder">
                  <span className="client-logo-text">Hospitals</span>
                </div>
                <div className="client-logo-placeholder">
                  <span className="client-logo-text">Clinics</span>
                </div>
                <div className="client-logo-placeholder">
                  <span className="client-logo-text">Medical Centers</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="client-category"
            >
              <h3 className="client-category-title">Food Service</h3>
              <div className="client-logos-row">
                <div className="client-logo-placeholder">
                  <span className="client-logo-text">Restaurants</span>
                </div>
                <div className="client-logo-placeholder">
                  <span className="client-logo-text">Food Processing</span>
                </div>
                <div className="client-logo-placeholder">
                  <span className="client-logo-text">Catering Services</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="client-category"
            >
              <h3 className="client-category-title">Manufacturing</h3>
              <div className="client-logos-row">
                <div className="client-logo-placeholder">
                  <span className="client-logo-text">Industrial</span>
                </div>
                <div className="client-logo-placeholder">
                  <span className="client-logo-text">Distribution</span>
                </div>
                <div className="client-logo-placeholder">
                  <span className="client-logo-text">Wholesale</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="clients-note"
          >
            <p className="clients-note-text">
              <strong>Note:</strong> Add your actual client logos here. Contact us to learn more about becoming a Peliguard partner.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="features-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2 className="section-title">Key Features</h2>
            <p className="section-subtitle">Key benefits that matter. This isn't software—it's real protection.</p>
          </motion.div>

          <div className="features-grid">
            {[
              {
                icon: '🇺🇸',
                title: 'Made in USA',
                description: 'Assembled with pride in Independence, Louisiana by American workers'
              },
              {
                icon: '🛡️',
                title: 'Quality Assured',
                description: 'Proprietary quality control measures ensure highest safety standards'
              },
              {
                icon: '📦',
                title: 'Reliable Delivery',
                description: 'Consistent, on-time delivery with transparent supply chain management'
              },
              {
                icon: '✅',
                title: 'FDA Approved',
                description: 'All products meet FDA requirements and industry safety standards'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="feature-card"
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us? (Benefits) Section */}
      <section className="benefits-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2 className="section-title">Why Choose Peliguard?</h2>
            <p className="section-subtitle">Clear benefits - no vague promises.</p>
          </motion.div>

          <div className="benefits-grid">
            {[
              {
                title: 'Transparent Supply Chain',
                description: 'Know exactly where your protective equipment comes from. No hidden suppliers, no uncertainty.',
                image: '🔍'
              },
              {
                title: 'Support American Jobs',
                description: 'Every purchase supports American workers and families in Independence, Louisiana.',
                image: '👥'
              },
              {
                title: 'First Line of Defense',
                description: 'Our employees treat every product with care, knowing it protects your workforce.',
                image: '🛡️'
              },
              {
                title: 'Eliminate Market Uncertainty',
                description: 'Reliable delivery eliminates the supply chain disruptions plaguing the PPE market.',
                image: '📊'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="benefit-card"
              >
                <div className="benefit-image">{benefit.image}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="our-story" className="benefits-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2 className="section-title">Our Story</h2>
            <p className="section-subtitle">Protecting the American workforce with care and quality.</p>
          </motion.div>

          <div className="benefits-grid">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="benefit-card"
            >
              <div className="benefit-image">👥</div>
              <h3 className="benefit-title">Our Customers Are Our Neighbors</h3>
              <p className="benefit-description">
                At Peliguard, our focus is protecting the American workforce. Our customers are our neighbors, 
                and we treat every product that we produce with care knowing that it is the first line of defense.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="benefit-card"
            >
              <div className="benefit-image">✅</div>
              <h3 className="benefit-title">Quality Through Care</h3>
              <p className="benefit-description">
                Our employees take great pains to ensure that our focus and care translates directly into the 
                quality of our products. Every step is taken with precision and attention to detail.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="benefit-card"
            >
              <div className="benefit-image" style={{ position: 'relative', width: '100%', height: '200px', marginBottom: '1rem' }}>
                <Image
                  src="https://images.squarespace-cdn.com/content/v1/637f783c6a76884fff870b73/cc4c7fb0-47d1-4314-b3c7-1b4d9cf9cc3a/Capture.JPG"
                  alt="Peliguard facility in Independence, Louisiana"
                  fill
                  className="object-cover rounded-lg"
                  unoptimized
                />
              </div>
              <h3 className="benefit-title">Made in Independence, Louisiana</h3>
              <p className="benefit-description">
                Peliguard proudly assembles a full line of disposable protective equipment at our plant in 
                Independence, Louisiana. Feel free to stop by if you are in the neighborhood.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works? (Process) Section */}
      <section className="process-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Simple process in 3 easy steps.</p>
          </motion.div>

          <div className="process-steps">
            {[
              {
                step: '1',
                title: 'Contact Us',
                description: 'Reach out to discuss your protective equipment needs. We\'ll provide a customized quote based on your requirements.'
              },
              {
                step: '2',
                title: 'Quality Production',
                description: 'We manufacture your order at our facility in Independence, Louisiana with rigorous quality control at every step.'
              },
              {
                step: '3',
                title: 'Reliable Delivery',
                description: 'Receive your order on time, every time. Track your shipment with full transparency from production to delivery.'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="process-step"
              >
                <div className="process-step-number">{step.step}</div>
                <div className="process-step-image">📋</div>
                <h3 className="process-step-title">{step.title}</h3>
                <p className="process-step-description">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (Social Proof) Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-subtitle">Trusted by American manufacturers nationwide.</p>
          </motion.div>

          <div className="testimonials-grid">
            {[
              {
                name: 'Michael Chen',
                role: 'Operations Manager, Manufacturing Co.',
                rating: 5,
                text: 'Peliguard has transformed our supply chain. The transparency and reliability we get is unmatched. Knowing our equipment comes from Louisiana gives us confidence.'
              },
              {
                name: 'Sarah Johnson',
                role: 'Safety Director, Industrial Group',
                rating: 5,
                text: 'The quality control is exceptional. Every shipment meets our standards, and the on-time delivery eliminates the stress we used to have with other suppliers.'
              },
              {
                name: 'David Martinez',
                role: 'Procurement Lead, National Distributor',
                rating: 5,
                text: 'Supporting American manufacturing while getting superior products is a win-win. Peliguard\'s commitment to quality shows in every order.'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="testimonial-card"
              >
                <div className="testimonial-rating">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="testimonial-star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="testimonial-name">{testimonial.name}</div>
                    <div className="testimonial-role">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Clear answers to common questions.</p>
          </motion.div>

          <div className="faq-list">
            {[
              {
                question: 'Where are Peliguard products manufactured?',
                answer: 'All Peliguard products are assembled at our facility in Independence, Louisiana. We proudly support American workers and bring manufacturing back to the United States.'
              },
              {
                question: 'What quality standards do you meet?',
                answer: 'Our products meet FDA requirements and industry safety standards. We use proprietary quality control measures to ensure every product meets the highest standards of quality and safety.'
              },
              {
                question: 'What is your typical delivery time?',
                answer: 'Delivery times vary based on order size and product type. We provide reliable, on-time delivery with full transparency throughout the process. Contact us for specific delivery timelines.'
              },
              {
                question: 'Do you offer wholesale pricing?',
                answer: 'Yes, we offer wholesale pricing for bulk orders. Contact our sales team to discuss your specific needs and pricing options.'
              },
              {
                question: 'Can I visit your facility?',
                answer: 'Absolutely! We welcome visitors to our facility in Independence, Louisiana. Feel free to stop by if you\'re in the neighborhood. Contact us to schedule a visit.'
              },
              {
                question: 'What makes Peliguard different from other suppliers?',
                answer: 'We bring transparency, reliability, and accountability to the PPE supply chain. Our products are made in America by American workers, with proprietary quality control and supply chain management processes that eliminate market uncertainty.'
              }
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="faq-question-button"
                    aria-expanded={isOpen}
                  >
                    <h3 className="faq-question">{faq.question}</h3>
                    <motion.svg
                      className="faq-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="faq-answer-container"
                      >
                        <p className="faq-answer">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="cta-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="cta-content"
          >
            <h2 className="cta-heading">Ready to Protect Your Workforce?</h2>
            <p className="cta-text">
              Join American manufacturers who trust Peliguard for quality protective equipment.
            </p>
            <Link href="/contact" className="cta-button">
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
