"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import useCart from "@/app/store/useCart";
import { API_BASE_URL } from "@/utils/api";

export interface ProductImage {
  imageName: string;
  image: string;
}

export interface ProductDetails {
  pid: number;
  pCode: string;
  productName: string;
  categoryName: string;
  subCategoryName: string;
  wishlistEnable: boolean;
  fullDescription?: string | null;
  howToUse?: string;
  details?: string;
  shareingUrl?: string;
  sellerName?: string | null;
  dp: number; // discounted price
  mrp: number; // original price
  bv: number;
  brandName?: string | null;
  maxQuantity: number;
  outstockPurchase: boolean;
  showQty: boolean;
  productImages: ProductImage[];
  productSpecifications: any[];
  productAttributes: any[];
}

interface ProductInfoProps {
  product: ProductDetails;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { cartItems, addItem, increaseQuantity, decreaseQuantity } = useCart();

  const productIdStr = String(product.pid);
  const inCart = cartItems.find((c) => String(c.item.id) === productIdStr);
  const qty = inCart?.quantity || 0;

  const handleAdd = () => {
    const item = {
      id: productIdStr,
      title: product.productName,
      brand: product.brandName ?? "Unknown",
      price: product.dp,
      img: product.productImages?.[0]
        ? `${API_BASE_URL}${product.productImages[0].image}`
        : "/fallback.png",
      category: product.categoryName,
    };
    addItem(item);
  };

  return (
    <div className="flex flex-col w-full md:w-full px-4">
      {/* Title & Brand */}
      <h1 className="text-2xl font-bold">{product.productName}</h1>
      {product.brandName && (
        <p className="text-gray-500 text-sm mt-1">by {product.brandName}</p>
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
          <li>Category: {product.categoryName}</li>
          <li>Sub Category: {product.subCategoryName}</li>
          <li>Product Code: {product.pCode}</li>
          <li>Max Quantity: {product.maxQuantity}</li>
          {product.sellerName && <li>Seller: {product.sellerName}</li>}
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
