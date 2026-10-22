import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/common/ProductCard';

const BuyerWishlistPage = () => {
  const { wishlist, wishlistCount, loading } = useWishlist();

  if (loading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p>Loading your favorite crafts...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-warm-cream)', minHeight: '85vh', padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
            <Link to="/" style={{ color: 'inherit' }}>Home</Link> /{' '}
            <span style={{ color: 'var(--color-terracotta)', fontWeight: '600' }}>Favorites</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={28} color="var(--color-terracotta)" fill="var(--color-terracotta)" />
            <h1 style={{ fontSize: '2.4rem', margin: 0 }}>My Wishlist ({wishlistCount})</h1>
          </div>
          <p style={{ margin: '0.35rem 0 0 0', color: 'var(--color-text-muted)' }}>
            Handcrafted creations you have saved for yourself or upcoming celebrations
          </p>
        </div>

        {wishlist.length === 0 ? (
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
                color: 'var(--color-terracotta)'
              }}
            >
              <Heart size={28} />
            </div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>No saved items yet</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Explore our catalogue and click the heart icon to save beautiful handmade items.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Discover Crafts
            </Link>
          </div>
        ) : (
          <div className="grid-4">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerWishlistPage;
