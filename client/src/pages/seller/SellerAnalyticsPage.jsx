import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Award, IndianRupee, Package, ArrowUpRight } from 'lucide-react';
import api from '../../api/client';

const SellerAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/seller/analytics');
        if (res.data.success) {
          setAnalytics(res.data.analytics);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p>Calculating sales performance...</p>
      </div>
    );
  }

  const bestSellers = analytics?.bestSellers || [];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-forest-green)' }}>
          Sales & Product Analytics
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
          Real sales performance, popular handcrafted creations, and revenue shares
        </p>
      </div>

      {/* Overview Stat Cards */}
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
            Total Items Sold
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-forest-green)', margin: '8px 0 2px 0' }}>
            {analytics?.totalItemsSold || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Creations delivered to patrons</div>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Gross Sales Value
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-forest-green)', margin: '8px 0 2px 0' }}>
            ₹{analytics?.totalGrossRevenue?.toLocaleString('en-IN') || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Total customer spending</div>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Platform Fee ({analytics?.commissionPercent || 10}%)
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-text-muted)', margin: '8px 0 2px 0' }}>
            ₹{analytics?.totalCommission?.toLocaleString('en-IN') || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Marketplace maintenance & payment gateway</div>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Net Artisan Payout
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-terracotta)', margin: '8px 0 2px 0' }}>
            ₹{analytics?.netEarnings?.toLocaleString('en-IN') || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Your direct earnings</div>
        </div>
      </div>

      {/* Best-selling creations */}
      <div
        className="card"
        style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
          <Award size={20} color="var(--color-terracotta)" />
          <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Top Performing Artisan Creations</h3>
        </div>

        {bestSellers.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '2rem 0', textAlign: 'center' }}>
            Analytics will populate once orders are processed.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bestSellers.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-cream-light)',
                  border: '1px solid var(--color-border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : '#CD7F32',
                      color: '#000',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem'
                    }}
                  >
                    #{idx + 1}
                  </div>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-dark-text)' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {item.unitsSold} units purchased by patrons
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--color-forest-green)' }}>
                    ₹{item.revenue.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Gross Generated</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerAnalyticsPage;
