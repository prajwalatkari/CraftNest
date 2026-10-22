import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Smartphone
} from 'lucide-react';
import api from '../../api/client';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const CheckoutPage = () => {
  const { cart, fetchCart, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Address form fields
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('TestCard');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill default user address if available
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setAddress({
        fullName: defaultAddr.fullName || user.name || '',
        phone: defaultAddr.phone || user.phone || '',
        street: defaultAddr.street || '',
        city: defaultAddr.city || '',
        state: defaultAddr.state || '',
        postalCode: defaultAddr.postalCode || '',
        country: defaultAddr.country || 'India'
      });
    }
  }, [user]);

  if (!cart.items || cart.items.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '80vh', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <h2>Your basket is empty</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '1rem 0 2rem 0' }}>
            Please add items to your basket before checking out.
          </p>
          <Link to="/shop" className="btn btn-primary">
            Explore Crafts
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validations
    if (!address.fullName.trim() || !address.phone.trim() || !address.street.trim() || !address.city.trim() || !address.postalCode.trim()) {
      setErrorMessage('Please fill in all mandatory delivery address fields.');
      addToast('Incomplete delivery address', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          name: item.name
        })),
        shippingAddress: address,
        paymentMethod,
        notes: notes.trim()
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success && res.data.order) {
        addToast('Order confirmed! CraftNest makers are notified.', 'success');
        await clearCart();
        navigate(`/order-success/${res.data.order._id}`, { state: { order: res.data.order } });
      }
    } catch (err) {
      console.error('Order creation error:', err);
      const msg = err.response?.data?.message || 'Failed to place order. Please check item availability.';
      setErrorMessage(msg);
      addToast(msg, 'error');
      // Re-fetch cart in case of stock race condition
      fetchCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '85vh', padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
            <Link to="/cart" style={{ color: 'inherit' }}>Basket</Link> /{' '}
            <span style={{ color: 'var(--color-terracotta)', fontWeight: '600' }}>Safe Checkout</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', margin: 0 }}>Checkout & Delivery</h1>
        </div>

        {errorMessage && (
          <div
            style={{
              backgroundColor: 'var(--color-error-bg)',
              color: 'var(--color-error)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid #F5C6CB'
            }}
          >
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2.5rem',
              alignItems: 'start'
            }}
          >
            {/* Left: Shipping Address + Payment Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Shipping Address Box */}
              <div
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  boxShadow: 'var(--shadow-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
                  <Truck size={20} color="var(--color-forest-green)" />
                  <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Delivery Address (India)</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Receiver's full name"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Mobile number for courier tracking"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Street Address & Flat / House No. *</label>
                    <input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Building, street name, locality"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="City / Town"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="State"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">PIN / Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={address.postalCode}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="6-digit PIN code"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={address.country}
                      readOnly
                      className="form-input"
                      style={{ backgroundColor: 'var(--color-cream-light)' }}
                    />
                  </div>
                </div>

                {/* Customization notes */}
                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <label className="form-label">
                    Artisan Customization Note / Gift Message (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="form-textarea"
                    placeholder="e.g. Please inscribe 'Ananya & Kabir 2026' or attach a birthday gift note."
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  boxShadow: 'var(--shadow-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
                  <Lock size={20} color="var(--color-forest-green)" />
                  <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Payment Method</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Test Card */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '1rem',
                      border: '2px solid',
                      borderColor: paymentMethod === 'TestCard' ? 'var(--color-forest-green)' : 'var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: paymentMethod === 'TestCard' ? 'var(--color-forest-subtle)' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="TestCard"
                      checked={paymentMethod === 'TestCard'}
                      onChange={() => setPaymentMethod('TestCard')}
                    />
                    <CreditCard size={20} color="var(--color-forest-green)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>
                        Instant Card Payment (Safe Sandbox Test Mode)
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        Simulates verified payment gateway without real charges.
                      </div>
                    </div>
                    <span className="badge badge-forest" style={{ fontSize: '0.68rem' }}>Instant</span>
                  </label>

                  {/* UPI Simulation */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '1rem',
                      border: '2px solid',
                      borderColor: paymentMethod === 'UPI' ? 'var(--color-forest-green)' : 'var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: paymentMethod === 'UPI' ? 'var(--color-forest-subtle)' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                    />
                    <Smartphone size={20} color="var(--color-forest-green)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>
                        UPI Simulation (Google Pay / PhonePe / Paytm / BHIM)
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        Instant QR / VPA sandbox simulation.
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '1rem',
                      border: '2px solid',
                      borderColor: paymentMethod === 'COD' ? 'var(--color-forest-green)' : 'var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: paymentMethod === 'COD' ? 'var(--color-forest-subtle)' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                    <Truck size={20} color="var(--color-forest-green)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>
                        Cash on Delivery (COD)
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        Pay cash upon arrival of your handmade parcel.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Preview & Button */}
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
                Items in Order ({cart.items.length})
              </h3>

              {/* Items Mini List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '4px' }}>
                {cart.items.map((it) => (
                  <div key={it._id || it.productId} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={it.images?.[0] || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'}
                      alt={it.name}
                      style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: '600', color: 'var(--color-dark-text)' }}>{it.name}</div>
                      <div style={{ color: 'var(--color-text-muted)' }}>Qty: {it.quantity}</div>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                      ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                  <span>Subtotal</span>
                  <span style={{ color: 'var(--color-dark-text)', fontWeight: '600' }}>₹{cart.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                  <span>Shipping</span>
                  <span style={{ color: cart.shippingFee === 0 ? 'var(--color-success)' : 'var(--color-dark-text)', fontWeight: '600' }}>
                    {cart.shippingFee === 0 ? 'FREE' : `₹${cart.shippingFee}`}
                  </span>
                </div>
                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-forest-green)' }}>Total to Pay</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-forest-green)' }}>
                    ₹{cart.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-secondary btn-lg"
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                <span>{isSubmitting ? 'Verifying & Placing Order...' : 'Confirm & Place Order'}</span>
                <ArrowRight size={18} />
              </button>

              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                By placing this order, you support independent Indian craft makers directly.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
