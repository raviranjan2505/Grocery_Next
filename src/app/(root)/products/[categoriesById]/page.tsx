"use client";

import { useEffect, useState } from "react";
import {
  getCategoryById,
  getProductsBySlug,
  getProductsBySubCategoriesSlug,
} from "@/lib/actions/action";
import ProductCard, { UIProductCard } from "@/components/Home/ProductCard";
import SkeletonLoader from "@/components/Loaders/SkeletonLoader";
import { API_BASE_URL } from "@/utils/api";
import React from "react";
import { use } from "react"; 

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
  const [parentSlug, setParentSlug] = useState<string>("");
  const PAGE_SIZE = 50;

  const mapProductsToUI = (items: any[]): UIProductCard[] =>
    items.map(
      (p: any): UIProductCard => ({
        id: String(p.id),
        categoryId: String(p.categoryId),
        title: p.productName,
        subtitle: p.productCode,
        price: Number(p.dp ?? 0),
        slag: p.productSlug || p.productCode,
        img: p.defaultImage?.startsWith("http")
          ? p.defaultImage
          : p.defaultImage
            ? `${API_BASE_URL}${p.defaultImage}`
            : "/image/bread.png",
        deliveryTime: "16 MINS",
      })
    );

  const fetchAllCategoryProducts = async (slug: string) => {
    let page = 1;
    let totalPages = 1;
    const allItems: any[] = [];

    while (page <= totalPages) {
      const prodRes = await getProductsBySlug(slug, page, PAGE_SIZE);
      const items = Array.isArray(prodRes?.data?.items) ? prodRes.data.items : [];
      totalPages = Number(prodRes?.data?.totalPages || 1);
      allItems.push(...items);
      page += 1;
    }

    return allItems;
  };

  const fetchAllSubcategoryProducts = async (parent: string, subcategorySlug: string) => {
    let page = 1;
    let totalPages = 1;
    const allItems: any[] = [];

    while (page <= totalPages) {
      const prodRes = await getProductsBySubCategoriesSlug(parent, subcategorySlug, page, PAGE_SIZE);
      const items = Array.isArray(prodRes?.data?.items) ? prodRes.data.items : [];
      totalPages = Number(prodRes?.data?.totalPages || 1);
      allItems.push(...items);
      page += 1;
    }

    return allItems;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        console.log("Fetching category for ID:", categoriesById);
        const catRes = await getCategoryById(Number(categoriesById));
        console.log("Category response:", catRes);

        if (catRes?.data) {
          const parentSlugFromApi = catRes.data.slug;
          console.log("Parent slug:", parentSlugFromApi);
          setParentSlug(parentSlugFromApi);

          if (catRes.data.subcategories?.length > 0) {
            const mappedSubs = catRes.data.subcategories.map((sub: any) => ({
              categoryId: sub.id,
              categoryName: sub.name,
              slagurl: sub.slug || sub.slagurl || "",
              thumbnail: sub.image,
              subcategories: sub.subcategories || [],
            }));
            setSubcategories(mappedSubs);
            console.log("Subcategories set:", mappedSubs);
          }

          // default products (parent category)
          if (parentSlugFromApi) {
            const allItems = await fetchAllCategoryProducts(parentSlugFromApi);
            console.log("Products for parent category:", allItems.length);
            if (allItems.length > 0) {
              const mapped = mapProductsToUI(allItems);
              setProducts(mapped);
              console.log("Products mapped and set:", mapped);
            } else {
              console.log("No products found in response");
            }
          } else {
            console.log("No parent slug available");
          }
        } else {
          console.log("No category data received");
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoriesById]);

  // ✅ load products by subcategory click
  const handleSubcategoryClick = async (subcategorySlug: string) => {
    try {
      if (!subcategorySlug || !parentSlug) {
        setProducts([]);
        return;
      }
      setLoading(true);
      const allItems = await fetchAllSubcategoryProducts(parentSlug, subcategorySlug);

      if (allItems.length > 0) {
        const mapped = mapProductsToUI(allItems);
        setProducts(mapped);
      } else {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

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
      <aside className="w-32 md:w-40 border-r bg-white h-screen sticky top-0 overflow-y-auto">
        {subcategories.map((sub) => (
          <button
            key={sub.categoryId}
            onClick={() => handleSubcategoryClick(sub.slagurl)} // ✅ fetch by slug
            className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 transition"
          >
            <div className="w-7 h-7 bg-gray-200 rounded-md hidden md:block" />
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
