"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider, { Settings } from "react-slick";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getActiveBanners, Banner } from "@/lib/actions/action";

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      const res = await getActiveBanners();
      setBanners(res);
    };
    fetchBanners();
  }, []);

  // Slick slider settings
  const settings: Settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  // Ensure href always returns a string
  const getBannerLink = (banner: Banner): string => {
    if (banner.categoryId && banner.productId > 0) {
      return `/${banner.categoryId}`;
    } else if (banner.categoryId > 0) {
      return `/${banner.categoryId}`;
    }
    return "/"; // fallback URL
  };

  return (
    <section className="px-4 py-6 md:px-6">
      {banners.length > 0 ? (
        <Slider {...settings}>
          {banners.map((banner) => (
            <Card
              key={banner.imgId}
              className="relative h-48 md:h-64 w-full overflow-hidden rounded-2xl"
            >
              {/* Background Image */}
              <Image
                src={banner.imgUrl || "/image/bread.png"} // fallback image
                alt={banner.imgName || "Banner"}
                fill
                className="object-cover"
              />

              <CardContent className="absolute inset-0 bg-black/40 flex justify-between items-center text-white p-6 md:p-8 z-10">
                <div>
                  <h2 className="text-xl md:text-3xl font-bold">
                    {banner.imgName || "Banner"}
                  </h2>
                  <p className="mt-1 md:mt-2 text-sm md:text-lg">
                    {banner.bannerTypeName && banner.bannerTypeName !== "NULL"
                      ? banner.bannerTypeName
                      : "Explore now"}
                  </p>

                  {/* Dynamic Shop Now Button */}
                  <Link href={getBannerLink(banner)}>
                    <Button className="mt-3 bg-white text-green-600 font-semibold">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </Slider>
      ) : (
        <Card className="relative h-48 md:h-64 w-full overflow-hidden rounded-2xl">
          <CardContent className="flex items-center justify-center text-gray-500">
            Loading banners...
          </CardContent>
        </Card>
      )}
    </section>
  );
}
