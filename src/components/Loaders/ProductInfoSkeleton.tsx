"use client";

export default function ProductInfoSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Product Name */}
      <div className="w-3/4 h-6 bg-gray-200 rounded"></div>

      {/* Product Code / Category */}
      <div className="w-1/2 h-4 bg-gray-200 rounded"></div>

      {/* Description */}
      <div className="space-y-2">
        <div className="w-full h-3 bg-gray-200 rounded"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
        <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4 mt-4">
        <div className="w-24 h-10 bg-gray-200 rounded-md"></div>
        <div className="w-24 h-10 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
}
