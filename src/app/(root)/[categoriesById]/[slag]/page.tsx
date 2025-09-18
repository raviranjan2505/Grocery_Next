"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import ProductInfo from "@/components/Home/ProductInfo";
import ProductImageGallery from "@/components/Home/ProductImageGallery";
import ProductCard, { UIProductCard } from "@/components/Home/ProductCard";
import ProductCardSkeleton from "@/components/Loaders/ProductCardSkeleton";
import ProductImageGallerySkeleton from "@/components/Loaders/ProductImageGallerySkeleton";
import ProductInfoSkeleton from "@/components/Loaders/ProductInfoSkeleton";
import {ProductDetails,getProductDetails, getProductsBySlug, getCategoryById } from "@/lib/actions/action";
import { API_BASE_URL } from "@/utils/api";

export default function ProductDetailsPage() {
  const { slag, categoriesById } = useParams<{
    slag: string;
    categoriesById: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [products, setProducts] = useState<UIProductCard[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ get product details
        const prodRes = await getProductDetails(slag);
        if (!prodRes?.data) return notFound();
        setProduct(prodRes.data); // prodRes.data matches Product interface

        // ✅ get related category
        const relatedCategory = await getCategoryById(Number(categoriesById));
        if (relatedCategory?.data?.slagurl) {
          const slug = relatedCategory.data.slagurl;

          // ✅ get products by category slug
          const prodRes2 = await getProductsBySlug(slug);
          if (prodRes2?.data?.items) {
            const mapped: UIProductCard[] = prodRes2.data.items.map(
              (p: any): UIProductCard => ({
                id: String(p.productId ?? p.pid),
                categoryId: p.categoryId,
                title: p.productName,
                subtitle: p.productCode,
                price: p.dp,
                slag: p.slagurl,
                img: p.defaultImage?.startsWith("http")
                  ? p.defaultImage
                  : `${API_BASE_URL}${p.defaultImage}`,
                deliveryTime: "16 MINS",
              })
            );
            setProducts(mapped);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slag, categoriesById]);

  // ✅ Skeleton loader while fetching
  if (loading)
    return (
      <main className="px-4 md:px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductImageGallerySkeleton />
        <ProductInfoSkeleton />
        <div className="col-span-1 md:col-span-2 mt-12">
          <div className="w-1/3 h-6 mb-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    );

  // ✅ if no product found
  if (!product) return notFound();

  return (
    <main className="px-4 md:px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProductImageGallery
        images={
          product.productImages?.length
            ? product.productImages.map((img) =>
                img.image?.startsWith("http")
                  ? img.image
                  : `${API_BASE_URL}${img.image}`
              )
            : ["/image/bread.png"]
        }
        alt={product.productName || "Product"}
        fallbackImage="/image/bread.png"
      />

      <ProductInfo product={product} />

      {products.length > 0 && (
        <div className="col-span-1 md:col-span-2 mt-12">
          <h2 className="text-lg font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {products.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
