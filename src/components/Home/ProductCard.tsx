"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import useCart from "@/app/store/useCart"

export interface UIProductCard {
  id: string
  categoryId: string
  title: string
  subtitle: string
  price: number
  slag: string
  img: string
  deliveryTime?: string
}

interface ProductCardProps {
  product: UIProductCard
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cartItems, addItem, increaseQuantity, decreaseQuantity } = useCart()
  const inCart = cartItems.find((c) => c.item.id === product.id)
  const qty = inCart?.quantity || 0

  return (
    <div className="bg-white rounded-2xl shadow-md p-3 hover:shadow-lg transition duration-200 h-full flex flex-col justify-between border border-gray-300">
      {/* Product Image */}
      <Link href={`/products/${product.categoryId}/${product.slag}`} className="block">
        <div className="relative w-full h-36 md:h-40 lg:h-44 mb-2">
          <Image
            src={product.img || "/fallback.png"}
            alt={product.title}
            fill
            className="object-contain rounded-lg"
            sizes="(max-width: 768px) 100vw, 200px"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-col gap-1">
        {product.deliveryTime && (
          <span className="text-[10px] sm:text-xs text-green-600 font-medium">
            {product.deliveryTime}
          </span>
        )}

        <h3 className="text-xs sm:text-sm font-medium line-clamp-1">
          {product.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-1">
          {product.subtitle}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] sm:text-xs font-semibold text-gray-800">
            ₹{product.price}
          </span>

          {qty === 0 ? (
            <Button
              variant="outline"
              size="sm"
              className="border-green-600 text-green-600 hover:bg-green-50 text-[11px] sm:text-sm"
              onClick={() => addItem(product)}
            >
              ADD
            </Button>
          ) : (
            <div className="flex items-center gap-2 border border-green-600 rounded-md px-2 py-1">
              <button
                className="text-green-600 font-bold text-[11px] sm:text-base"
                onClick={() => decreaseQuantity(product.id)}
              >
                −
              </button>
              <span className="text-[11px] sm:text-sm">{qty}</span>
              <button
                className="text-green-600 font-bold text-[11px] sm:text-base"
                onClick={() => increaseQuantity(product.id)}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
