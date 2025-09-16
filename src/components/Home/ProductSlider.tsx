"use client";
import Slider from "react-slick";
import ProductCard, { UIProductCard } from "@/components/Home/ProductCard";
import { useEffect, useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export interface SliderProduct {
  id: number | string;
  categoryId: string;
  title: string;
  subtitle: string;
  slag:string;
  price: number;
  img: string;
  deliveryTime?: string;
}


interface ProductSliderProps {
  title: string;
  products: SliderProduct[];
}


export default function ProductSlider({ title, products }: ProductSliderProps) {
  const sliderRef = useRef<Slider>(null);

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

  
  useEffect(() => {
    sliderRef.current?.slickGoTo(0);
    window.dispatchEvent(new Event("resize"));
  }, [products]);

  return (
    <section className="px-4 md:px-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
        <button className="text-green-600 text-sm font-medium">See All</button>
      </div>

      {products.length > 0 ? (
        <Slider ref={sliderRef} {...settings}>
          {products.map((p) => {
            const cardData: UIProductCard = {
              id: String(p.id),
              categoryId: p.categoryId,
              title: p.title,
              subtitle: p.subtitle,
              slag:p.slag,
              price: p.price,
              img: p.img,
              deliveryTime: p.deliveryTime,
            };
            return (
              <div key={`${p.categoryId}-${p.id}`} className="px-2">
                <ProductCard product={cardData} />
              </div>
            );
          })}
        </Slider>
      ) : (
        <p>No products found</p>
      )}
    </section>
  );
}
