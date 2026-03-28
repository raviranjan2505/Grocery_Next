import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Address } from "@/lib/data";

interface AddressStore {
  selectedAddress: Address | null
  setSelectedAddress: (addr: Address | null) => void
  clearAddress: () => void
}

const useAddressStore = create(
  persist<AddressStore>(
    (set) => ({
      selectedAddress: null,
      setSelectedAddress: (addr) => set({ selectedAddress: addr }),
      clearAddress: () => set({ selectedAddress: null }),
    }),
    {
      name: "address-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
export default useAddressStore;

