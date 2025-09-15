import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import heroImage from "image/daily_use.png"

export default function Hero() {
  return (
<section className="px-4 py-6 md:px-6">
  <Card className="relative h-48 md:h-64 w-full overflow-hidden rounded-2xl">
    <CardContent className="absolute inset-0 bg-[#357265] flex justify-between items-center text-white p-6 md:p-8 z-10">
      {/* Left Side Text */}
      <div>
        <h2 className="text-xl md:text-3xl font-bold">Daily Use Product</h2>
        <p className="mt-1 md:mt-2 text-sm md:text-lg">
          Your favourite paan shop is now online
        </p>
        <Button className="mt-3 bg-white text-green-600 font-semibold">
          Shop Now
        </Button>
      </div>

      {/* Right Side Image */}
      <Image
        src="/image/daily_use.png"
        alt="heroImage"
        width={200}
        height={200}
        className="object-contain"
      />
    </CardContent>
  </Card>
</section>

  )
}
