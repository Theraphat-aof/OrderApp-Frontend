'use client';

import { useContext } from 'react';
import { CartContext, CartContextType } from '@/providers/CartProvider';

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
