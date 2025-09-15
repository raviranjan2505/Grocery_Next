"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import useCart from "@/app/store/useCart"; // adjust import if needed

interface DummyProduct {
  id: number;
  title: string;
  brand: string;
  description: string;
  category?: string;
  price: number;
  thumbnail?: string;
  images?: string[];
}

interface ProductInfoProps {
  product: DummyProduct;
  description: string;
  highlights: string[];
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, description, highlights }) => {
  const { cartItems, addItem, increaseQuantity, decreaseQuantity } = useCart();

  const productIdStr = product.id.toString();
  const inCart = cartItems.find((c) => String(c.item.id) === productIdStr);
  const qty = inCart?.quantity || 0;

  const handleAdd = () => {
    const item = {
      id: productIdStr,
      title: product.title,
      brand: product.brand,
      price: product.price,
      img: product.thumbnail ?? product.images?.[0] ?? "/fallback.png",
      category: product.category ?? "",
    };
    addItem(item);
  };

  const handleIncrease = () => increaseQuantity(productIdStr);
  const handleDecrease = () => decreaseQuantity(productIdStr);

  return (
    <div className="flex flex-col w-full md:w-full px-4">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="text-gray-500 text-sm mt-1">by {product.brand}</p>

    

      {/* Highlights */}
      <div className="mt-6">
        <h3 className="font-semibold">Highlights</h3>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          {highlights.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
  {/* Price and Add to Cart */}
      <div className="flex items-center gap-4 mt-6">
        <span className="text-2xl font-bold">₹{product.price}</span>

        {qty === 0 ? (
          <Button
            variant="outline"
            size="sm"
            className="border-green-600 text-white hover:bg-green-50 bg-green-500 "
            onClick={handleAdd}
          >
            ADD
          </Button>
        ) : (
          <div className="flex items-center gap-2 border border-green-600 rounded-md px-2 py-1 ">
            <button className="text-green-600 font-bold" onClick={handleDecrease}>
              −
            </button>
            <span className="text-sm">{qty}</span>
            <button className="text-green-600 font-bold" onClick={handleIncrease}>
              +
            </button>
          </div>
        )}
      </div>
      {/* Description */}
      <div className="mt-6">
        <h3 className="font-semibold">Product Details</h3>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
    </div>
  );
};

export default ProductInfo;
