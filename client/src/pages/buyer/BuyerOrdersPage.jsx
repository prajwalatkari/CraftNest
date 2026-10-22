import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Clock, CheckCircle2, XCircle, ArrowRight, Star, AlertCircle } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const BuyerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my');
      if (res.data.success && res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching buyer orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be restored.')) {
      return;
    }
    try {
      const res = await api.patch(`/orders/${orderId}/cancel`);
      if (res.data.success) {
        addToast('Order cancelled successfully', 'info');
        fetchOrders();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not cancel order';
      addToast(msg, 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '85vh', padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
            <Link to="/" style={{ color: 'inherit' }}>Home</Link> /{' '}
            <span style={{ color: 'var(--color-terracotta)', fontWeight: '600' }}>My Orders & Tracking</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', margin: 0 }}>Order History</h1>
          <p style={{ margin: '0.35rem 0 0 0', color: 'var(--color-text-muted)' }}>
            Track the status of your handmade treasures from maker workshop to your doorstep
          </p>
        </div>

        {orders.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              backgroundColor: '#fff',
              border: '1px dashed var(--color-border)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-soft-beige)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                color: 'var(--color-forest-green)'
              }}
            >
              <Package size={28} />
            </div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>No orders placed yet</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Explore handcrafted items from our community of artisans and place your first order.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Discover Creations
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.map((order) => {
              const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);
              const isCancelled = order.orderStatus === 'Cancelled';
              const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

              return (
                <div
                  key={order._id}
                  className="card"
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-subtle)',
                    padding: '2rem'
                  }}
                >
                  {/* Top Header of Card */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      paddingBottom: '1.25rem',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Placed on{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--color-forest-green)' }}>
                        Order #{order.orderNumber}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span
                        className={`badge ${
                          isCancelled
                            ? 'badge-error'
                            : order.orderStatus === 'Delivered'
                            ? 'badge-success'
                            : 'badge-forest'
                        }`}
                        style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                      >
                        {order.orderStatus}
                      </span>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Total Amount</div>
                        <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--color-dark-text)' }}>
                          ₹{order.total.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Progression Stepper (if not cancelled) */}
                  {!isCancelled && (
                    <div style={{ marginBottom: '2rem', padding: '0.5rem 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        {/* Connecting background bar */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '14px',
                            left: '5%',
                            right: '5%',
                            height: '4px',
                            backgroundColor: 'var(--color-soft-beige)',
                            zIndex: 1
                          }}
                        />

                        {/* Completed progression line */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '14px',
                            left: '5%',
                            width: `${(Math.max(0, currentStepIndex) / (STATUS_STEPS.length - 1)) * 90}%`,
                            height: '4px',
                            backgroundColor: 'var(--color-forest-green)',
                            zIndex: 2,
                            transition: 'width 0.4s ease'
                          }}
                        />

                        {STATUS_STEPS.map((step, idx) => {
                          const isDone = idx <= currentStepIndex;
                          const isCurrent = idx === currentStepIndex;

                          return (
                            <div
                              key={step}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                zIndex: 3
                              }}
                            >
                              <div
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '50%',
                                  backgroundColor: isDone ? 'var(--color-forest-green)' : '#fff',
                                  border: '2px solid',
                                  borderColor: isDone ? 'var(--color-forest-green)' : 'var(--color-border)',
                                  color: isDone ? '#fff' : 'var(--color-text-muted)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.8rem',
                                  fontWeight: '700',
                                  marginBottom: '6px'
                                }}
                              >
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: isCurrent ? '700' : '500',
                                  color: isCurrent ? 'var(--color-forest-green)' : 'var(--color-text-muted)'
                                }}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          backgroundColor: 'var(--color-cream-light)',
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <img
                          src={item.imageSnapshot || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'}
                          alt={item.productNameSnapshot}
                          style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <Link
                            to={`/product/${item.productId}`}
                            style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-dark-text)' }}
                          >
                            {item.productNameSnapshot}
                          </Link>
                          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                            Qty: {item.quantity} × ₹{item.unitPriceSnapshot.toLocaleString('en-IN')}
                          </div>
                          <span className="badge badge-cream" style={{ fontSize: '0.68rem', marginTop: '4px' }}>
                            Status: {item.itemStatus}
                          </span>
                        </div>

                        {/* If order is Delivered, show "Write Review" link */}
                        {order.orderStatus === 'Delivered' && (
                          <Link
                            to={`/product/${item.productId}`}
                            className="btn btn-outline-terracotta btn-sm"
                            style={{ gap: '4px' }}
                          >
                            <Star size={14} />
                            <span>Review Craft</span>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Tracking & Address details footer */}
                  <div
                    style={{
                      borderTop: '1px solid var(--color-border-subtle)',
                      paddingTop: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      fontSize: '0.85rem',
                      color: 'var(--color-text-muted)'
                    }}
                  >
                    <div>
                      <strong>Deliver to:</strong> {order.shippingAddressSnapshot?.fullName} •{' '}
                      {order.shippingAddressSnapshot?.street}, {order.shippingAddressSnapshot?.city},{' '}
                      {order.shippingAddressSnapshot?.postalCode}
                    </div>

                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                      >
                        <XCircle size={15} />
                        <span>Cancel Order</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerOrdersPage;
