import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Store,
  Users,
  Package,
  ShoppingBag,
  IndianRupee,
  Clock,
  ShieldCheck,
  Save,
  CheckCircle2
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commissionRate, setCommissionRate] = useState(10);
  const [savingSettings, setSavingSettings] = useState(false);
  const { addToast } = useToast();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setData(res.data);
        if (res.data.settings?.commissionPercent !== undefined) {
          setCommissionRate(res.data.settings.commissionPercent);
        }
      }
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSaveCommission = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const res = await api.patch('/admin/settings', { commissionPercent: commissionRate });
      if (res.data.success) {
        addToast('Platform commission rate updated!', 'success');
        fetchDashboard();
      }
    } catch (err) {
      addToast('Failed to update platform settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p>Loading marketplace analytics...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];
  const recentUsers = data?.recentUsers || [];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-forest-green)' }}>
          Marketplace Control Center
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
          Platform metrics, seller approvals, revenue, and policy configuration
        </p>
      </div>

      {/* Top Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Platform GMV
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-forest-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest-green)' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-forest-green)', margin: '8px 0 2px 0' }}>
            ₹{stats.totalPlatformRevenue?.toLocaleString('en-IN') || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Gross merchandise value</div>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Commission Earned
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-terracotta-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-terracotta)' }}>
              <IndianRupee size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-terracotta)', margin: '8px 0 2px 0' }}>
            ₹{stats.totalCommissionEarned?.toLocaleString('en-IN') || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>At {stats.commissionPercent}% platform cut</div>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Makers & Sellers
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-cream-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest-green)' }}>
              <Store size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-dark-text)', margin: '8px 0 2px 0' }}>
            {stats.totalSellers || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {stats.pendingSellersCount ? `${stats.pendingSellersCount} pending approvals` : 'All accounts approved'}
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Marketplace Orders
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-forest-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest-green)' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-dark-text)', margin: '8px 0 2px 0' }}>
            {stats.totalOrders || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Across {stats.totalUsers || 0} registered members
          </div>
        </div>
      </div>

      {/* Commission Configuration Box */}
      <div
        className="card"
        style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          marginBottom: '2rem'
        }}
      >
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-forest-green)' }}>
          Marketplace Commission Configuration
        </h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          Configure the percentage commission deducted automatically on seller orders to maintain platform operations.
        </p>

        <form onSubmit={handleSaveCommission} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Platform Commission (%):</label>
            <input
              type="number"
              min="0"
              max="50"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="form-input"
              style={{ width: '100px', fontWeight: '700' }}
              required
            />
          </div>

          <button type="submit" disabled={savingSettings} className="btn btn-sm btn-primary">
            <Save size={15} />
            <span>{savingSettings ? 'Updating...' : 'Update Commission Rate'}</span>
          </button>
        </form>
      </div>

      {/* Two columns: Recent Orders & Recent Users */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem'
        }}
      >
        {/* Recent Orders */}
        <div className="card" style={{ backgroundColor: '#fff', padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Recent Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.82rem', color: 'var(--color-forest-green)', fontWeight: '700' }}>
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentOrders.map((ord) => (
              <div
                key={ord._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: 'var(--color-cream-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--color-forest-green)' }}>
                    #{ord.orderNumber}
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                    {ord.buyerId?.name || 'Customer'} • ₹{ord.total.toLocaleString('en-IN')}
                  </div>
                </div>
                <span className="badge badge-forest" style={{ fontSize: '0.7rem' }}>
                  {ord.orderStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registered Users */}
        <div className="card" style={{ backgroundColor: '#fff', padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Registered Users</h3>
            <Link to="/admin/users" style={{ fontSize: '0.82rem', color: 'var(--color-forest-green)', fontWeight: '700' }}>
              Manage Directory
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentUsers.map((u) => (
              <div
                key={u._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: 'var(--color-cream-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--color-dark-text)' }}>{u.name}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{u.email}</div>
                </div>
                <span
                  className={`badge ${
                    u.role === 'admin'
                      ? 'badge-terracotta'
                      : u.role === 'seller'
                      ? 'badge-forest'
                      : 'badge-cream'
                  }`}
                  style={{ fontSize: '0.7rem' }}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
