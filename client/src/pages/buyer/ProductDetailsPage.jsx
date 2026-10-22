import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Clock,
  Sparkles,
  Store,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  Ruler
} from 'lucide-react';
import api from '../../api/client';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ProductCard from '../../components/common/ProductCard';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewEligibility, setReviewEligibility] = useState({ eligible: false, reason: 'loading' });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        if (res.data.success && res.data.product) {
          setProduct(res.data.product);
          setReviews(res.data.product.reviews || []);
          setSelectedImageIndex(0);
          setQuantity(1);

          // Check review eligibility if user is logged in
          if (isAuthenticated) {
            try {
              const eligRes = await api.get(`/products/${res.data.product._id}/reviews/eligibility`);
              if (eligRes.data.success) {
                setReviewEligibility(eligRes.data);
              }
            } catch {
              setReviewEligibility({ eligible: false, reason: 'error' });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, isAuthenticated]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
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
        <p style={{ color: 'var(--color-text-muted)' }}>Loading handcrafted creation...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <p style={{ color: 'var(--color-text-muted)', margin: '1rem 0 2rem 0' }}>
          This handcrafted treasure might have been moved or is no longer listed.
        </p>
        <Link to="/shop" className="btn btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  const inWishlist = isWishlisted(product._id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 4;
  const currentImage = (product.images && product.images[selectedImageIndex]) || product.images?.[0];

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product._id, quantity);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      addToast('Please write a comment for your review', 'error');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment.trim()
      });

      if (res.data.success) {
        addToast('Review submitted successfully!', 'success');
        setReviews([res.data.review, ...reviews]);
        setReviewComment('');
        setReviewEligibility({ eligible: false, reason: 'already_reviewed' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not submit review';
      addToast(msg, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '90vh', padding: '2.5rem 0 6rem 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'inherit' }}>Home</Link> /{' '}
          <Link to="/shop" style={{ color: 'inherit' }}>Shop</Link> /{' '}
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} style={{ color: 'inherit' }}>
            {product.category}
          </Link>{' '}
          / <span style={{ color: 'var(--color-terracotta)', fontWeight: '600' }}>{product.name}</span>
        </div>

        {/* Product Main Display (Gallery + Info) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3.5rem',
            marginBottom: '4rem',
            alignItems: 'start'
          }}
        >
          {/* Left Gallery Box */}
          <div>
            {/* Primary Main Image */}
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                backgroundColor: '#fff',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)',
                aspectRatio: '1 / 1'
              }}
            >
              <img
                src={currentImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Wishlist Button on image */}
              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <Heart
                  size={20}
                  color={inWishlist ? 'var(--color-terracotta)' : 'var(--color-dark-text)'}
                  fill={inWishlist ? 'var(--color-terracotta)' : 'none'}
                />
              </button>
            </div>

            {/* Thumbnail Selectors */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '1rem', overflowX: 'auto', paddingBottom: '6px' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: '2px solid',
                      borderColor: selectedImageIndex === idx ? 'var(--color-forest-green)' : 'var(--color-border)',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Details Info */}
          <div>
            {/* Category & Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem' }}>
              <span className="badge badge-forest">{product.category}</span>
              {product.featured && <span className="badge badge-terracotta">Featured Artisan</span>}
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', lineHeight: '1.25' }}>
              {product.name}
            </h1>

            {/* Maker Attribution */}
            {product.shop && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#fff',
                  border: '1px solid var(--color-border)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '1.25rem',
                  fontSize: '0.88rem'
                }}
              >
                <Store size={15} color="var(--color-forest-green)" />
                <span>Crafted by</span>
                <strong style={{ color: 'var(--color-forest-green)' }}>{product.shop.shopName}</strong>
                {product.shop.contactDetails?.city && (
                  <span style={{ color: 'var(--color-text-muted)' }}>({product.shop.contactDetails.city})</span>
                )}
              </div>
            )}

            {/* Rating Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', color: '#E89E36' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.round(product.averageRating || 5) ? '#E89E36' : 'none'}
                    color="#E89E36"
                  />
                ))}
              </div>
              <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                {product.averageRating > 0 ? product.averageRating.toFixed(1) : '5.0'}
              </span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
                • {reviews.length} {reviews.length === 1 ? 'verified review' : 'verified reviews'}
              </span>
            </div>

            {/* Price Box */}
            <div
              style={{
                backgroundColor: 'var(--color-cream-light)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.75rem'
              }}
            >
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Artisan Price</div>
              <div
                style={{
                  fontSize: '2.4rem',
                  fontWeight: '800',
                  color: 'var(--color-forest-green)',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: '1.1',
                  margin: '4px 0'
                }}
              >
                ₹{product.price.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Inclusive of all taxes • Free delivery on orders above ₹999
              </div>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--color-dark-text)',
                lineHeight: '1.7',
                marginBottom: '1.75rem',
                whiteSpace: 'pre-line'
              }}
            >
              {product.description}
            </p>

            {/* Product Specifications Table */}
            <div
              style={{
                backgroundColor: '#fff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.88rem'
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                <Layers size={17} color="var(--color-terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Materials:</strong> {product.materials || 'Handcrafted natural materials'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Ruler size={17} color="var(--color-terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Dimensions:</strong> {product.dimensions || 'Standard handcrafted sizing'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Clock size={17} color="var(--color-terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Processing Time:</strong> {product.processingTime || '2-4 business days'}
                </div>
              </div>
              {product.customizationAvailable && (
                <div style={{ display: 'flex', gap: '8px', color: 'var(--color-forest-green)' }}>
                  <Sparkles size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Customization Available:</strong>{' '}
                    {product.customizationNotes || 'Special gift inscriptions and custom sizes available upon request.'}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', backgroundColor: '#fff' }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      fontWeight: '700',
                      color: 'var(--color-forest-green)'
                    }}
                  >
                    -
                  </button>
                  <span style={{ width: '40px', textAlign: 'center', fontWeight: '700', fontSize: '1rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      fontWeight: '700',
                      color: 'var(--color-forest-green)'
                    }}
                  >
                    +
                  </button>
                </div>

                <div style={{ fontSize: '0.85rem' }}>
                  {isOutOfStock ? (
                    <span style={{ color: 'var(--color-error)', fontWeight: '700' }}>Out of Stock</span>
                  ) : isLowStock ? (
                    <span style={{ color: 'var(--color-terracotta)', fontWeight: '700' }}>
                      Only {product.stock} items available!
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>
                      In Stock ({product.stock} available)
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1, minWidth: '200px', opacity: isOutOfStock ? 0.5 : 1 }}
                >
                  <ShoppingBag size={20} />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`btn ${inWishlist ? 'btn-secondary' : 'btn-outline'} btn-lg`}
                >
                  <Heart size={20} fill={inWishlist ? '#fff' : 'none'} />
                  <span>{inWishlist ? 'In Wishlist' : 'Wishlist'}</span>
                </button>
              </div>
            </div>

            {/* Trust Assurances */}
            <div
              style={{
                borderTop: '1px solid var(--color-border-subtle)',
                paddingTop: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                fontSize: '0.82rem',
                color: 'var(--color-text-muted)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={18} color="var(--color-forest-green)" />
                <span>Pan-India tracked courier</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--color-forest-green)" />
                <span>Verified craft authenticity</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={18} color="var(--color-forest-green)" />
                <span>7-day artisan replacement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: '2.5rem',
            marginBottom: '4rem',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem',
              borderBottom: '1px solid var(--color-border-subtle)',
              paddingBottom: '1.25rem'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Customer Reviews</h2>
              <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-muted)' }}>
                Verified purchaser feedback for this item
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-forest-green)' }}>
                {product.averageRating > 0 ? product.averageRating.toFixed(1) : '5.0'}
              </div>
              <div>
                <div style={{ display: 'flex', color: '#E89E36' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#E89E36" />
                  ))}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  {reviews.length} reviews
                </div>
              </div>
            </div>
          </div>

          {/* Review Submission Form (Only for Verified Buyers) */}
          {isAuthenticated ? (
            reviewEligibility.eligible ? (
              <form
                onSubmit={handleReviewSubmit}
                style={{
                  backgroundColor: 'var(--color-cream-light)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  marginBottom: '2.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={18} />
                  <span>Verified Purchase: Share your experience with this craft</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setReviewRating(num)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <Star
                          size={24}
                          fill={num <= reviewRating ? '#E89E36' : 'none'}
                          color="#E89E36"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Review</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the craft quality, packaging, textures, and sensory feel..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="form-textarea"
                    required
                  />
                </div>

                <button type="submit" disabled={submittingReview} className="btn btn-secondary">
                  <span>{submittingReview ? 'Submitting...' : 'Post Verified Review'}</span>
                </button>
              </form>
            ) : reviewEligibility.reason === 'already_reviewed' ? (
              <div
                style={{
                  backgroundColor: 'var(--color-forest-subtle)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  color: 'var(--color-forest-green)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '2rem'
                }}
              >
                <CheckCircle2 size={18} />
                <span>You have reviewed this handcrafted item. Thank you for supporting our artisans!</span>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: 'var(--color-cream-light)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '2rem'
                }}
              >
                <ShieldCheck size={18} color="var(--color-forest-green)" />
                <span>
                  Reviews are reserved for customers who have ordered this item to maintain genuine artisanal feedback.
                </span>
              </div>
            )
          ) : (
            <div
              style={{
                backgroundColor: 'var(--color-cream-light)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                color: 'var(--color-text-muted)',
                marginBottom: '2rem'
              }}
            >
              Please <Link to="/login" style={{ color: 'var(--color-terracotta)', fontWeight: '700' }}>log in</Link> to write a verified review.
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>
              No reviews yet for this newly crafted item.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  style={{
                    borderBottom: '1px solid var(--color-border-subtle)',
                    paddingBottom: '1.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <strong style={{ color: 'var(--color-dark-text)', fontSize: '0.95rem' }}>
                        {rev.buyerName || 'Verified Patron'}
                      </strong>
                      <span className="badge badge-forest" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                        Verified Purchase
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', color: '#E89E36', gap: '3px', marginBottom: '8px' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#E89E36" />
                    ))}
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--color-dark-text)', lineHeight: '1.6' }}>
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>More Handcrafted Treasures in {product.category}</h2>
            <div className="grid-4">
              {product.relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
