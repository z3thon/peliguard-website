'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
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

  // Measure menu height before paint to ensure smooth animation
  useLayoutEffect(() => {
    if (menuRef.current) {
      const height = menuRef.current.scrollHeight;
      setMenuHeight(height);
    }
  });

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div 
      className="navbar-container"
      style={{ top: scrolled ? '0.5rem' : '0.75rem' }}
    >
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`navbar-pill glass-navbar ${isOpen ? 'navbar-pill-open' : ''}`}
      >
        <div className="navbar-content">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <div className="navbar-logo-image">
              <Image
                src="/Peliguard-Logotype-Color.png"
                alt="Peliguard"
                width={150}
                height={40}
                className="navbar-logo-img"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="navbar-links navbar-links-desktop">
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
            {/* Desktop CTA Button */}
            <Link href="/checkout" className="navbar-cta-button">
              Order Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="navbar-menu-button"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="navbar-menu-icon-wrapper"
            >
              <motion.svg
                className="navbar-menu-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={false}
              >
                {isOpen ? (
                  <motion.path
                    key="close"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  />
                ) : (
                  <motion.path
                    key="menu"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 6h16M4 12h16M4 18h16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </motion.svg>
            </motion.div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? menuHeight : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ 
            height: {
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            },
            opacity: {
              duration: 0.25,
              ease: [0.4, 0, 0.2, 1]
            }
          }}
          style={{ overflow: 'hidden' }}
        >
          <div ref={menuRef} className="navbar-mobile-menu">
            {navLinks.map((item, index) => {
              const active = isActive(item.href);
              return (
                <motion.div
                  key={item.href}
                  animate={{ opacity: isOpen ? 1 : 0 }}
                  transition={{ 
                    duration: 0.2,
                    delay: isOpen ? index * 0.03 : 0,
                    ease: [0.4, 0, 0.2, 1]
                  }}
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
            {/* Mobile CTA Button */}
            <motion.div
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ 
                duration: 0.2,
                delay: isOpen ? navLinks.length * 0.03 : 0,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="navbar-mobile-cta-button"
              >
                Order Now
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.nav>
    </div>
  );
}
