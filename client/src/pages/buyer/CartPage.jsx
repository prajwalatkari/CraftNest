import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const navigate = useNavigate();

  const isCartEmpty = !cart.items || cart.items.length === 0;
  const freeShippingThreshold = cart.freeShippingThreshold || 999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const freeShippingProgress = Math.min(100, Math.round((cart.subtotal / freeShippingThreshold) * 100));

  if (isCartEmpty) {
    return (
      <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '80vh', padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div
            className="card"
            style={{
              padding: '4rem 2rem',
              backgroundColor: '#fff',
              border: '1px dashed var(--color-border)'
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-soft-beige)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                color: 'var(--color-forest-green)'
              }}
            >
              <ShoppingBag size={32} />
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Your Basket is Empty</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
              You haven't added any artisanal creations yet. Browse our handmade candle, crochet, and pottery collections!
            </p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              <span>Explore Marketplace</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '85vh', padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.4rem', margin: 0 }}>Your Shopping Basket</h1>
          <p style={{ margin: '0.35rem 0 0 0', color: 'var(--color-text-muted)' }}>
            Review your chosen handcrafted treasures before checkout
          </p>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.92rem' }}>
            <Truck size={18} color="var(--color-forest-green)" />
            {amountNeededForFreeShipping > 0 ? (
              <span>
                Add <strong style={{ color: 'var(--color-terracotta)' }}>₹{amountNeededForFreeShipping}</strong> more of
                handmade goods to unlock <strong>FREE Delivery</strong>!
              </span>
            ) : (
              <strong style={{ color: 'var(--color-success)' }}>
                🎉 Congratulations! You have unlocked FREE Pan-India Delivery!
              </strong>
            )}
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--color-soft-beige)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                backgroundColor: 'var(--color-forest-green)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Cart Layout: Items List + Summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start'
          }}
        >
          {/* Items Table / Cards */}
          <div
            style={{
              backgroundColor: '#fff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-subtle)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--color-border-subtle)',
                marginBottom: '1rem'
              }}
            >
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Basket Items ({cart.items.length})</h3>
              <button
                onClick={clearCart}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-error)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Clear All
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cart.items.map((item) => (
                <div
                  key={item._id || item.productId}
                  style={{
                    display: 'flex',
                    gap: '1.25rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    alignItems: 'center'
                  }}
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.slug || item.productId}`}
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      backgroundColor: 'var(--color-cream-light)',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Link>

                  {/* Info & Quantity */}
                  <div style={{ flex: 1 }}>
                    <span className="badge badge-forest" style={{ fontSize: '0.68rem', padding: '2px 8px', marginBottom: '4px' }}>
                      {item.category}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', margin: '4px 0' }}>
                      <Link to={`/product/${item.slug || item.productId}`} style={{ color: 'var(--color-dark-text)' }}>
                        {item.name}
                      </Link>
                    </h4>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-forest-green)', fontWeight: '700' }}>
                      ₹{item.price.toLocaleString('en-IN')} each
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-cream-light)'
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        style={{
                          width: '32px',
                          height: '32px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '700',
                          color: 'var(--color-forest-green)'
                        }}
                      >
                        -
                      </button>
                      <span style={{ width: '28px', textAlign: 'center', fontWeight: '700', fontSize: '0.88rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))}
                        disabled={item.quantity >= item.stock}
                        style={{
                          width: '32px',
                          height: '32px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '700',
                          color: 'var(--color-forest-green)'
                        }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--color-dark-text)' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-error)',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem'
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Link
                to="/shop"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'var(--color-forest-green)'
                }}
              >
                <ArrowLeft size={16} /> Continue Shopping for Crafts
              </Link>
            </div>
          </div>

          {/* Order Summary Box */}
          <div
            style={{
              backgroundColor: '#fff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-card)',
              position: 'sticky',
              top: '100px'
            }}
          >
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                <span>Crafts Subtotal</span>
                <span style={{ color: 'var(--color-dark-text)', fontWeight: '600' }}>
                  ₹{cart.subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                <span>Artisan Shipping</span>
                <span style={{ color: cart.shippingFee === 0 ? 'var(--color-success)' : 'var(--color-dark-text)', fontWeight: '600' }}>
                  {cart.shippingFee === 0 ? 'FREE' : `₹${cart.shippingFee}`}
                </span>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-forest-green)' }}>
                  Total Amount
                </span>
                <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-forest-green)', fontFamily: 'var(--font-sans)' }}>
                  ₹{cart.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-secondary btn-lg"
              style={{ width: '100%', marginBottom: '1.25rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div
              style={{
                backgroundColor: 'var(--color-cream-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="var(--color-forest-green)" />
                <span>Price & stock verified on server</span>
              </div>
              <div>• 100% Secure Checkout & Artisan Direct Payouts</div>
              <div>• Safe eco-friendly packaging included</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
