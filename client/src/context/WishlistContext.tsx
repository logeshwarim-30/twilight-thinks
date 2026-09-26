import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { api } from '../services/api';

interface WishlistContextType {
  wishlist: string[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string, productName?: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('twilight_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync with user's wishlist when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.wishlist) {
      setWishlist(user.wishlist);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    localStorage.setItem('twilight_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const toggleWishlist = async (productId: string, productName = 'Product') => {
    const isPresent = wishlist.includes(productId);
    const updated = isPresent
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    setWishlist(updated);

    if (isPresent) {
      showToast(`${productName} removed from wishlist`, 'info');
    } else {
      showToast(`${productName} added to wishlist`, 'success');
    }

    if (isAuthenticated) {
      try {
        await api.toggleWishlist(productId);
      } catch (err) {
        console.error('[Wishlist] Sync error:', err);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
