'use client';

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { Book } from '@/lib/supabase';

type CartItem = {
  book: Book;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  total: number;
};

type CartAction =
  | { type: 'ADD_ITEM'; book: Book }
  | { type: 'REMOVE_ITEM'; bookId: string }
  | { type: 'UPDATE_QUANTITY'; bookId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.book.id === action.book.id);
      const items = existing
        ? state.items.map((i) =>
            i.book.id === action.book.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state.items, { book: action.book, quantity: 1 }];
      const total = items.reduce((sum, i) => sum + i.book.price * i.quantity, 0);
      return { items, total };
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter((i) => i.book.id !== action.bookId);
      const total = items.reduce((sum, i) => sum + i.book.price * i.quantity, 0);
      return { items, total };
    }
    case 'UPDATE_QUANTITY': {
      const items = action.quantity === 0
        ? state.items.filter((i) => i.book.id !== action.bookId)
        : state.items.map((i) =>
            i.book.id === action.bookId ? { ...i, quantity: action.quantity } : i
          );
      const total = items.reduce((sum, i) => sum + i.book.price * i.quantity, 0);
      return { items, total };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    case 'LOAD_CART': {
      const total = action.items.reduce((sum, i) => sum + i.book.price * i.quantity, 0);
      return { items: action.items, total };
    }
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  itemCount: number;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('sonic_cart');
    if (saved) {
      try {
        const items = JSON.parse(saved);
        dispatch({ type: 'LOAD_CART', items });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sonic_cart', JSON.stringify(state.items));
  }, [state.items]);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ state, dispatch, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
