import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [] }); return; }
    try {
      const { data } = await axios.get('/api/cart');
      setCart(data || { items: [] });
    } catch {}
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login first'); return; }
    try {
      const { data } = await axios.post('/api/cart/add', { productId, quantity });
      setCart(data);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await axios.put('/api/cart/update', { productId, quantity });
      setCart(data);
    } catch {}
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await axios.delete(`/api/cart/remove/${productId}`);
      setCart(data);
      toast.success('Item removed');
    } catch {}
  };

  const cartCount = cart.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((acc, i) => acc + (i.product?.price || i.price) * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, cartCount, cartTotal, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
