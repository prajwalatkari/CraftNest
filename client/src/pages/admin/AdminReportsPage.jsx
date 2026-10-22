import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, IndianRupee, Download, Calendar } from 'lucide-react';
import api from '../../api/client';

const AdminReportsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/reports');
        if (res.data.success) {
          setReport(res.data);
        }
      } catch (err) {
        console.error('Error fetching admin reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p>Compiling financial commission reports...</p>
      </div>
    );
  }

  const summary = report?.summary || {};
  const monthly = report?.monthlyTrends || [];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-forest-green)' }}>
          Platform Revenue & Financial Reports
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
          Historical marketplace gross merchandise value, artisan payouts, and retained commission
        </p>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Total Marketplace GMV
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-forest-green)', margin: '8px 0 2px 0' }}>
            ₹{summary.grandGrossTotal?.toLocaleString('en-IN') || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            From {summary.totalEligibleOrders || 0} customer orders
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Platform Commission Earned
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-terracotta)', margin: '8px 0 2px 0' }}>
            ₹{summary.grandCommission?.toLocaleString('en-IN') || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Retained CraftNest operating revenue
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Artisan Payouts Released
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-dark-text)', margin: '8px 0 2px 0' }}>
            ₹{summary.grandSellerPayouts?.toLocaleString('en-IN') || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Net earnings delivered to craft makers
          </div>
        </div>
      </div>

      {/* Monthly Financial Breakdown */}
      <div
        className="card"
        style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-cream-light)' }}>
          <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--color-forest-green)' }}>
            Monthly Financial Performance
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px' }}>Month</th>
                <th style={{ padding: '12px 16px' }}>Orders Processed</th>
                <th style={{ padding: '12px 16px' }}>Gross Revenue</th>
                <th style={{ padding: '12px 16px' }}>CraftNest Commission</th>
                <th style={{ padding: '12px 16px' }}>Artisan Share (Net)</th>
              </tr>
            </thead>
            <tbody>
              {monthly.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    No recorded monthly batches yet.
                  </td>
                </tr>
              ) : (
                monthly.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '700' }}>{row.month}</td>
                    <td style={{ padding: '12px 16px' }}>{row.ordersCount} orders</td>
                    <td style={{ padding: '12px 16px', fontWeight: '700' }}>
                      ₹{row.revenue.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-terracotta)', fontWeight: '700' }}>
                      ₹{row.commission.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-forest-green)', fontWeight: '700' }}>
                      ₹{(row.revenue - row.commission).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
