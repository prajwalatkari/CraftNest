import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  BarChart3,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SellerLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { label: 'Overview', path: '/seller/dashboard', icon: LayoutDashboard },
    { label: 'My Products', path: '/seller/products', icon: Package },
    { label: 'Orders & Fulfillment', path: '/seller/orders', icon: ShoppingBag },
    { label: 'Shop Profile', path: '/seller/shop', icon: Store },
    { label: 'Sales & Analytics', path: '/seller/analytics', icon: BarChart3 }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4EFE6' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#273828',
          color: 'var(--color-warm-cream)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 1000,
          transition: 'transform 0.3s ease',
          boxShadow: '4px 0 16px rgba(0,0,0,0.1)'
        }}
        className={`seller-sidebar ${sidebarOpen ? 'seller-sidebar-open' : ''}`}
      >
        {/* Brand Header */}
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
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer'
            }}
            className="sidebar-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Seller Shop Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(247, 241, 223, 0.1)' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B5C4B5' }}>
            Artisan Studio
          </div>
          <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#fff', marginTop: '2px' }}>
            {user?.sellerProfile?.shopName || `${user?.name}'s Workshop`}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-terracotta-light)', marginTop: '2px' }}>
            Seller Partner
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '1.25rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
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
                  backgroundColor: isActive ? 'rgba(169, 101, 72, 0.85)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
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
            <span>Marketplace Storefront</span>
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

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }} className="seller-main-wrapper">
        {/* Top Navbar */}
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
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--color-forest-green)',
                cursor: 'pointer'
              }}
              className="seller-mobile-toggle"
            >
              <Menu size={24} />
            </button>
            <h2 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--color-forest-green)' }}>
              Artisan Maker Dashboard
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/seller/products" className="btn btn-sm btn-primary">
              <Package size={15} />
              <span>+ Add Product</span>
            </Link>
          </div>
        </header>

        {/* Page Outlet */}
        <main style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .seller-sidebar {
            transform: translateX(-100%);
          }
          .seller-sidebar-open {
            transform: translateX(0) !important;
          }
          .seller-main-wrapper {
            margin-left: 0 !important;
          }
          .seller-mobile-toggle {
            display: block !important;
          }
          .sidebar-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SellerLayout;
