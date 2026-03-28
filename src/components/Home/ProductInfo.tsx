"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import useCart from "@/app/store/useCart";
import { API_BASE_URL } from "@/utils/api";
import type { Product } from "@/lib/data";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { cartItems, addItem, increaseQuantity, decreaseQuantity } = useCart();

  const productIdStr = String(product.id);
  const inCart = cartItems.find((c) => String(c.item.id) === productIdStr);
  const qty = inCart?.quantity || 0;

  const handleAdd = () => {
    const item = {
      id: productIdStr,
      title: product.productName,
      brand: product.brand?.name ?? "Unknown",
      price: product.dp,
      img: product.images?.[0]
        ? `${API_BASE_URL}${product.images[0].url}`
        : "/fallback.png",
      category: product.category?.name || "",
    };
    addItem(item);
  };

  return (
    <div className="flex flex-col w-full md:w-full px-4">
      {/* Title & Brand */}
      <h1 className="text-2xl font-bold">{product.productName}</h1>
      {product.brand?.name && (
        <p className="text-gray-500 text-sm mt-1">by {product.brand.name}</p>
      )}

      {/* Price */}
      <div className="flex items-center gap-3 mt-4">
        <span className="text-2xl font-bold text-green-600">₹{product.dp}</span>
        <span className="text-gray-400 line-through">₹{product.mrp}</span>
      </div>

      {/* Highlights */}
      <div className="mt-6">
        <h3 className="font-semibold">Highlights</h3>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li>Category: {product.category?.name}</li>
          <li>Brand: {product.brand?.name}</li>
          <li>Product Code: {product.productCode}</li>
          <li>Stock: {product.stockQuantity}</li>
        </ul>
      </div>

      {/* Cart Controls */}
      <div className="flex items-center gap-4 mt-6">
        {qty === 0 ? (
          <Button
            variant="outline"
            size="sm"
            className="border-green-600 text-white hover:bg-green-50 bg-green-500"
            onClick={handleAdd}
          >
            ADD
          </Button>
        ) : (
          <div className="flex items-center gap-2 border border-green-600 rounded-md px-2 py-1">
            <button
              className="text-green-600 font-bold"
              onClick={() => decreaseQuantity(productIdStr)}
            >
              −
            </button>
            <span className="text-sm">{qty}</span>
            <button
              className="text-green-600 font-bold"
              onClick={() => increaseQuantity(productIdStr)}
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mt-6">
        <h3 className="font-semibold">Product Details</h3>
        <p className="text-gray-600 mt-2">
          {product.fullDescription || product.details || "No description"}
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;
