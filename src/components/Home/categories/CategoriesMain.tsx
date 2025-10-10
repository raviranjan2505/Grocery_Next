"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getCategories} from "@/lib/actions/action";
import CategoriesMainSkeleton from "@/components/Loaders/CategoriesMainSkeleton";

interface Category {
  id: number;
  title: string;
  img: string;
  bg: string;
}

export default function CategoriesMain() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Predefined promo backgrounds
  const promoImages = [
    { img: "/image/pharmacy.png", bg: "bg-cyan-200" },
    { img: "/image/electronic.png", bg: "bg-yellow-200" },
    { img: "/image/baby_care.png", bg: "bg-purple-100" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await getCategories();
        const firstThree = allCategories.slice(0, 3).map((cat, idx) => ({
          id: cat.categoryId,
          title: cat.categoryName,
          img: promoImages[idx].img, // override with promo image
          bg: promoImages[idx].bg,
        }));

        setCategories(firstThree);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  
  return (
    <div className="px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {loading
        ? Array.from({ length: 3 }).map((_, i) => <CategoriesMainSkeleton key={i} />) // ✅ use skeleton
        : categories.map((cat) => (
            <Link key={cat.id} href={`products/${cat.id}`}>
              <Card
                className={`rounded-2xl shadow-md p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg transition ${cat.bg}`}
              >
                <CardContent className="flex justify-between h-full">
                  <div>
                    <h2 className="text-lg font-bold">{cat.title}</h2>
                    <Button className="mt-4">Order Now</Button>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Image
                      src={cat.img}
                      alt={cat.title}
                      width={200}
                      height={120}
                      className="object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
    </div>
  );
}
