import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@workspace/api-client-react';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kloud_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('kloud_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    const existing = items.find(i => i.itemId === newItem.itemId);
    if (existing) {
      alert('Test already selected');
      return;
    }
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.itemId !== itemId));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
