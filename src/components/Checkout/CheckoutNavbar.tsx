"use client"

import Link from "next/link"

export default function CheckoutNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="flex items-center justify-center px-4 py-3 md:px-6">
        <Link href="/" className="text-2xl font-bold text-green-600">
          NexusGrocery
        </Link>
      </div>
    </header>
  )
}
