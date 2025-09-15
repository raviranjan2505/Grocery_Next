"use client";

import Slider from "react-slick";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductSliderSkeleton({ title }: { title: string }) {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  // create fake placeholders
  const placeholders = Array.from({ length: 8 });

  return (
    <section className="px-4 md:px-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
        <div className="h-4 w-12 bg-gray-200 animate-pulse rounded" />
      </div>

      <Slider {...settings}>
        {placeholders.map((_, idx) => (
          <div key={idx} className="px-2">
            <ProductCardSkeleton />
          </div>
        ))}
      </Slider>
    </section>
  );
}
