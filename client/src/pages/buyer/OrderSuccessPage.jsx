import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home, Truck, Heart } from 'lucide-react';
import api from '../../api/client';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${id}`);
          if (res.data.success && res.data.order) {
            setOrder(res.data.order);
          }
        } catch (err) {
          console.error('Error fetching order:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '85vh', padding: '4rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div
          className="card"
          style={{
            padding: '3rem 2.5rem',
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-floating)',
            textAlign: 'center'
          }}
        >
          {/* Success Check Icon */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-forest-subtle)',
              color: 'var(--color-forest-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}
          >
            <CheckCircle2 size={44} />
          </div>

          <span className="badge badge-forest" style={{ marginBottom: '1rem', padding: '6px 14px' }}>
            Handmade with Heart
          </span>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', color: 'var(--color-forest-green)' }}>
            Thank You for Supporting Artisans!
          </h1>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Your order has been received and confirmed. Independent makers have been notified and will begin preparing
            your handcrafted items with mindful care.
          </p>

          {/* Order Details Card */}
          {order && (
            <div
              style={{
                backgroundColor: 'var(--color-cream-light)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'left',
                marginBottom: '2.5rem'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  paddingBottom: '0.75rem',
                  marginBottom: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Order Reference</div>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--color-forest-green)' }}>
                    {order.orderNumber}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Total Amount</div>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--color-dark-text)' }}>
                    ₹{order.total?.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
                <div>
                  <strong>Deliver To:</strong> {order.shippingAddressSnapshot?.fullName} •{' '}
                  {order.shippingAddressSnapshot?.street}, {order.shippingAddressSnapshot?.city},{' '}
                  {order.shippingAddressSnapshot?.state} - {order.shippingAddressSnapshot?.postalCode}
                </div>
                <div>
                  <strong>Payment Method:</strong> {order.paymentMethod} ({order.paymentStatus})
                </div>
                <div>
                  <strong>Estimated Delivery:</strong> Within 4–7 business days across India
                </div>
              </div>
            </div>
          )}

          {/* Action Links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/buyer/orders" className="btn btn-primary btn-lg">
              <Package size={18} />
              <span>Track in My Orders</span>
            </Link>

            <Link to="/shop" className="btn btn-outline btn-lg">
              <span>Continue Shopping</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
