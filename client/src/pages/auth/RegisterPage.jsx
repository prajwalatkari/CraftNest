import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Store, Mail, Lock, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      addToast('Please enter your name, email, and password', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (role === 'seller' && !shopName.trim()) {
      addToast('Please provide a name for your artisan shop', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        phone: phone.trim()
      };

      if (role === 'seller') {
        payload.shopName = shopName.trim();
        payload.shopDescription = shopDescription.trim();
      }

      const user = await register(payload);
      addToast(`Welcome to CraftNest, ${user.name}!`, 'success');

      if (role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '85vh', padding: '4rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '2.5rem',
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-floating)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/assets/craftnest-logo.svg"
            alt="CraftNest"
            style={{ height: '42px', margin: '0 auto 1rem auto' }}
          />
          <h1 style={{ fontSize: '1.8rem', color: 'var(--color-forest-green)', margin: '0 0 6px 0' }}>
            Join CraftNest
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Connect with independent artisans and conscious buyers across India
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            backgroundColor: 'var(--color-cream-light)',
            padding: '6px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            marginBottom: '1.75rem'
          }}
        >
          <button
            type="button"
            onClick={() => setRole('buyer')}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: role === 'buyer' ? '#fff' : 'transparent',
              color: role === 'buyer' ? 'var(--color-forest-green)' : 'var(--color-text-muted)',
              fontWeight: role === 'buyer' ? '700' : '500',
              boxShadow: role === 'buyer' ? 'var(--color-border-subtle)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.88rem'
            }}
          >
            <User size={16} />
            <span>I Want to Shop</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('seller')}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: role === 'seller' ? '#fff' : 'transparent',
              color: role === 'seller' ? 'var(--color-forest-green)' : 'var(--color-text-muted)',
              fontWeight: role === 'seller' ? '700' : '500',
              boxShadow: role === 'seller' ? 'var(--color-border-subtle)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.88rem'
            }}
          >
            <Store size={16} />
            <span>I Am a Maker / Seller</span>
          </button>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="e.g. Priya Sundaram"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password * (Min 6 characters)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
              placeholder="+91..."
            />
          </div>

          {/* Seller Specific Fields */}
          {role === 'seller' && (
            <div
              style={{
                backgroundColor: 'var(--color-forest-subtle)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                border: '1px solid rgba(53, 75, 54, 0.15)'
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--color-forest-green)', marginBottom: '0.75rem' }}>
                Artisan Shop Details
              </div>

              <div className="form-group">
                <label className="form-label">Shop / Studio Name *</label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Aarohi Botanicals & Candles"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Short Craft Story</label>
                <textarea
                  rows={2}
                  value={shopDescription}
                  onChange={(e) => setShopDescription(e.target.value)}
                  className="form-textarea"
                  placeholder="What makes your handmade creations special?"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-secondary btn-lg"
            style={{ width: '100%', marginBottom: '1.5rem', marginTop: '0.5rem' }}
          >
            <span>{isSubmitting ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight size={18} />
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-forest-green)', fontWeight: '700' }}>
              Sign In Here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
