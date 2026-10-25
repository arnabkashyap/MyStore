import React, { createContext, useContext, useState, useEffect } from 'react';

const CART_STORAGE_KEY = 'baishya_showroom_enquiry_cart_v1';

const EnquiryCartContext = createContext(null);

export function EnquiryCartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse enquiry cart from localStorage:', err);
    }
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Failed to save enquiry cart to localStorage:', err);
    }
  }, [items]);

  /**
   * Add a product to the enquiry cart.
   * If product already exists, increment its quantity.
   */
  const addItem = (product, quantity = 1, notes = '') => {
    if (!product || !product.id) return;
    const addQty = Math.max(1, Number(quantity) || 1);

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex >= 0) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + addQty,
          notes: notes || updated[existingIndex].notes || '',
        };
        return updated;
      }

      return [
        ...prevItems,
        {
          product,
          quantity: addQty,
          notes: notes || '',
          addedAt: new Date().toISOString(),
        },
      ];
    });
  };

  /**
   * Update quantity of an item in the cart.
   * If quantity <= 0, remove the item.
   */
  const updateQuantity = (productId, newQuantity) => {
    const qty = Number(newQuantity);
    if (isNaN(qty) || qty <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.min(99, Math.max(1, qty)) } : item
      )
    );
  };

  /**
   * Remove a single product from the cart by its id.
   */
  const removeItem = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  /**
   * Clear all items in the enquiry cart.
   */
  const clearCart = () => {
    setItems([]);
  };

  /**
   * Update optional customer notes for a specific item.
   */
  const updateItemNotes = (productId, notes) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, notes } : item
      )
    );
  };

  // Derived counts
  const totalItemsCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const uniqueItemsCount = items.length;

  const value = {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    updateItemNotes,
    totalItemsCount,
    uniqueItemsCount,
  };

  return (
    <EnquiryCartContext.Provider value={value}>
      {children}
    </EnquiryCartContext.Provider>
  );
}

export function useEnquiryCart() {
  const context = useContext(EnquiryCartContext);
  if (!context) {
    throw new Error('useEnquiryCart must be used within an EnquiryCartProvider');
  }
  return context;
}
