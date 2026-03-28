"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getCategories } from "@/lib/actions/action";
import { API_BASE_URL } from "@/utils/api";
import type { Category } from "@/lib/data";
import CategorySkeleton from "@/components/Loaders/CategorySkeleton";

interface CatDisplay {
  id: number;
  title: string;
  img: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<CatDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await getCategories();
        const mapped = allCategories.map((cat: Category) => ({
          id: cat.id,
          title: cat.name,
          img: cat.image ? `${cat.image}` : "/image/daily_use.png",
        }));

        setCategories(mapped);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="px-4 md:px-6 pb-10 mt-10">
      <h3 className="text-lg md:text-xl font-semibold mb-4">
        Shop by category
      </h3>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
          : categories.map((cat) => (
              <Link key={cat.id} href={`products/${cat.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition rounded-xl h-[190px]">
                  <CardContent className="p-2 flex flex-col items-center">
                    <Image
                      src={cat.img}
                      alt={cat.title}
                      width={100}
                      height={100}
                      className="rounded-lg object-contain"
                    />
                    <p className="mt-2 text-xs md:text-sm font-medium text-center">
                      {cat.title}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>
    </section>
  );
};

export default Categories;
