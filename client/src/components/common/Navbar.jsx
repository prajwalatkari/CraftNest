import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Store,
  ShieldCheck,
  Package,
  LogOut,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, isSeller, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
      {/* Top Announcement Bar */}
      <div
        style={{
          backgroundColor: 'var(--color-forest-dark)',
          color: 'var(--color-warm-cream)',
          fontSize: '0.82rem',
          padding: '7px 1rem',
          textAlign: 'center',
          fontWeight: '500',
          letterSpacing: '0.04em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <Sparkles size={14} color="#D4AF37" />
        <span>Handmade with Heart • Free shipping across India on orders above ₹999</span>
        <span style={{ opacity: 0.6, margin: '0 6px' }}>|</span>
        <Link
          to="/shop"
          style={{
            color: '#F7F1DF',
            textDecoration: 'underline',
            fontWeight: '600'
          }}
        >
          Explore Crafts
        </Link>
      </div>

      {/* Main Navbar */}
      <nav
        style={{
          backgroundColor: 'rgba(247, 241, 223, 0.96)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--color-border)',
          transition: 'all 0.3s ease'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '78px',
            gap: '1.5rem'
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0
            }}
          >
            <img
              src="/assets/craftnest-logo.svg"
              alt="CraftNest — Handmade with Heart"
              style={{
                height: '48px',
                width: 'auto',
                display: 'block'
              }}
            />
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              flex: 1,
              maxWidth: '460px',
              position: 'relative',
              display: 'none',
              margin: '0 1rem'
            }}
            className="desktop-search-form"
          >
            <input
              type="text"
              placeholder="Search candles, pottery, crochet, gifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.6rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-cream-light)',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-dark-text)'
              }}
            />
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                pointerEvents: 'none'
              }}
            />
          </form>

          {/* Nav Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}
            className="desktop-nav-links"
          >
            <Link
              to="/shop"
              style={{
                color: location.pathname === '/shop' ? 'var(--color-terracotta)' : 'var(--color-dark-text)',
                transition: 'color 0.2s ease'
              }}
            >
              Shop All
            </Link>

            <Link
              to="/shop?category=Handmade%20Candles"
              style={{
                color: 'var(--color-dark-text)'
              }}
            >
              Candles
            </Link>

            <Link
              to="/shop?category=Crochet%20and%20Knitting"
              style={{
                color: 'var(--color-dark-text)'
              }}
            >
              Crochet
            </Link>

            {!isSeller && !isAdmin && (
              <Link
                to="/become-seller"
                style={{
                  color: 'var(--color-forest-green)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Store size={16} />
                <span>Sell on CraftNest</span>
              </Link>
            )}
          </div>

          {/* Right Action Icons & Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Wishlist */}
            <Link
              to="/buyer/wishlist"
              className="btn-icon"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-dark-text)',
                backgroundColor: 'var(--color-soft-beige)',
                borderRadius: '50%',
                width: '42px',
                height: '42px'
              }}
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    backgroundColor: 'var(--color-terracotta)',
                    color: '#fff',
                    borderRadius: '50%',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    width: '19px',
                    height: '19px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="btn-icon"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                backgroundColor: 'var(--color-forest-green)',
                borderRadius: '50%',
                width: '42px',
                height: '42px'
              }}
              title="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: 'var(--color-terracotta)',
                    color: '#fff',
                    borderRadius: '50%',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account Dropdown / Login */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    padding: '5px 12px 5px 6px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-forest-light)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.85rem'
                    }}
                  >
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      color: 'var(--color-dark-text)',
                      maxWidth: '90px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="var(--color-text-muted)" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '115%',
                      width: '220px',
                      backgroundColor: '#fff',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-floating)',
                      border: '1px solid var(--color-border-subtle)',
                      padding: '8px 0',
                      zIndex: 1010
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 16px',
                        borderBottom: '1px solid var(--color-border-subtle)'
                      }}
                    >
                      <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--color-dark-text)' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {user.email}
                      </div>
                      <span
                        className={`badge ${
                          user.role === 'admin'
                            ? 'badge-terracotta'
                            : user.role === 'seller'
                            ? 'badge-forest'
                            : 'badge-cream'
                        }`}
                        style={{ marginTop: '6px' }}
                      >
                        {user.role}
                      </span>
                    </div>

                    {/* Buyer links */}
                    <Link
                      to="/buyer/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '0.88rem',
                        color: 'var(--color-dark-text)'
                      }}
                    >
                      <Package size={16} /> My Orders
                    </Link>

                    <Link
                      to="/buyer/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '0.88rem',
                        color: 'var(--color-dark-text)'
                      }}
                    >
                      <UserIcon size={16} /> Account Profile
                    </Link>

                    {/* Seller Link */}
                    {isSeller && (
                      <Link
                        to="/seller/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 16px',
                          fontSize: '0.88rem',
                          color: 'var(--color-forest-green)',
                          fontWeight: '600',
                          backgroundColor: 'var(--color-forest-subtle)'
                        }}
                      >
                        <Store size={16} /> Seller Studio
                      </Link>
                    )}

                    {/* Admin Link */}
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 16px',
                          fontSize: '0.88rem',
                          color: 'var(--color-terracotta)',
                          fontWeight: '600',
                          backgroundColor: 'var(--color-terracotta-light)'
                        }}
                      >
                        <ShieldCheck size={16} /> Admin Panel
                      </Link>
                    )}

                    <div style={{ borderTop: '1px solid var(--color-border-subtle)', margin: '4px 0' }} />

                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '0.88rem',
                        color: 'var(--color-error)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Join
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-forest-green)',
                padding: '6px'
              }}
              className="mobile-hamburger-btn"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: 'var(--color-warm-cream)',
              borderTop: '1px solid var(--color-border)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search handmade items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#fff',
                  fontSize: '0.9rem'
                }}
              />
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)'
                }}
              />
            </form>

            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem', fontWeight: '600' }}
            >
              Explore All Crafts
            </Link>
            <Link
              to="/shop?category=Handmade%20Candles"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem' }}
            >
              Handmade Candles
            </Link>
            <Link
              to="/shop?category=Jewellery"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem' }}
            >
              Jewellery
            </Link>
            <Link
              to="/shop?category=Crochet%20and%20Knitting"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem' }}
            >
              Crochet & Knitting
            </Link>
            <Link
              to="/shop?category=Home%20D%C3%A9cor"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem' }}
            >
              Home Décor
            </Link>
            <Link
              to="/become-seller"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1.05rem',
                fontWeight: '600',
                color: 'var(--color-forest-green)'
              }}
            >
              Become a Seller
            </Link>
          </div>
        )}
      </nav>

      {/* Responsive CSS styling for nav */}
      <style>{`
        @media (min-width: 820px) {
          .desktop-search-form { display: block !important; }
        }
        @media (max-width: 820px) {
          .desktop-nav-links { display: none !important; }
          .mobile-hamburger-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
