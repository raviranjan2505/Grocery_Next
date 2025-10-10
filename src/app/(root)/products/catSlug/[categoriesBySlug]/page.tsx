"use client";
import { useEffect, useState } from "react";
import { getProductsBySlug } from "@/lib/actions/action";
import ProductCard, { UIProductCard } from "@/components/Home/ProductCard";
import { API_BASE_URL } from "@/utils/api";
import SkeletonLoader from "@/components/Loaders/SkeletonLoader";
import React from "react";
import { use } from "react"; 

interface CategoryPageProps {
  params: Promise<{ categoriesBySlug: string }>;
}

export default function GetProductByCategoriesSlug({ params }: CategoryPageProps) {
  const unwrappedParams = use(params);
    const { categoriesBySlug } = unwrappedParams;


  const [products, setProducts] = useState<UIProductCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const prodRes = await getProductsBySlug(categoriesBySlug);
        if (prodRes?.data?.items) {
          const mapped = prodRes.data.items.map(
            (p: any): UIProductCard => ({
              id: String(p.productId),
              categoryId: p.categoryId,
              title: p.productName,
              subtitle: p.productCode,
              price: p.dp,
              slag: p.slagurl,
              img: p.defaultImage.startsWith("http")
                ? p.defaultImage
                : `${API_BASE_URL}${p.defaultImage}`,
              deliveryTime: "16 MINS",
            })
          );
          setProducts(mapped);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoriesBySlug]);


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

    <main className="flex-1 p-4 overflow-y-auto h-[calc(100vh-100px)] bg-gray-50">
      {products.length === 0 ? (
        <p className="text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          }
        </div>
      )}
    </main>
  );
}
