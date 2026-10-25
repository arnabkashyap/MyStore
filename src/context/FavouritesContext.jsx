import React, { createContext, useContext, useState, useEffect } from 'react';

const FAVOURITES_STORAGE_KEY = 'baishya_showroom_favourites_v1';

const FavouritesContext = createContext(null);

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState(() => {
    try {
      const stored = localStorage.getItem(FAVOURITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse showroom favourites from localStorage:', err);
    }
    return [];
  });

  // Sync favourites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favourites));
    } catch (err) {
      console.warn('Failed to save showroom favourites to localStorage:', err);
    }
  }, [favourites]);

  /**
   * Check if a product is in favourites by id
   */
  const isFavourite = (productId) => {
    if (!productId) return false;
    return favourites.some((item) => item.id === productId);
  };

  /**
   * Add a product to favourites
   */
  const addFavourite = (product) => {
    if (!product || !product.id) return;
    setFavourites((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }
      return [
        {
          ...product,
          savedAt: new Date().toISOString()
        },
        ...prev
      ];
    });
  };

  /**
   * Remove a product from favourites by its id
   */
  const removeFavourite = (productId) => {
    if (!productId) return;
    setFavourites((prev) => prev.filter((item) => item.id !== productId));
  };

  /**
   * Toggle favourite status for a product
   */
  const toggleFavourite = (product) => {
    if (!product || !product.id) return;
    setFavourites((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [
          {
            ...product,
            savedAt: new Date().toISOString()
          },
          ...prev
        ];
      }
    });
  };

  /**
   * Clear all items in favourites
   */
  const clearFavourites = () => {
    setFavourites([]);
  };

  const favouritesCount = favourites.length;

  const value = {
    favourites,
    isFavourite,
    addFavourite,
    removeFavourite,
    toggleFavourite,
    clearFavourites,
    favouritesCount
  };

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
}
