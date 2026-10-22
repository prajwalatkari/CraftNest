import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Store,
  ArrowRight,
  Send
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AboutPage = () => (
  <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '85vh', padding: '4rem 0 6rem 0' }}>
    <div className="container" style={{ maxWidth: '850px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge badge-forest" style={{ marginBottom: '1rem', padding: '6px 14px' }}>
          Our Story & Vision
        </span>
        <h1 style={{ fontSize: '2.8rem', color: 'var(--color-forest-green)', marginBottom: '1rem' }}>
          CraftNest — Handmade with Heart
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
          Celebrating independent Indian makers, traditional craftsmanship, and mindful slow living.
        </p>
      </div>

      <div
        className="card"
        style={{
          padding: '2.5rem',
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-xl)',
          lineHeight: '1.8',
          fontSize: '1rem',
          color: 'var(--color-dark-text)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}
      >
        <p>
          In a world increasingly dominated by mass assembly lines and disposable plastic, <strong>CraftNest</strong> was
          founded with a singular belief: that everyday objects should carry soul, texture, and the warmth of human hands.
        </p>

        <h3 style={{ fontSize: '1.4rem', color: 'var(--color-forest-green)' }}>Our Mission</h3>
        <p>
          We bridge the gap between skilled home-based creators—from potters in Rajasthan and fiber artists in Gujarat to
          botanical candle makers in Karnataka—and conscious patrons who appreciate authentic craftsmanship. By ensuring
          transparent commission rates (90% payout to makers), we empower artisans to sustain their livelihoods and preserve
          heritage crafts.
        </p>

        <h3 style={{ fontSize: '1.4rem', color: 'var(--color-forest-green)' }}>The CraftNest Promise</h3>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li><strong>100% Authentic Handcrafted:</strong> Every item listed is created by independent hands.</li>
          <li><strong>Verified Makers:</strong> All seller studios are vetted for material purity and ethical processes.</li>
          <li><strong>Pan-India Safe Courier:</strong> Sustainable, protective packaging to ensure intact delivery.</li>
        </ul>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/shop" className="btn btn-primary btn-lg">
            <span>Explore Artisan Creations</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export const BecomeSellerPage = () => (
  <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '85vh', padding: '4rem 0 6rem 0' }}>
    <div className="container" style={{ maxWidth: '850px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge badge-terracotta" style={{ marginBottom: '1rem', padding: '6px 14px' }}>
          Artisan Community
        </span>
        <h1 style={{ fontSize: '2.8rem', color: 'var(--color-forest-green)', marginBottom: '1rem' }}>
          Turn Your Craft into a Thriving Business
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
          Join over 100+ independent makers selling handmade candles, crochet, jewellery, pottery, and art across India.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}
      >
        <div className="card" style={{ padding: '1.75rem', backgroundColor: '#fff', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-forest-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: 'var(--color-forest-green)' }}>
            <Store size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Your Custom Storefront</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
            Showcase your unique brand identity, artisan bio, and catalogue of creations.
          </p>
        </div>

        <div className="card" style={{ padding: '1.75rem', backgroundColor: '#fff', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-terracotta-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: 'var(--color-terracotta)' }}>
            <Sparkles size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>90% Payout Rate</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
            Keep 90% of all gross sales with complete transparent accounting and zero hidden fees.
          </p>
        </div>

        <div className="card" style={{ padding: '1.75rem', backgroundColor: '#fff', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-cream-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: 'var(--color-forest-green)' }}>
            <Truck size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Pan-India Patrons</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
            Reach conscious buyers seeking personalized gifts and genuine artisanal products.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to="/register?role=seller" className="btn btn-secondary btn-lg">
          <span>Apply as an Artisan Maker</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  </div>
);

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Thank you! Your message has been sent to CraftNest Support.', 'success');
    setName('');
    setEmail('');
    setMsg('');
  };

  return (
    <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '85vh', padding: '4rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--color-forest-green)' }}>Contact Artisan Support</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Have questions about a maker’s product, your delivery, or custom commissions?
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem', backgroundColor: '#fff', borderRadius: 'var(--radius-xl)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Your Message / Inquiry</label>
              <textarea
                rows={4}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="form-textarea"
                placeholder="How can we assist you today?"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              <Send size={18} />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const ShippingPolicyPage = () => (
  <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '85vh', padding: '4rem 0 6rem 0' }}>
    <div className="container" style={{ maxWidth: '780px' }}>
      <h1 style={{ fontSize: '2.4rem', marginBottom: '1.5rem', color: 'var(--color-forest-green)' }}>
        Shipping & Delivery Policy
      </h1>
      <div className="card" style={{ padding: '2rem', backgroundColor: '#fff', lineHeight: '1.8' }}>
        <p><strong>Processing Time:</strong> As every item is crafted by hand, artisans require 1–4 business days to prepare, inspect, and package your order.</p>
        <p><strong>Shipping Charges:</strong> We provide <strong>FREE standard delivery</strong> on all orders above ₹999. For orders below ₹999, a nominal flat fee of ₹79 is applied.</p>
        <p><strong>Delivery Timelines:</strong> Standard tracked courier delivery takes 3–7 business days depending on your delivery PIN code across India.</p>
        <p><strong>Courier Partners:</strong> We partner with trusted courier networks including BlueDart, Delhivery, and India Post for reliable tracking.</p>
      </div>
    </div>
  </div>
);

export const ReturnsPolicyPage = () => (
  <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '85vh', padding: '4rem 0 6rem 0' }}>
    <div className="container" style={{ maxWidth: '780px' }}>
      <h1 style={{ fontSize: '2.4rem', marginBottom: '1.5rem', color: 'var(--color-forest-green)' }}>
        Returns & Replacement Policy
      </h1>
      <div className="card" style={{ padding: '2rem', backgroundColor: '#fff', lineHeight: '1.8' }}>
        <p><strong>Artisan Guarantee:</strong> If a handmade item arrives broken, defective, or incorrect, please notify us within <strong>7 days</strong> of delivery with a photograph to receive an immediate free replacement or refund.</p>
        <p><strong>Personalized Products:</strong> Custom items with engraved names or made-to-order dimensions cannot be returned unless damaged during transit.</p>
        <p><strong>Cancellations:</strong> Orders can be cancelled from your Buyer Dashboard at any time before the artisan has marked the order as Shipped.</p>
      </div>
    </div>
  </div>
);

export const PrivacyPolicyPage = () => (
  <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '85vh', padding: '4rem 0 6rem 0' }}>
    <div className="container" style={{ maxWidth: '780px' }}>
      <h1 style={{ fontSize: '2.4rem', marginBottom: '1.5rem', color: 'var(--color-forest-green)' }}>
        Privacy & Data Protection Policy
      </h1>
      <div className="card" style={{ padding: '2rem', backgroundColor: '#fff', lineHeight: '1.8' }}>
        <p>CraftNest respects your privacy. We strictly do not sell or rent personal information to third-party advertisers.</p>
        <p>Your address and telephone contact details are used solely for courier delivery fulfillment and order status notifications.</p>
        <p>All passwords are encrypted with industry-standard bcrypt hashing, and credit card or sensitive payment details are processed through secure sandbox gateways without storing card numbers directly.</p>
      </div>
    </div>
  </div>
);
