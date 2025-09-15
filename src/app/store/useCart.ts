import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface ProductType {
  id: string
  title: string
  price: number
  img: string
  subtitle?: string
  categoryId?: string
  deliveryTime?: string
}

interface CartItem {
  item: ProductType
  quantity: number
}

interface CartStore {
  cartItems: CartItem[]
  addItem: (item: ProductType) => void
  removeItem: (id: string) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  clearCart: () => void
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      cartItems: [],
      addItem: (item) => {
        const existing = get().cartItems.find((ci) => ci.item.id === item.id)
        if (existing) {
          set({
            cartItems: get().cartItems.map((ci) =>
              ci.item.id === item.id
                ? { ...ci, quantity: ci.quantity + 1 }
                : ci
            ),
          })
        } else {
          set({ cartItems: [...get().cartItems, { item, quantity: 1 }] })
        }
      },
      removeItem: (id) =>
        set({ cartItems: get().cartItems.filter((ci) => ci.item.id !== id) }),
      increaseQuantity: (id) =>
        set({
          cartItems: get().cartItems.map((ci) =>
            ci.item.id === id ? { ...ci, quantity: ci.quantity + 1 } : ci
          ),
        }),
      decreaseQuantity: (id) =>
        set({
          cartItems: get().cartItems
            .map((ci) =>
              ci.item.id === id
                ? { ...ci, quantity: Math.max(ci.quantity - 1, 0) }
                : ci
            )
            .filter((ci) => ci.quantity > 0),
        }),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useCart
