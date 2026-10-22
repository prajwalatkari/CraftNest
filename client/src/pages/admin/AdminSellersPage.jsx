import React, { useState, useEffect } from 'react';
import { Store, Check, X, ShieldAlert, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const AdminSellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { addToast } = useToast();

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/sellers');
      if (res.data.success) {
        setSellers(res.data.sellers);
      }
    } catch (err) {
      console.error('Error fetching sellers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleUpdateStatus = async (sellerId, newStatus) => {
    try {
      setUpdatingId(sellerId);
      const res = await api.patch(`/admin/sellers/${sellerId}/approval`, {
        approvalStatus: newStatus
      });
      if (res.data.success) {
        addToast(`Seller account status set to ${newStatus}`, 'success');
        fetchSellers();
      }
    } catch (err) {
      addToast('Failed to update seller status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p>Loading seller directory...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-forest-green)' }}>
          Seller Verification & Directory ({sellers.length})
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
          Inspect artisan applications, verify maker profiles, approve or suspend seller accounts
        </p>
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
                <th style={{ padding: '12px 16px' }}>Shop & Artisan</th>
                <th style={{ padding: '12px 16px' }}>Craft Speciality</th>
                <th style={{ padding: '12px 16px' }}>Location</th>
                <th style={{ padding: '12px 16px' }}>Contact</th>
                <th style={{ padding: '12px 16px' }}>Approval Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Moderation Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => {
                const status = seller.approvalStatus;

                return (
                  <tr key={seller._id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-soft-beige)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            color: 'var(--color-forest-green)',
                            flexShrink: 0
                          }}
                        >
                          {seller.shopName ? seller.shopName[0] : 'S'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--color-forest-green)' }}>
                            {seller.shopName}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            {seller.userId?.name || 'Artisan Maker'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      {seller.contactDetails?.craftSpeciality || 'Handmade Crafts'}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      {seller.contactDetails?.city || 'India'}, {seller.contactDetails?.state || ''}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: '0.8rem' }}>{seller.contactDetails?.email || seller.userId?.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {seller.contactDetails?.phone || seller.userId?.phone || 'No phone'}
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <span
                        className={`badge ${
                          status === 'approved'
                            ? 'badge-success'
                            : status === 'pending'
                            ? 'badge-warning'
                            : 'badge-error'
                        }`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        {status}
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(seller._id, 'approved')}
                            disabled={updatingId === seller._id}
                            className="btn btn-sm btn-primary"
                            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                          >
                            <Check size={13} />
                            <span>Approve</span>
                          </button>
                        )}

                        {status === 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(seller._id, 'suspended')}
                            disabled={updatingId === seller._id}
                            className="btn btn-sm btn-outline"
                            style={{
                              padding: '4px 10px',
                              fontSize: '0.78rem',
                              color: 'var(--color-error)',
                              borderColor: 'var(--color-error)'
                            }}
                          >
                            <ShieldAlert size={13} />
                            <span>Suspend</span>
                          </button>
                        )}

                        {status === 'suspended' && (
                          <button
                            onClick={() => handleUpdateStatus(seller._id, 'approved')}
                            disabled={updatingId === seller._id}
                            className="btn btn-sm btn-outline"
                            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                          >
                            <span>Reinstate</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSellersPage;
