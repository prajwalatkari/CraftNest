import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Phone, Mail, Plus, Trash2, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';

const BuyerProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [savingProfile, setSavingProfile] = useState(false);

  // New address form modal/toggle
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await api.patch('/auth/profile', { name, phone });
      if (res.data.success) {
        updateUser(res.data.user);
        addToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      addToast('Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.street || !newAddr.city || !newAddr.postalCode) {
      addToast('Please fill out all address fields', 'error');
      return;
    }

    try {
      const updatedAddresses = [...addresses, newAddr];
      const res = await api.patch('/auth/profile', { addresses: updatedAddresses });
      if (res.data.success) {
        setAddresses(res.data.user.addresses);
        updateUser(res.data.user);
        setShowAddressForm(false);
        setNewAddr({
          fullName: user?.name || '',
          phone: user?.phone || '',
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India',
          isDefault: false
        });
        addToast('Delivery address saved!', 'success');
      }
    } catch (err) {
      addToast('Failed to save address', 'error');
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      const updated = addresses.filter((_, i) => i !== index);
      const res = await api.patch('/auth/profile', { addresses: updated });
      if (res.data.success) {
        setAddresses(res.data.user.addresses);
        updateUser(res.data.user);
        addToast('Address removed', 'info');
      }
    } catch (err) {
      addToast('Failed to remove address', 'error');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '85vh', padding: '3rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
            <Link to="/" style={{ color: 'inherit' }}>Home</Link> /{' '}
            <span style={{ color: 'var(--color-terracotta)', fontWeight: '600' }}>Account Settings</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', margin: 0 }}>My Account</h1>
          <p style={{ margin: '0.35rem 0 0 0', color: 'var(--color-text-muted)' }}>
            Manage your personal profile and saved delivery addresses
          </p>
        </div>

        {/* Profile Card */}
        <div
          className="card"
          style={{
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: '2rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
            <User size={20} color="var(--color-forest-green)" />
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Personal Details</h3>
          </div>

          <form onSubmit={handleProfileSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="form-input"
                  style={{ backgroundColor: 'var(--color-cream-light)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                  placeholder="+91..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account Role</label>
                <div>
                  <span className="badge badge-forest" style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>

            <button type="submit" disabled={savingProfile} className="btn btn-primary">
              <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Saved Addresses Card */}
        <div
          className="card"
          style={{
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: '2rem',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--color-border-subtle)',
              paddingBottom: '0.75rem',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} color="var(--color-forest-green)" />
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Saved Delivery Addresses</h3>
            </div>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="btn btn-sm btn-outline"
            >
              <Plus size={15} />
              <span>Add New Address</span>
            </button>
          </div>

          {/* New address form */}
          {showAddressForm && (
            <form
              onSubmit={handleAddAddress}
              style={{
                backgroundColor: 'var(--color-cream-light)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                marginBottom: '1.75rem'
              }}
            >
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Add New Address</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Street Address & Flat / House No.</label>
                  <input
                    type="text"
                    value={newAddr.street}
                    onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Postal / PIN Code</label>
                  <input
                    type="text"
                    value={newAddr.postalCode}
                    onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-sm btn-primary">
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="btn btn-sm btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* List of addresses */}
          {addresses.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              No saved addresses. You can add one above or during checkout.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {addresses.map((addr, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    backgroundColor: 'var(--color-cream-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-forest-green)' }}>
                      {addr.fullName}
                    </strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-dark-text)', marginTop: '4px' }}>
                      {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Phone: {addr.phone}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.5rem' }}>
                    <button
                      onClick={() => handleDeleteAddress(idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-error)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerProfilePage;
