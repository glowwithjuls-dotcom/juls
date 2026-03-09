'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  slug: string;
  quantity: number;
};

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((cartItem) => cartItem.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map((cartItem) =>
              cartItem.productId === item.productId
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem,
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (productId) => set({ items: get().items.filter((item) => item.productId !== productId) }),
      updateQuantity: (productId, quantity) =>
        set({ items: get().items.map((item) => (item.productId === productId ? { ...item, quantity } : item)) }),
      clear: () => set({ items: [] }),
    }),
    { name: 'titis-cart-storage' },
  ),
);

export const useCartTotals = () => {
  const items = useCartStore((state) => state.items);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, totalItems };
};
