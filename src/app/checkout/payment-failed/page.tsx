"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Payment Failed</h1>
        <p className="mt-2 text-sm text-gray-600">
          Your payment did not complete. You can try again or go back to the cart.
        </p>

        <div className="mt-6 flex gap-3 justify-center">
          <Button onClick={() => router.push("/checkout")}>Try Again</Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
