"use client";

export default function ProductImageGallerySkeleton() {
  return (
    <div className="animate-pulse">
      {/* Main Image */}
      <div className="w-full h-80 md:h-[400px] bg-gray-200 rounded-md mb-4"></div>

      {/* Thumbnails */}
      <div className="flex space-x-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-16 h-16 bg-gray-200 rounded-md"></div>
        ))}
      </div>
    </div>
  );
}
