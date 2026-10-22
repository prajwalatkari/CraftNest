import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  Sliders,
  BarChart3,
  ArrowLeft,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Sellers & Approvals', path: '/admin/sellers', icon: Store },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Marketplace Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Revenue & Commission', path: '/admin/reports', icon: BarChart3 }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4EFE6' }}>
      {/* Admin Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#1E291F',
          color: 'var(--color-warm-cream)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 1000,
          transition: 'transform 0.3s ease',
          boxShadow: '4px 0 16px rgba(0,0,0,0.15)'
        }}
        className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : ''}`}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(247, 241, 223, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/assets/craftnest-logo.svg"
              alt="CraftNest"
              style={{ height: '36px', filter: 'brightness(0) invert(1)' }}
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            className="admin-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin Badge */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(247, 241, 223, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-terracotta)' }}>
            <ShieldCheck size={16} />
            <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Administration
            </span>
          </div>
          <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#fff', marginTop: '2px' }}>
            {user?.name || 'Administrator'}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '1.25rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#fff' : '#C9D4C9',
                  backgroundColor: isActive ? 'var(--color-terracotta)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(247, 241, 223, 0.15)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            to="/shop"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.88rem',
              color: 'var(--color-warm-cream)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <ArrowLeft size={16} />
            <span>Marketplace Store</span>
          </Link>

          <button
            onClick={() => { logout(); navigate('/'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.88rem',
              color: '#FF8A80',
              background: 'none',
              border: 'none',
              padding: '8px 12px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Outlet Wrapper */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }} className="admin-main-wrapper">
        <header
          style={{
            height: '68px',
            backgroundColor: '#fff',
            borderBottom: '1px solid var(--color-border)',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 900
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ display: 'none', background: 'none', border: 'none', color: 'var(--color-forest-green)', cursor: 'pointer' }}
              className="admin-mobile-toggle"
            >
              <Menu size={24} />
            </button>
            <h2 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--color-forest-green)' }}>
              Marketplace Administration & Control
            </h2>
          </div>
          <span className="badge badge-terracotta" style={{ padding: '6px 14px' }}>
            Super Admin
          </span>
        </header>

        <main style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar-open {
            transform: translateX(0) !important;
          }
          .admin-main-wrapper {
            margin-left: 0 !important;
          }
          .admin-mobile-toggle {
            display: block !important;
          }
          .admin-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
