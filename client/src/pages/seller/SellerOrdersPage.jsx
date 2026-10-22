import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, CheckCircle2, Clock, MapPin, User, ChevronDown } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/seller/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching seller orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, itemId, newStatus) => {
    try {
      setUpdatingId(itemId);
      const res = await api.patch(`/seller/orders/${orderId}/items/${itemId}/status`, {
        status: newStatus
      });

      if (res.data.success) {
        addToast(`Item status updated to ${newStatus}`, 'success');
        fetchOrders();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update item status';
      addToast(msg, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p>Loading order fulfillments...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-forest-green)' }}>
          Order Fulfillment ({orders.length})
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
          Manage packing, courier dispatch, and delivery updates for your creations
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
            <ShoppingBag size={28} />
          </div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No orders to fulfill yet</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>
            When customers purchase your handcrafted items, orders will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {orders.map((order) => (
            <div
              key={order._id}
              className="card"
              style={{
                backgroundColor: '#fff',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-subtle)'
              }}
            >
              {/* Order Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  paddingBottom: '1rem',
                  marginBottom: '1.25rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: '800', fontSize: '1.15rem', color: 'var(--color-forest-green)' }}>
                    Order #{order.orderNumber}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Ordered on{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Your Item Subtotal</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-dark-text)' }}>
                    ₹{order.sellerSubtotal?.toLocaleString('en-IN')}
                  </div>
                  <span className="badge badge-cream" style={{ fontSize: '0.68rem', marginTop: '2px' }}>
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Delivery Address & Customer Snapshot */}
              <div
                style={{
                  backgroundColor: 'var(--color-cream-light)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={16} color="var(--color-forest-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Shipping Destination:</strong>
                    <div>
                      {order.shippingAddress?.fullName} ({order.shippingAddress?.phone})
                    </div>
                    <div>
                      {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} -{' '}
                      {order.shippingAddress?.postalCode}
                    </div>
                  </div>
                </div>

                {order.buyer && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} color="var(--color-terracotta)" />
                    <div>
                      <strong>Buyer Account:</strong> {order.buyer.name} ({order.buyer.email})
                    </div>
                  </div>
                )}
              </div>

              {/* Items List with Status Change Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-subtle)',
                      backgroundColor: '#fff'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={item.imageSnapshot || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'}
                        alt={item.productNameSnapshot}
                        style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--color-dark-text)' }}>
                          {item.productNameSnapshot}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          Qty: {item.quantity} × ₹{item.unitPriceSnapshot.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Status Dropdown Control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                        Status:
                      </span>
                      <select
                        value={item.itemStatus}
                        onChange={(e) => handleStatusChange(order._id, item._id, e.target.value)}
                        disabled={updatingId === item._id || item.itemStatus === 'Cancelled'}
                        className="form-select"
                        style={{
                          padding: '5px 12px',
                          fontSize: '0.82rem',
                          width: 'auto',
                          fontWeight: '700',
                          backgroundColor:
                            item.itemStatus === 'Delivered'
                              ? 'var(--color-success-bg)'
                              : item.itemStatus === 'Shipped'
                              ? '#E3F2FD'
                              : 'var(--color-cream-light)'
                        }}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrdersPage;
