import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi, couponApi } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [conflictModal, setConflictModal] = useState({
    isOpen: false,
    existingStoreName: '',
    pendingItem: null,
  });

  const fetchCart = async () => {
    if (!isAuthenticated || !isCustomer) {
      setCart(null);
      setAppliedCoupon(null);
      setDiscountAmount(0);
      return;
    }
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      if (res && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, isCustomer]);

  // Re-verify applied coupon if subtotal changes
  useEffect(() => {
    if (appliedCoupon && cart?.subtotal) {
      if (appliedCoupon.minOrderAmount && cart.subtotal < appliedCoupon.minOrderAmount) {
        setAppliedCoupon(null);
        setDiscountAmount(0);
      } else {
        // Re-calculate discount
        couponApi.validateCoupon({
          code: appliedCoupon.code,
          storeId: cart.storeId,
          subtotal: cart.subtotal,
        })
          .then((res) => {
            if (res.data && res.data.valid) {
              setAppliedCoupon(res.data);
              setDiscountAmount(res.data.discountAmount || 0);
            } else {
              setAppliedCoupon(null);
              setDiscountAmount(0);
            }
          })
          .catch(() => {
            setAppliedCoupon(null);
            setDiscountAmount(0);
          });
      }
    }
  }, [cart?.subtotal, cart?.storeId]);

  const addItem = async (productId, quantity = 1, clearCartIfDifferentStore = false) => {
    try {
      const res = await cartApi.addItem({
        productId,
        quantity,
        clearCartIfDifferentStore,
      });
      if (res && res.data) {
        setCart(res.data);
        return { success: true };
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.startsWith('CART_STORE_CONFLICT:')) {
        const storeName = msg.replace('CART_STORE_CONFLICT:', '');
        setConflictModal({
          isOpen: true,
          existingStoreName: storeName,
          pendingItem: { productId, quantity },
        });
        return { conflict: true, existingStoreName: storeName };
      }
      throw err;
    }
  };

  const confirmSwitchStore = async () => {
    if (conflictModal.pendingItem) {
      const { productId, quantity } = conflictModal.pendingItem;
      await addItem(productId, quantity, true);
    }
    setConflictModal({ isOpen: false, existingStoreName: '', pendingItem: null });
  };

  const cancelSwitchStore = () => {
    setConflictModal({ isOpen: false, existingStoreName: '', pendingItem: null });
  };

  const updateQuantity = async (itemId, quantity) => {
    const res = await cartApi.updateQuantity(itemId, quantity);
    if (res && res.data) {
      setCart(res.data);
    }
  };

  const removeItem = async (itemId) => {
    const res = await cartApi.removeItem(itemId);
    if (res && res.data) {
      setCart(res.data);
    }
  };

  const clearCart = async () => {
    const res = await cartApi.clearCart();
    if (res && res.data) {
      setCart(res.data);
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  };

  const applyCoupon = async (code) => {
    if (!cart?.storeId || !cart?.subtotal) {
      throw new Error('Please add items to your cart before applying a coupon.');
    }
    const res = await couponApi.validateCoupon({
      code: code.trim().toUpperCase(),
      storeId: cart.storeId,
      subtotal: cart.subtotal,
    });

    if (res.data && res.data.valid) {
      setAppliedCoupon(res.data);
      setDiscountAmount(res.data.discountAmount || 0);
      return res.data;
    } else {
      throw new Error(res.data?.message || 'Invalid promo code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const finalPayable = Math.max(0, (cart?.totalAmount || 0) - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalItems: cart?.totalItems || 0,
        subtotal: cart?.subtotal || 0,
        totalAmount: cart?.totalAmount || 0,
        discountAmount,
        finalPayable,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        storeName: cart?.storeName || null,
        storeId: cart?.storeId || null,
        conflictModal,
        addItem,
        confirmSwitchStore,
        cancelSwitchStore,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
