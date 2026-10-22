import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/wishlist');
      if (res.data.success && res.data.products) {
        setWishlist(res.data.products);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      addToast('Please log in to save favorites to your wishlist', 'info');
      return false;
    }

    const productId = typeof product === 'string' ? product : product._id;
    try {
      const res = await api.post(`/wishlist/${productId}/toggle`);
      if (res.data.success) {
        if (res.data.added) {
          addToast('Saved to your wishlist!', 'success');
          if (typeof product === 'object') {
            setWishlist(prev => [...prev, product]);
          } else {
            fetchWishlist();
          }
        } else {
          addToast('Removed from your wishlist', 'info');
          setWishlist(prev => prev.filter(p => (p._id || p) !== productId));
        }
        return res.data.added;
      }
    } catch (err) {
      addToast('Failed to update wishlist', 'error');
      return false;
    }
  };

  const isWishlisted = (productId) => {
    if (!productId) return false;
    return wishlist.some(p => (p._id || p) === productId);
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        loading,
        fetchWishlist,
        toggleWishlist,
        isWishlisted
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
