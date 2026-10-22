import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Eye,
  X,
  AlertCircle
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = [
  'Handmade Candles',
  'Jewellery',
  'Crochet and Knitting',
  'Home Décor',
  'Paintings and Art',
  'Greeting Cards',
  'Gift Hampers',
  'Personalized Gifts',
  'Other Crafts'
];

const INITIAL_FORM = {
  name: '',
  category: 'Handmade Candles',
  description: '',
  price: '',
  stock: 1,
  imageUrl: '',
  materials: '',
  dimensions: '',
  processingTime: '2-3 business days',
  customizationAvailable: false,
  customizationNotes: '',
  status: 'active'
};

const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/seller/products');
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Error fetching seller products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData(INITIAL_FORM);
    setSelectedFile(null);
    setShowModal(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      imageUrl: prod.images?.[0] || '',
      materials: prod.materials || '',
      dimensions: prod.dimensions || '',
      processingTime: prod.processingTime || '2-3 business days',
      customizationAvailable: Boolean(prod.customizationAvailable),
      customizationNotes: prod.customizationNotes || '',
      status: prod.status || 'active'
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim() || !formData.price) {
      addToast('Please provide product name, description, and price', 'error');
      return;
    }

    try {
      setSaving(true);
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('category', formData.category);
      data.append('description', formData.description.trim());
      data.append('price', Number(formData.price));
      data.append('stock', Number(formData.stock));
      data.append('materials', formData.materials.trim());
      data.append('dimensions', formData.dimensions.trim());
      data.append('processingTime', formData.processingTime.trim());
      data.append('customizationAvailable', formData.customizationAvailable);
      data.append('customizationNotes', formData.customizationNotes.trim());
      data.append('status', formData.status);

      if (selectedFile) {
        data.append('images', selectedFile);
      } else if (formData.imageUrl) {
        data.append('images', formData.imageUrl.trim());
      }

      if (editingProduct) {
        await api.patch(`/products/${editingProduct._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        addToast('Handcrafted product updated!', 'success');
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        addToast('New handcrafted product listed!', 'success');
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save product';
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from your listings?`)) {
      return;
    }

    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        addToast('Product listing removed', 'info');
        setProducts(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p>Loading your products...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-forest-green)' }}>
            My Handcrafted Products ({products.length})
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
            List, update stock, prices, and manage your artisan catalogue
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Creation</span>
        </button>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
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
            <Package size={28} />
          </div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No products listed yet</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            Begin by adding your first candle, crochet creation, pottery piece, or handmade gift hamper.
          </p>
          <button onClick={openCreateModal} className="btn btn-primary">
            + Add First Listing
          </button>
        </div>
      ) : (
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
                  <th style={{ padding: '12px 16px' }}>Creation</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Price</th>
                  <th style={{ padding: '12px 16px' }}>Stock</th>
                  <th style={{ padding: '12px 16px' }}>Rating</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'}
                          alt={prod.name}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--color-dark-text)' }}>{prod.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            {prod.processingTime}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-forest" style={{ fontSize: '0.72rem' }}>
                        {prod.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--color-forest-green)' }}>
                      ₹{prod.price.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: '700', color: prod.stock <= 3 ? 'var(--color-terracotta)' : 'inherit' }}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      ⭐ {prod.averageRating > 0 ? prod.averageRating.toFixed(1) : '5.0'} ({prod.reviewCount || 0})
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${prod.status === 'active' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                        {prod.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => openEditModal(prod)}
                          className="btn btn-icon btn-sm btn-outline"
                          title="Edit Product"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id, prod.name)}
                          className="btn btn-icon btn-sm btn-outline"
                          title="Delete Product"
                          style={{ width: '32px', height: '32px', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1.5rem'
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-floating)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-muted)'
              }}
            >
              <X size={22} />
            </button>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: 'var(--color-forest-green)' }}>
              {editingProduct ? 'Edit Artisan Creation' : 'List New Handcrafted Creation'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Fill in the artisan details for customers across the CraftNest marketplace.
            </p>

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Product Title *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. Soy Wax Lavender Botanical Candle"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price in INR (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. 599"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Processing Time</label>
                  <input
                    type="text"
                    name="processingTime"
                    value={formData.processingTime}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. 1-3 business days"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Materials</label>
                  <input
                    type="text"
                    name="materials"
                    value={formData.materials}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. 100% soy wax, organic cotton wick, dried lavender"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Dimensions / Sizing</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. 8cm x 9cm (240g)"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Detailed Story & Description *</label>
                  <textarea
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Describe your creative process, sensory notes, and care instructions..."
                    required
                  />
                </div>

                {/* Image Upload or URL */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Upload Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="form-input"
                    style={{ marginBottom: '8px' }}
                  />
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Or specify an image URL:
                  </div>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                    style={{ marginTop: '4px' }}
                  />
                </div>

                {/* Customization Available Toggle */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      name="customizationAvailable"
                      checked={formData.customizationAvailable}
                      onChange={handleInputChange}
                    />
                    <strong>Customization Available (inscriptions, colors, personalized messages)</strong>
                  </label>
                  {formData.customizationAvailable && (
                    <input
                      type="text"
                      name="customizationNotes"
                      value={formData.customizationNotes}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Notes on what can be customized"
                      style={{ marginTop: '8px' }}
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Listing Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="active">Active (Visible in shop)</option>
                    <option value="draft">Draft (Private)</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                >
                  <span>{saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Publish Listing'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductsPage;
