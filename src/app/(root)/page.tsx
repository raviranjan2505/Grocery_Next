"use client";
import Hero from "@/components/Home/Hero";
import Categories from "@/components/Home/categories/Categories";
import ProductSlidersPage from "@/components/Home/ProductSlidersPage";
import CategoriesMain from "@/components/Home/categories/CategoriesMain";


export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesMain />
      <Categories />
      <ProductSlidersPage />
    </>
  );
}
