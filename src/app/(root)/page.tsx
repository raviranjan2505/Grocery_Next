"use client";
import Hero from "@/components/Home/Hero";
import CategoriesSmall from "@/components/Home/categories/CategoriesSmall";
import ProductSlidersPage from "@/components/Home/ProductSlidersPage";
import CategoriesMain from "@/components/Home/categories/CategoriesMain";


export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesMain />
      <CategoriesSmall />
      <ProductSlidersPage />
    </>
  );
}
