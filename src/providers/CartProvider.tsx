'use client';

import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthProvider';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);

  // Load cart when user changes
  useEffect(() => {
    const currentUserId = user?.id || 'guest';
    const storageKey = `orderapp_cart_${currentUserId}`;
    const savedCart = localStorage.getItem(storageKey);
    
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        setItems([]);
      }
    } else {
      setItems([]);
    }
    setLoadedUserId(currentUserId);
  }, [user?.id]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const currentUserId = user?.id || 'guest';
    // Only save if the current items belong to the current user
    if (loadedUserId === currentUserId) {
      const storageKey = `orderapp_cart_${currentUserId}`;
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, user?.id, loadedUserId]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);

      if (existingItem) {
        // Update quantity if item already in cart
        return prevItems.map((item) =>
          item.id === newItem.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + newItem.quantity, item.stock),
              }
            : item
        );
      }

      // Add new item
      return [...prevItems, { ...newItem, quantity: Math.min(newItem.quantity, newItem.stock) }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalPrice = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
