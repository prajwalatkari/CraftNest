import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import api from '../../api/client';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/admin/orders', { params });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p>Loading all marketplace transactions...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-forest-green)' }}>
            Marketplace Orders Monitor ({orders.length})
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
            Inspect all transactions, order statuses, and platform commission breakdown
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', fontSize: '0.88rem', padding: '6px 12px' }}
          >
            <option value="">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div
        className="card"
        style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-cream-light)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px' }}>Order Ref</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Buyer Name</th>
                <th style={{ padding: '12px 16px' }}>Gross Total</th>
                <th style={{ padding: '12px 16px' }}>Platform Cut</th>
                <th style={{ padding: '12px 16px' }}>Artisan Payout</th>
                <th style={{ padding: '12px 16px' }}>Payment</th>
                <th style={{ padding: '12px 16px' }}>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord._id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--color-forest-green)' }}>
                    #{ord.orderNumber}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                    {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {ord.buyerId?.name || ord.shippingAddressSnapshot?.fullName || 'Customer'}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '700' }}>
                    ₹{ord.total.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-terracotta)', fontWeight: '700' }}>
                    ₹{(ord.commissionAmount || Math.round(ord.subtotal * 0.1)).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-forest-green)', fontWeight: '600' }}>
                    ₹{(ord.sellerEarnings || Math.round(ord.subtotal * 0.9)).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-cream" style={{ fontSize: '0.7rem' }}>
                      {ord.paymentMethod} ({ord.paymentStatus})
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      className={`badge ${
                        ord.orderStatus === 'Delivered'
                          ? 'badge-success'
                          : ord.orderStatus === 'Cancelled'
                          ? 'badge-error'
                          : 'badge-forest'
                      }`}
                      style={{ fontSize: '0.72rem' }}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
