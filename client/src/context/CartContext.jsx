import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isBuyer } = useAuth();
  const { addToast } = useToast();

  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    shippingFee: 0,
    total: 0,
    freeShippingThreshold: 999
  });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], subtotal: 0, shippingFee: 0, total: 0, freeShippingThreshold: 999 });
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success && res.data.cart) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      addToast('Please log in or register to add items to your cart', 'info');
      return false;
    }
    try {
      setLoading(true);
      const res = await api.post('/cart/items', { productId, quantity });
      if (res.data.success) {
        setCart(res.data.cart);
        addToast('Added handcrafted item to your cart!', 'success');
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not add item to cart';
      addToast(msg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.patch(`/cart/items/${productId}`, { quantity });
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not update quantity';
      addToast(msg, 'error');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/items/${productId}`);
      if (res.data.success) {
        setCart(res.data.cart);
        addToast('Item removed from cart', 'info');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not remove item';
      addToast(msg, 'error');
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/cart');
      if (res.data.success) {
        setCart({ items: [], subtotal: 0, shippingFee: 0, total: 0, freeShippingThreshold: 999 });
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const cartCount = cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
