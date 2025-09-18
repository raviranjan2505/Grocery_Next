"use client";

import { useEffect, useState } from "react";
import { getCategoryById, getProductsBySlug } from "@/lib/actions/action";
import ProductCard, { UIProductCard } from "@/components/Home/ProductCard";
import SkeletonLoader from "@/components/Loaders/SkeletonLoader";
import { API_BASE_URL } from "@/utils/api";
import React from 'react';
import { use } from 'react'; // Import use hook

interface CategoryPageProps {
  params: Promise<{ categoriesById: string }>;
}

interface CategoryNode {
  categoryId: number;
  categoryName: string;
  slagurl: string;
  thumbnail?: string;
  subcategories: CategoryNode[];
}

export default function CategoryWithProducts({ params }: CategoryPageProps) {
const unwrappedParams = use(params);
const { categoriesById } = unwrappedParams;
  const [subcategories, setSubcategories] = useState<CategoryNode[]>([]);
  const [products, setProducts] = useState<UIProductCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const catRes = await getCategoryById(Number(categoriesById));

      if (catRes?.data) {
        const parentSlug = catRes.data.slagurl;
 

        if (catRes.data.subcategories?.length > 0) {
          setSubcategories(catRes.data.subcategories);
        }
        if (parentSlug) {
          const prodRes = await getProductsBySlug(parentSlug);
          if (prodRes?.data?.items) {
            const mapped = prodRes.data.items.map(
              (p: any): UIProductCard => ({
                id: String(p.productId),
                categoryId: p.categoryId,
                title: p.productName,
                subtitle: p.productCode,
                price: p.dp,
                slag:p.slagurl,
                img: p.defaultImage.startsWith("http")
                  ? p.defaultImage
                  : `${API_BASE_URL}${p.defaultImage}`,
                deliveryTime: "16 MINS",
              })
            );
             console.log(mapped, "product details of specific categries")
            setProducts(mapped);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [categoriesById]);

  if (loading) {
    return (
      <div className="flex">
        <aside className="w-52 border-r bg-white h-screen sticky top-0 overflow-y-auto">
          <SkeletonLoader type="category" count={5} />
        </aside>
        <main className="flex-1 p-4 bg-gray-50">
          <SkeletonLoader type="product" count={8} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* LEFT: Sticky Sidebar */}
      <aside className="w-40 border-r bg-white h-screen sticky top-0 overflow-y-auto">
        {subcategories.map((sub) => (
          <button
            key={sub.categoryId}
            className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 transition"
          >
            <div className="w-7 h-7 bg-gray-200 rounded-md" />
            <span>{sub.categoryName}</span>
          </button>
        ))}
      </aside>

      {/* RIGHT: Products Grid */}
      <main className="flex-1 p-4 overflow-y-auto h-[calc(100vh-100px)] bg-gray-50">
        {products.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
