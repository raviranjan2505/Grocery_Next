"use client";

export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow-sm p-3">
      {/* Image */}
      <div className="w-full h-32 bg-gray-200 rounded-lg mb-3" />

      {/* Title */}
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />

      {/* Subtitle */}
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />

      {/* Price */}
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  );
}
