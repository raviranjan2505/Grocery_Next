"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // shadcn utility (if you have it)
import React from "react";

interface SkeletonLoaderProps {
  count?: number;
  type?: "product" | "category";
  className?: string;
}

export default function SkeletonLoader({
  count = 6,
  type = "product",
  className,
}: SkeletonLoaderProps) {
  const skeletons = Array.from({ length: count });

  return (
    <div
      className={cn(
        type === "product"
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          : "flex flex-col gap-2 px-2 py-3",
        className
      )}
    >
      {skeletons.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.3, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className={cn(
            "rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse",
            type === "product" ? "h-40 w-full" : "h-10 w-full"
          )}
        />
      ))}
    </div>
  );
}
