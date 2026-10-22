import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Filter
} from 'lucide-react';
import api from '../../api/client';
import ProductCard from '../../components/common/ProductCard';

const CATEGORIES = [
  'All',
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

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter States initialized from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Data states
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL query params change
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    const catFromUrl = searchParams.get('category');
    if (searchFromUrl !== null) setSearchTerm(searchFromUrl);
    if (catFromUrl !== null) setSelectedCategory(catFromUrl);
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        sort: sortBy
      };

      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/products', { params });
      if (res.data.success) {
        setProducts(res.data.products);
        setTotalCount(res.data.totalCount);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, selectedCategory, searchTerm, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '85vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Header Breadcrumb / Title */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
            <span>Home</span> / <span style={{ color: 'var(--color-terracotta)', fontWeight: '600' }}>Artisan Catalogue</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.4rem', margin: 0 }}>Handmade Marketplace</h1>
              <p style={{ margin: '0.35rem 0 0 0', color: 'var(--color-text-muted)' }}>
                Showing {totalCount} authentic craft items handcrafted with heart
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="btn btn-outline btn-sm mobile-filter-btn"
              style={{ display: 'none' }}
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Main Product Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '270px 1fr',
            gap: '2.5rem',
            alignItems: 'start'
          }}
          className="shop-layout-grid"
        >
          {/* Sidebar Filters */}
          <aside
            style={{
              backgroundColor: '#fff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-subtle)'
            }}
            className={`shop-sidebar ${mobileFilterOpen ? 'shop-sidebar-open' : ''}`}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--color-border-subtle)',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '1.05rem', color: 'var(--color-forest-green)' }}>
                <SlidersHorizontal size={18} />
                <span>Filters</span>
              </div>
              <button
                onClick={handleResetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.8rem',
                  color: 'var(--color-terracotta)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>

            {/* Search Input in Sidebar */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.5rem' }}>
                Search Creations
              </label>
              <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Keywords, maker, materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ paddingRight: '2.5rem', fontSize: '0.88rem' }}
                />
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-forest-green)'
                  }}
                >
                  <Search size={16} />
                </button>
              </form>
            </div>

            {/* Categories */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.75rem' }}>
                Categories
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      style={{
                        textAlign: 'left',
                        background: isSelected ? 'var(--color-forest-subtle)' : 'none',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        fontWeight: isSelected ? '700' : '500',
                        color: isSelected ? 'var(--color-forest-green)' : 'var(--color-dark-text)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <span>{cat}</span>
                      {isSelected && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-forest-green)' }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.75rem' }}>
                Price Range (₹)
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '0.75rem' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="form-input"
                  style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                />
                <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="form-input"
                  style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                />
              </div>
              <button
                onClick={() => { setCurrentPage(1); fetchProducts(); }}
                className="btn btn-sm btn-primary"
                style={{ width: '100%' }}
              >
                Apply Price
              </button>
            </div>
          </aside>

          {/* Main Products Area */}
          <main>
            {/* Top Toolbar */}
            <div
              style={{
                backgroundColor: '#fff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.75rem',
                boxShadow: 'var(--shadow-subtle)'
              }}
            >
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Page <strong style={{ color: 'var(--color-dark-text)' }}>{currentPage}</strong> of{' '}
                <strong style={{ color: 'var(--color-dark-text)' }}>{totalPages || 1}</strong>
              </div>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="form-select"
                  style={{ padding: '6px 12px', fontSize: '0.88rem', width: 'auto' }}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popular">Popularity / Sales</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Active Filter Chips */}
            {(selectedCategory !== 'All' || searchTerm || minPrice || maxPrice) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.25rem' }}>
                {selectedCategory !== 'All' && (
                  <span className="badge badge-forest" style={{ padding: '6px 12px' }}>
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('All')}
                      style={{ background: 'none', border: 'none', marginLeft: '6px', cursor: 'pointer', color: 'inherit' }}
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="badge badge-terracotta" style={{ padding: '6px 12px' }}>
                    Query: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      style={{ background: 'none', border: 'none', marginLeft: '6px', cursor: 'pointer', color: 'inherit' }}
                    >
                      ×
                    </button>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="badge badge-cream" style={{ padding: '6px 12px' }}>
                    ₹{minPrice || 0} – ₹{maxPrice || '∞'}
                    <button
                      onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                      style={{ background: 'none', border: 'none', marginLeft: '6px', cursor: 'pointer', color: 'inherit' }}
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid or Loading / Empty */}
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '350px',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div
                  style={{
                    width: '45px',
                    height: '45px',
                    border: '4px solid var(--color-soft-beige)',
                    borderTopColor: 'var(--color-forest-green)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: 'var(--color-text-muted)' }}>Discovering artisan crafts...</p>
              </div>
            ) : products.length === 0 ? (
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
                  <ShoppingBag size={28} />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No creations match your search</h3>
                <p style={{ color: 'var(--color-text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                  We couldn't find any handmade products matching those specific filters. Try loosening your keywords or price range.
                </p>
                <button onClick={handleResetFilters} className="btn btn-secondary">
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1.75rem'
                }}
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '3.5rem'
                }}
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-outline btn-sm"
                  style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid',
                        borderColor: isActive ? 'var(--color-forest-green)' : 'var(--color-border)',
                        backgroundColor: isActive ? 'var(--color-forest-green)' : '#fff',
                        color: isActive ? '#fff' : 'var(--color-dark-text)',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline btn-sm"
                  style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 900px) {
          .shop-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
          .shop-sidebar {
            display: none;
          }
          .shop-sidebar-open {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ShopPage;
