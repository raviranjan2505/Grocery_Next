"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
  fallbackImage: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  alt,
  fallbackImage,
}) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || fallbackImage);

  return (
    <div className="flex flex-col items-center md:items-start w-full">
      {/* Main Image */}
      <div className="relative w-72 h-72 md:w-96 md:h-96 border rounded-lg overflow-hidden">
        <Image
          src={selectedImage || fallbackImage}
          alt={alt}
          fill
          className="object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackImage;
          }}
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 mt-4 flex-wrap">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={`relative w-16 h-16 border rounded-lg cursor-pointer overflow-hidden ${
              selectedImage === img ? "ring-2 ring-green-600" : ""
            }`}
          >
            <Image
              src={img || fallbackImage}
              alt={`${alt} thumbnail ${idx}`}
              fill
              className="object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = fallbackImage;
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
