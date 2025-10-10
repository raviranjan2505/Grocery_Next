"use client";

import { useEffect, useState } from "react";
import ProductSlider from "./ProductSlider";
import { getCategoriesForSlider } from "@/lib/actions/action";
import { SliderProduct } from "./ProductSlider";
import ProductSliderSkeleton from "../Loaders/ProductSliderSkeleton";

export default function ProductSlidersPage() {
  const [categories, setCategories] = useState<
    { slug: string; name: string; categorySlagUrl:string; products: SliderProduct[] }[]
  >([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCategoriesForSlider();
        setCategories(data);
        
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="p-4">
        {[...Array(3)].map((_, idx) => (
          <ProductSliderSkeleton key={idx} title="Loading..." />
        ))}
      </main>
    );
  }

  return (
    <main className="p-4">
      {categories.map((cat) => (
        <ProductSlider
          key={cat.slug}
          title={cat.name}
          categorySlagUrl ={cat.categorySlagUrl}
          products={cat.products}
        />
      ))}
    </main>
  );
}
