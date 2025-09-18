"use client"

import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import useCart from "@/app/store/useCart"

interface CartViewProps {
  token: string | null
  onLoginRequired: () => void
  onProceed: () => void
}

export default function CartView({ token, onLoginRequired, onProceed }: CartViewProps) {
  const { cartItems, increaseQuantity, decreaseQuantity, removeItem } = useCart()

  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.quantity * i.item.price,
    0
  )

  const handleCheckout = () => {
    if (!token) {
      onLoginRequired()
    } else {
      onProceed()
    }
  }

  return (
    <>
      {cartItems.length === 0 ? (
        <p className="text-sm text-gray-500">Your cart is empty</p>
      ) : (
        cartItems.map(({ item, quantity }) => (
          <div
            key={`cart-item-${item.id}`}
            className="flex justify-between items-center mb-3"
          >
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.img}
                alt={item.title}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-gray-500">₹{item.price}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-2 border border-green-600 rounded-md px-2 py-1">
                <button
                  className="text-green-600 font-bold"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  className="text-green-600 font-bold"
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </button>
              </div>
              <button
                className="text-red-500 ml-2"
                onClick={() => removeItem(item.id)}
              >
                <Trash />
              </button>
            </div>
          </div>
        ))
      )}

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="border-t pt-4 mt-4">
          <p className="text-right font-semibold mb-2">
            Total: ₹{totalPrice}
          </p>
          <Button
            className="w-full bg-green-600 text-white disabled:opacity-50"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            {token ? "Proceed" : "Login to Continue"}
          </Button>
        </div>
      )}
    </>
  )
}
