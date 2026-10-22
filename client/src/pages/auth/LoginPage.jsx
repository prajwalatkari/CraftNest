import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Store, User, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');

      if (user.role === 'seller') {
        navigate('/seller/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Account Helpers for seamless testing
  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '85vh', padding: '4rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '480px',
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
            Welcome Back
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Sign in to your CraftNest handmade account
          </p>
        </div>

        {/* Demo Account Pills for Testing */}
        <div
          style={{
            backgroundColor: 'var(--color-cream-light)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.75rem'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-forest-green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            ⚡ Instant Demo Login
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => fillDemo('priya@example.com', 'Buyer@123')}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.78rem', padding: '4px 8px' }}
            >
              <User size={13} /> Buyer (Priya)
            </button>

            <button
              type="button"
              onClick={() => fillDemo('aarohi@craftnest.in', 'Seller@123')}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.78rem', padding: '4px 8px' }}
            >
              <Store size={13} /> Seller (Aarohi)
            </button>

            <button
              type="button"
              onClick={() => fillDemo('admin@craftnest.in', 'Admin@123')}
              className="btn btn-sm btn-outline-terracotta"
              style={{ fontSize: '0.78rem', padding: '4px 8px' }}
            >
              <ShieldCheck size={13} /> Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="name@example.com"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Mail
                size={18}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Lock
                size={18}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: '1.5rem' }}
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--color-terracotta)', fontWeight: '700' }}>
              Create an Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
