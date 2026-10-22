import React, { useState, useEffect } from 'react';
import { Users, Search, ShieldCheck, UserX, UserCheck, Filter } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const { addToast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (roleFilter) params.role = roleFilter;

      const res = await api.get('/admin/users', { params });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.accountStatus === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Are you sure you want to mark ${user.name} as ${newStatus}?`)) {
      return;
    }

    try {
      setUpdatingId(user._id);
      const res = await api.patch(`/admin/users/${user._id}/status`, { status: newStatus });
      if (res.data.success) {
        addToast(`User ${user.name} set to ${newStatus}`, 'success');
        fetchUsers();
      }
    } catch (err) {
      addToast('Failed to update user status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-forest-green)' }}>
          User Directory & Permissions
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
          Inspect buyers, artisan sellers, administrators, and manage active status
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          backgroundColor: '#fff',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ fontSize: '0.88rem' }}
          />
          <button type="submit" className="btn btn-sm btn-primary">
            <Search size={15} />
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', fontSize: '0.88rem', padding: '6px 12px' }}
          >
            <option value="">All Roles</option>
            <option value="buyer">Buyers Only</option>
            <option value="seller">Sellers Only</option>
            <option value="admin">Admins Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
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
                <th style={{ padding: '12px 16px' }}>Member</th>
                <th style={{ padding: '12px 16px' }}>Email</th>
                <th style={{ padding: '12px 16px' }}>Role</th>
                <th style={{ padding: '12px 16px' }}>Phone</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--color-dark-text)' }}>
                    {u.name}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      className={`badge ${
                        u.role === 'admin'
                          ? 'badge-terracotta'
                          : u.role === 'seller'
                          ? 'badge-forest'
                          : 'badge-cream'
                      }`}
                      style={{ fontSize: '0.72rem' }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      className={`badge ${u.accountStatus === 'active' ? 'badge-success' : 'badge-error'}`}
                      style={{ fontSize: '0.72rem' }}
                    >
                      {u.accountStatus}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={updatingId === u._id}
                        className="btn btn-sm btn-outline"
                        style={{
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          color: u.accountStatus === 'active' ? 'var(--color-error)' : 'var(--color-success)',
                          borderColor: u.accountStatus === 'active' ? 'var(--color-error)' : 'var(--color-success)'
                        }}
                      >
                        {u.accountStatus === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    )}
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

export default AdminUsersPage;
