import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!product) return null;

  const inWishlist = isWishlisted(product._id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 4;
  const imageUrl = (product.images && product.images.length > 0)
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80';

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product._id, 1);
    }
  };

  return (
    <div
      className="card product-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        backgroundColor: '#fff',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease'
      }}
    >
      {/* Product Image Box */}
      <Link
        to={`/product/${product.slug || product._id}`}
        style={{
          position: 'relative',
          paddingTop: '92%',
          overflow: 'hidden',
          backgroundColor: 'var(--color-cream-light)',
          display: 'block'
        }}
      >
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          className="product-img-hover"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'transform 0.15s ease'
          }}
        >
          <Heart
            size={18}
            color={inWishlist ? 'var(--color-terracotta)' : 'var(--color-dark-text)'}
            fill={inWishlist ? 'var(--color-terracotta)' : 'none'}
          />
        </button>

        {/* Category Pill Tag */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(53, 75, 54, 0.88)',
            color: '#fff',
            fontSize: '0.72rem',
            fontWeight: '600',
            letterSpacing: '0.04em',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            backdropFilter: 'blur(4px)'
          }}
        >
          {product.category}
        </div>

        {/* Stock alerts */}
        {isOutOfStock ? (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'rgba(200, 70, 48, 0.92)',
              color: '#fff',
              fontSize: '0.72rem',
              fontWeight: '700',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            Sold Out
          </div>
        ) : isLowStock ? (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'rgba(169, 101, 72, 0.92)',
              color: '#fff',
              fontSize: '0.72rem',
              fontWeight: '700',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            Only {product.stock} left
          </div>
        ) : null}
      </Link>

      {/* Content Details */}
      <div
        style={{
          padding: '1.1rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}
      >
        <div>
          {/* Seller shop attribution */}
          {product.shop && (
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--color-terracotta)',
                fontWeight: '600',
                marginBottom: '4px'
              }}
            >
              by {product.shop.shopName}
            </div>
          )}

          {/* Product Name */}
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: '700',
              margin: '0 0 6px 0',
              lineHeight: '1.35',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            <Link
              to={`/product/${product.slug || product._id}`}
              style={{ color: 'var(--color-dark-text)' }}
            >
              {product.name}
            </Link>
          </h3>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#E89E36' }}>
              <Star size={14} fill="#E89E36" />
            </div>
            <span style={{ fontWeight: '700', color: 'var(--color-dark-text)' }}>
              {product.averageRating > 0 ? product.averageRating.toFixed(1) : '5.0'}
            </span>
            <span style={{ color: 'var(--color-text-muted)' }}>
              ({product.reviewCount || 1} {product.reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--color-border-subtle)',
            marginTop: 'auto'
          }}
        >
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Price</span>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: 'var(--color-forest-green)',
                fontFamily: 'var(--font-sans)'
              }}
            >
              ₹{product.price.toLocaleString('en-IN')}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="btn btn-sm btn-primary"
            style={{
              opacity: isOutOfStock ? 0.5 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
            title={isOutOfStock ? 'Item is sold out' : 'Add to cart'}
          >
            <ShoppingBag size={15} />
            <span>{isOutOfStock ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>

      <style>{`
        .product-card:hover .product-img-hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
