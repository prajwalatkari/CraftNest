import React, { useState, useEffect } from 'react';
import { Store, Eye, Save, Sparkles, MapPin, Phone, Mail, Image as ImageIcon } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const SellerShopPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    shopName: '',
    description: '',
    banner: '',
    logo: '',
    contactDetails: {
      email: '',
      phone: '',
      city: '',
      state: '',
      craftSpeciality: ''
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/seller/profile');
        if (res.data.success && res.data.profile) {
          setProfile(res.data.profile);
          setFormData({
            shopName: res.data.profile.shopName || '',
            description: res.data.profile.description || '',
            banner: res.data.profile.banner || '',
            logo: res.data.profile.logo || '',
            contactDetails: {
              email: res.data.profile.contactDetails?.email || '',
              phone: res.data.profile.contactDetails?.phone || '',
              city: res.data.profile.contactDetails?.city || '',
              state: res.data.profile.contactDetails?.state || '',
              craftSpeciality: res.data.profile.contactDetails?.craftSpeciality || 'Handmade Crafts'
            }
          });
        }
      } catch (err) {
        console.error('Error fetching seller profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact_')) {
      const field = name.replace('contact_', '');
      setFormData(prev => ({
        ...prev,
        contactDetails: { ...prev.contactDetails, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.shopName.trim()) {
      addToast('Shop name is required', 'error');
      return;
    }

    try {
      setSaving(true);
      const res = await api.patch('/seller/profile', formData);
      if (res.data.success) {
        setProfile(res.data.profile);
        addToast('Shop profile updated successfully!', 'success');
      }
    } catch (err) {
      addToast('Failed to update shop profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p>Loading shop settings...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-forest-green)' }}>
            Artisan Shop Profile
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
            Customize your maker identity, brand story, and contact details
          </p>
        </div>

        {profile?.slug && (
          <a
            href={`/shop?search=${encodeURIComponent(formData.shopName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <Eye size={15} />
            <span>View Public Storefront</span>
          </a>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Brand Info */}
        <div
          className="card"
          style={{
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
            <Store size={20} color="var(--color-forest-green)" />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Shop Identity</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Shop Name *</label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Aarohi Botanicals & Candles"
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Artisan Story & Bio</label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Tell customers about your passion, traditional techniques, and handcrafted philosophy..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Logo / Avatar Image URL</label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Shop Banner URL</label>
              <input
                type="url"
                name="banner"
                value={formData.banner}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Business & Location Info */}
        <div
          className="card"
          style={{
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
            <MapPin size={20} color="var(--color-forest-green)" />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Workshop Location & Craft Speciality</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Craft Speciality</label>
              <input
                type="text"
                name="contact_craftSpeciality"
                value={formData.contactDetails.craftSpeciality}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Soy Wax Candles, Organic Macramé, Terracotta Pottery"
              />
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="contact_city"
                value={formData.contactDetails.city}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Jaipur"
              />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="contact_state"
                value={formData.contactDetails.state}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Rajasthan"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Support Email</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contactDetails.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="artisan@craftnest.in"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Support Phone</label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contactDetails.phone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="+91..."
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
          <Save size={18} />
          <span>{saving ? 'Saving Profile...' : 'Save Shop Settings'}</span>
        </button>
      </form>
    </div>
  );
};

export default SellerShopPage;
