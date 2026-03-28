"use client";

import { create } from "zustand";

import {
  addWishlistProduct,
  getProductByProductId,
  getWishlistEntries,
  removeWishlistProduct,
  type WishlistEntry,
} from "@/lib/actions/wishlist";

type WishlistProduct = {
  productId: number;
  title: string;
  price: number;
  image: string | null;
  categoryId: number | null;
  productSlug: string | null;
};

type WishlistState = {
  entries: WishlistEntry[];
  products: WishlistProduct[];
  loading: boolean;
  syncing: boolean;
  initialized: boolean;

  fetchEntries: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  toggle: (productId: number) => Promise<{ added: boolean } | null>;
  isWishlisted: (productId: number | string) => boolean;
  clear: () => void;
};

function normalizeProductId(productId: number | string) {
  const n = typeof productId === "number" ? productId : Number(productId);
  return Number.isFinite(n) ? n : null;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  entries: [],
  products: [],
  loading: false,
  syncing: false,
  initialized: false,

  clear: () => set({ entries: [], products: [], initialized: false, loading: false, syncing: false }),

  fetchEntries: async () => {
    set({ loading: true });
    try {
      const entries = await getWishlistEntries();
      set({ entries, initialized: true });
    } catch {
      set({ entries: [], initialized: true });
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    const { entries } = get();
    if (!entries.length) {
      set({ products: [] });
      return;
    }

    set({ loading: true });
    try {
      const products = await Promise.all(
        entries.map(async (e) => {
          try {
            const res = await getProductByProductId(e.productId);
            const p = res?.data ?? null;
            if (!p) {
              return {
                productId: e.productId,
                title: `Product #${e.productId}`,
                price: 0,
                image: null,
                categoryId: null,
                productSlug: null,
              } satisfies WishlistProduct;
            }

            return {
              productId: e.productId,
              title: String(p.productName || p.title || "Product"),
              price: Number(p.dp ?? p.price ?? 0),
              image: (p.defaultImage || p.images?.[0]?.url || null) as string | null,
              categoryId: typeof p.categoryId === "number" ? p.categoryId : null,
              productSlug: (p.productSlug || p.productSlugUrl || p.slug || null) as string | null,
            } satisfies WishlistProduct;
          } catch {
            return {
              productId: e.productId,
              title: `Product #${e.productId}`,
              price: 0,
              image: null,
              categoryId: null,
              productSlug: null,
            } satisfies WishlistProduct;
          }
        })
      );

      set({ products });
    } finally {
      set({ loading: false });
    }
  },

  isWishlisted: (productId) => {
    const normalized = normalizeProductId(productId);
    if (!normalized) return false;
    return get().entries.some((e) => e.productId === normalized);
  },

  toggle: async (productId) => {
    const id = normalizeProductId(productId);
    if (!id) return null;

    set({ syncing: true });
    try {
      const already = get().entries.some((e) => e.productId === id);
      if (already) {
        const res = await removeWishlistProduct(id);
        if (res?.success) {
          set({
            entries: get().entries.filter((e) => e.productId !== id),
            products: get().products.filter((p) => p.productId !== id),
          });
          return { added: false };
        }
        return null;
      }

      const res = await addWishlistProduct(id);
      if (res?.success) {
        await get().fetchEntries();
        return { added: true };
      }
      return null;
    } finally {
      set({ syncing: false });
    }
  },
}));
