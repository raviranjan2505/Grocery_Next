"use client";

import { create } from "zustand";
import { saveOrUpdateCart, getCartItems, getCartTotal, CartTotal } from "@/lib/actions/action";

export interface ProductType {
  id: string;
  title: string;
  price: number;
  img: string;
  subtitle?: string;
  categoryId?: string;
  deliveryTime?: string;
}

interface CartItem {
  item: ProductType;
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  cookieId: string | null;
  total: CartTotal | null;
  loading: boolean;
  initCookieId: () => void;
  fetchCart: () => Promise<void>;
  fetchTotal: () => Promise<void>;
  addItem: (item: ProductType, quantity?: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  increaseQuantity: (id: string) => Promise<void>;
  decreaseQuantity: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const useCart = create<CartStore>((set, get) => ({
  cartItems: [],
  cookieId: null,
  total: null,
  loading: false,

  // ✅ Always hydrate cookieId from localStorage on mount
  initCookieId: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cookieId");
      if (stored && !get().cookieId) {
        set({ cookieId: stored });
      }
    }
  },

  fetchCart: async () => {
    let cookieId = get().cookieId;

    if (!cookieId && typeof window !== "undefined") {
      cookieId = localStorage.getItem("cookieId") || null;
      if (cookieId) set({ cookieId });
    }
    if (!cookieId) return;

    set({ loading: true });
    const data = await getCartItems(cookieId);

    if (data) {
      set({
        cartItems: data.items.map(i => ({
          item: {
            id: i.productId,
            title: i.productName,
            price: parseFloat(i.dp),
            img: i.picture?.thumbImageUrl
          },
          quantity: i.quantity
        })),
        cookieId: data.cookieId,
        loading: false
      });
      localStorage.setItem("cookieId", data.cookieId);
    } else {
      set({ loading: false });
    }
  },

  fetchTotal: async () => {
    const cookieId = get().cookieId || localStorage.getItem("cookieId");
    if (!cookieId) return;

    const totalData = await getCartTotal(cookieId);
    if (totalData) set({ total: totalData });
  },

  addItem: async (item, quantity = 1) => {
    const cookieId = get().cookieId || localStorage.getItem("cookieId") || undefined;

    set({ loading: true });
    const data = await saveOrUpdateCart(item.id, quantity, "insert", cookieId);

    if (data) {
      localStorage.setItem("cookieId", data.cookieId);
      set({
        cartItems: data.items.map(i => ({
          item: {
            id: i.productId,
            title: i.productName,
            price: parseFloat(i.dp),
            img: i.picture?.thumbImageUrl
          },
          quantity: i.quantity
        })),
        cookieId: data.cookieId,
        loading: false
      });
      await get().fetchTotal();
    } else set({ loading: false });
  },

  removeItem: async (id) => {
    const cookieId = get().cookieId || localStorage.getItem("cookieId");
    if (!cookieId) return;

    set({ loading: true });
    const data = await saveOrUpdateCart(id, 0, "remove", cookieId);

    if (data) {
      set({
        cartItems: data.items.map(i => ({
          item: {
            id: i.productId,
            title: i.productName,
            price: parseFloat(i.dp),
            img: i.picture?.thumbImageUrl
          },
          quantity: i.quantity
        })),
        cookieId: data.cookieId,
        loading: false
      });
      await get().fetchTotal();
    } else set({ loading: false });
  },

  increaseQuantity: async (id) => {
    const item = get().cartItems.find(ci => ci.item.id === id);
    const cookieId = get().cookieId || localStorage.getItem("cookieId");
    if (!item || !cookieId) return;

    const newQty = item.quantity + 1;
    const data = await saveOrUpdateCart(item.item.id, newQty, "insert", cookieId);

    if (data) {
      localStorage.setItem("cookieId", data.cookieId);
      set({
        cartItems: data.items.map(i => ({
          item: { id: i.productId, title: i.productName, price: parseFloat(i.dp), img: i.picture?.thumbImageUrl },
          quantity: i.quantity
        })),
        cookieId: data.cookieId
      });
      await get().fetchTotal();
    }
  },

  decreaseQuantity: async (id) => {
    const item = get().cartItems.find(ci => ci.item.id === id);
    const cookieId = get().cookieId || localStorage.getItem("cookieId");
    if (!item || !cookieId) return;

    const newQty = item.quantity - 1;

    if (newQty <= 0) {
      await get().removeItem(id);
      return;
    }

    const data = await saveOrUpdateCart(item.item.id, newQty, "insert", cookieId);

    if (data) {
      set({
        cartItems: data.items.map(i => ({
          item: { id: i.productId, title: i.productName, price: parseFloat(i.dp), img: i.picture?.thumbImageUrl },
          quantity: i.quantity
        })),
        cookieId: data.cookieId
      });
      await get().fetchTotal();
    }
  },

  clearCart: async () => {
  const items = get().cartItems.map(ci => ci.item.id);
  for (const id of items) {
    await get().removeItem(id);
  }

  // ✅ Clear cookieId from state and localStorage
  set({ cookieId: null, total: null, cartItems: [] });
  if (typeof window !== "undefined") {
    localStorage.removeItem("cookieId");
  }
},
}));

export default useCart;
