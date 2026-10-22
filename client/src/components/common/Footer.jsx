import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Send, Sparkles, ShieldCheck, Truck, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const { addToast } = useToast();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    if (!agreed) {
      addToast('Please consent to receiving CraftNest newsletter updates', 'error');
      return;
    }
    addToast('Welcome to CraftNest Stories! You have subscribed.', 'success');
    setEmail('');
    setAgreed(false);
  };

  return (
    <footer
      style={{
        backgroundColor: '#273828',
        color: 'var(--color-warm-cream)',
        borderTop: '3px solid var(--color-terracotta)',
        marginTop: 'auto',
        position: 'relative'
      }}
    >
      {/* Brand Value Pillars */}
      <div
        style={{
          borderBottom: '1px solid rgba(247, 241, 223, 0.12)',
          padding: '2.5rem 0'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(169, 101, 72, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-warm-cream)'
                }}
              >
                <Heart size={24} color="#F7F1DF" />
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', margin: 0 }}>100% Handmade</h4>
              <p style={{ color: '#C9D4C9', fontSize: '0.85rem', margin: 0 }}>
                Authentic creations made by independent makers & artisans.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(169, 101, 72, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-warm-cream)'
                }}
              >
                <Truck size={24} color="#F7F1DF" />
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', margin: 0 }}>Safe All-India Shipping</h4>
              <p style={{ color: '#C9D4C9', fontSize: '0.85rem', margin: 0 }}>
                Carefully packaged and delivered with tracking to your doorstep.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(169, 101, 72, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-warm-cream)'
                }}
              >
                <ShieldCheck size={24} color="#F7F1DF" />
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', margin: 0 }}>Verified Makers</h4>
              <p style={{ color: '#C9D4C9', fontSize: '0.85rem', margin: 0 }}>
                Every seller is vetted to ensure quality craftsmanship and ethics.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(169, 101, 72, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-warm-cream)'
                }}
              >
                <RefreshCw size={24} color="#F7F1DF" />
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', margin: 0 }}>Artisan Guarantee</h4>
              <p style={{ color: '#C9D4C9', fontSize: '0.85rem', margin: 0 }}>
                Direct support for handcrafted happiness and hassle-free returns.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '2.5rem'
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ marginBottom: '1.2rem' }}>
              <img
                src="/assets/craftnest-logo.svg"
                alt="CraftNest — Handmade with Heart"
                style={{
                  height: '48px',
                  width: 'auto',
                  filter: 'brightness(0) invert(1)' // crisp contrast on dark background
                }}
              />
            </div>
            <p style={{ color: '#D5DFD5', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.2rem' }}>
              CraftNest connects home-based creators and independent artisans with conscious shoppers looking for
              one-of-a-kind handmade treasures.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#B5C4B5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="#A96548" /> support@craftnest.in
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="#A96548" /> +91 98765 00001
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={15} color="#A96548" /> Bengaluru, Karnataka, India
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1.2rem', letterSpacing: '0.02em' }}>
              Categories
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/shop?category=Handmade%20Candles" style={{ color: '#D5DFD5', fontSize: '0.9rem' }}>
                  Handmade Candles
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Jewellery" style={{ color: '#D5DFD5', fontSize: '0.9rem' }}>
                  Artisanal Jewellery
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Crochet%20and%20Knitting" style={{ color: '#D5DFD5', fontSize: '0.9rem' }}>
                  Crochet & Knitting
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Home%20D%C3%A9cor" style={{ color: '#D5DFD5', fontSize: '0.9rem' }}>
                  Pottery & Home Décor
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Paintings%20and%20Art" style={{ color: '#D5DFD5', fontSize: '0.9rem' }}>
                  Paintings & Art
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Gift%20Hampers" style={{ color: '#D5DFD5', fontSize: '0.9rem' }}>
                  Curated Gift Hampers
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Policy */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1.2rem', letterSpacing: '0.02em' }}>
              Customer Care
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/about" style={{ color: '#D5DFD5', fontSize: '0.9rem' }}>
                  About CraftNest
                </Link>
              </li>
              <li>
                <Link to="/become-seller" style={{ color: '#D5DFD5', fontSize: '0.9rem' }}>
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" style={{ color: '#D5DFD5', fontSize: '0.9rem' }}>
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link to="/returns-policy" style={{ color: '#D5DFD5', fontSize: '0.9rem' }}>
                  Returns & Cancellations
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" style={{ color: '#D5DFD5', fontSize: '0.9rem' }}>
                  Privacy & Data Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#D5DFD5', fontSize: '0.9rem' }}>
                  Contact Artisan Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>
              CraftNest Stories
            </h4>
            <p style={{ color: '#D5DFD5', fontSize: '0.88rem', marginBottom: '1rem', lineHeight: '1.5' }}>
              Receive stories from independent makers, secret artisan discounts, and new collection launches.
            </p>
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.8rem 0.75rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(247, 241, 223, 0.25)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-terracotta)',
                    color: '#fff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Subscribe"
                >
                  <Send size={15} />
                </button>
              </div>

              {/* Consent checkbox */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '0.76rem',
                  color: '#B5C4B5',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ marginTop: '2px' }}
                />
                <span>I agree to receive handmade inspiration and accept the privacy policy.</span>
              </label>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div
        style={{
          borderTop: '1px solid rgba(247, 241, 223, 0.1)',
          padding: '1.25rem 0',
          fontSize: '0.82rem',
          color: '#A0B0A0',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            © {new Date().getFullYear()} CraftNest Marketplace. Handmade with Heart. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/privacy-policy" style={{ color: '#A0B0A0' }}>Privacy</Link>
            <Link to="/returns-policy" style={{ color: '#A0B0A0' }}>Terms</Link>
            <Link to="/shipping-policy" style={{ color: '#A0B0A0' }}>Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
