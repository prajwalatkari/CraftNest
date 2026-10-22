import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle,
  IndianRupee,
  Layers
} from 'lucide-react';
import api from '../../api/client';

const SellerDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/seller/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching seller dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p>Loading your workshop metrics...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const lowStock = data?.lowStockProducts || [];
  const recentOrders = data?.recentOrders || [];
  const chartData = data?.chartData || [];

  const maxSaleInChart = Math.max(...chartData.map(d => d.sales), 1000);

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-forest-green)' }}>
          Workshop Overview
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
          Real-time metrics calculated directly from verified customer orders
        </p>
      </div>

      {/* Key Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        {/* Gross Sales */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Gross Sales
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-forest-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest-green)' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-forest-green)', margin: '8px 0 2px 0' }}>
            ₹{stats.grossSales?.toLocaleString('en-IN') || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            All verified customer purchases
          </div>
        </div>

        {/* Net Earnings */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Your Net Earnings
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-terracotta-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-terracotta)' }}>
              <IndianRupee size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-terracotta)', margin: '8px 0 2px 0' }}>
            ₹{stats.netEarnings?.toLocaleString('en-IN') || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            After {stats.commissionPercent || 10}% platform commission (₹{stats.platformCommission?.toLocaleString('en-IN') || 0})
          </div>
        </div>

        {/* Pending Orders */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Pending Fulfillment
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFF8E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B78103' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-dark-text)', margin: '8px 0 2px 0' }}>
            {stats.pendingOrdersCount || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Requires packing / dispatch
          </div>
        </div>

        {/* Total Products */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Live Creations
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-forest-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest-green)' }}>
              <Package size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-dark-text)', margin: '8px 0 2px 0' }}>
            {stats.totalProducts || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Active listed craft items
          </div>
        </div>
      </div>

      {/* Grid: 7-Day Sales Trend Bar Chart + Low Stock Alert Box */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
          marginBottom: '2rem'
        }}
      >
        {/* Sales Chart Card */}
        <div
          className="card"
          style={{
            backgroundColor: '#fff',
            padding: '1.75rem',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Sales Trend (Last 7 Days)</h3>
            <span className="badge badge-forest">Realtime Orders</span>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '10px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
            {chartData.map((cd, idx) => {
              const heightPct = Math.max(8, Math.round((cd.sales / maxSaleInChart) * 100));
              const formattedDate = new Date(cd.date).toLocaleDateString('en-IN', { weekday: 'short' });

              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                    gap: '6px'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                    {cd.sales > 0 ? `₹${cd.sales}` : ''}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '38px',
                      height: `${heightPct}%`,
                      backgroundColor: cd.sales > 0 ? 'var(--color-forest-green)' : 'var(--color-soft-beige)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.4s ease'
                    }}
                    title={`${cd.date}: ₹${cd.sales}`}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {formattedDate}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          className="card"
          style={{
            backgroundColor: '#fff',
            padding: '1.75rem',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--color-terracotta)" />
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Low Stock Alerts</h3>
            </div>
            <Link to="/seller/products" style={{ fontSize: '0.82rem', color: 'var(--color-forest-green)', fontWeight: '600' }}>
              Manage Stock
            </Link>
          </div>

          {lowStock.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '2rem 0', textAlign: 'center' }}>
              All your craft items have sufficient inventory.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lowStock.map((prod) => (
                <div
                  key={prod._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-cream-light)',
                    border: '1px solid var(--color-border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'}
                      alt={prod.name}
                      style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--color-dark-text)' }}>
                        {prod.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        ₹{prod.price}
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                    {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div
        className="card"
        style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Recent Orders</h3>
          <Link to="/seller/orders" className="btn btn-outline btn-sm">
            <span>View All Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>
            No recent orders. Promote your shop to start receiving customer orders!
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '10px' }}>Order Number</th>
                  <th style={{ padding: '10px' }}>Customer</th>
                  <th style={{ padding: '10px' }}>Items</th>
                  <th style={{ padding: '10px' }}>Seller Value</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord.orderId} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: '700', color: 'var(--color-forest-green)' }}>
                      #{ord.orderNumber}
                    </td>
                    <td style={{ padding: '12px 10px' }}>{ord.customerName}</td>
                    <td style={{ padding: '12px 10px' }}>{ord.itemsCount} creation(s)</td>
                    <td style={{ padding: '12px 10px', fontWeight: '700' }}>
                      ₹{ord.sellerTotal.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className="badge badge-forest" style={{ fontSize: '0.72rem' }}>
                        {ord.itemStatuses?.[0] || 'Confirmed'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      <Link to="/seller/orders" className="btn btn-sm btn-outline">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboardPage;
