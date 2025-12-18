'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Desktop & Tablet Navbar - Floating Pill */}
      {!isMobile && (
        <div 
          className="navbar-container"
          style={{ top: scrolled ? '1rem' : '1.5rem' }}
        >
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="navbar-pill"
          >
            <div className="navbar-content">
              {/* Logo */}
              <Link href="/" className="navbar-logo">
                <div className="navbar-logo-image">
                  <Image
                    src="https://images.squarespace-cdn.com/content/v1/637f783c6a76884fff870b73/035599f5-c8b9-45ac-8f0d-37519415b5ba/Peliguard-Icon-Color.png?format=1500w"
                    alt="Peliguard"
                    width={32}
                    height={32}
                    className="navbar-logo-img"
                    priority
                    unoptimized
                    style={{ maxWidth: '32px', maxHeight: '32px' }}
                  />
                </div>
                <span className="navbar-logo-text">Peliguard</span>
              </Link>

              {/* Navigation Links */}
              <div className="navbar-links">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`navbar-link ${active ? 'navbar-link-active' : ''}`}
                    >
                      {link.label}
                      {active && <span className="navbar-underline" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.nav>
        </div>
      )}

      {/* Mobile Navbar */}
      {isMobile && (
        <div className="navbar-mobile-container">
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="navbar-mobile"
          >
            <div className="navbar-mobile-header">
              {/* Logo */}
              <Link href="/" className="navbar-logo">
                <div className="navbar-logo-image">
                  <Image
                    src="https://images.squarespace-cdn.com/content/v1/637f783c6a76884fff870b73/035599f5-c8b9-45ac-8f0d-37519415b5ba/Peliguard-Icon-Color.png?format=1500w"
                    alt="Peliguard"
                    width={28}
                    height={28}
                    className="navbar-logo-img"
                    priority
                    unoptimized
                    style={{ maxWidth: '28px', maxHeight: '28px' }}
                  />
                </div>
                <span className="navbar-logo-text">Peliguard</span>
              </Link>

              {/* Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="navbar-menu-button"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <motion.svg
                  className="navbar-menu-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </motion.svg>
              </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="navbar-mobile-menu"
                >
                  {navLinks.map((item, index) => {
                    const active = isActive(item.href);
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`navbar-mobile-link ${active ? 'navbar-mobile-link-active' : ''}`}
                        >
                          {item.label}
                          {active && <span className="navbar-mobile-underline" />}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        </div>
      )}
    </>
  );
}
