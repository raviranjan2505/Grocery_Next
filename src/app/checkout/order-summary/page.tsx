"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

type OrderItem = {
  item: {
    id: number;
    img: string;
    title: string;
    price: number;
  };
  quantity: number;
};

type OrderSummary = {
  items: OrderItem[];
  totalPrice: number;
};

export default function OrderSummaryPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<OrderSummary | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("justPlacedOrderItems");

    if (!stored) {
      // If no order is placed, redirect to home
      router.replace("/");
      return;
    }

    setSummary(JSON.parse(stored));

    
     const timer = setTimeout(() => {
     localStorage.removeItem("justPlacedOrder");
    localStorage.removeItem("justPlacedOrderItems");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  if (!summary) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold mb-4 text-green-600">Thank You for Shopping!</h2>
        <p className="text-gray-700 mb-6">
          Your order has been successfully placed. We appreciate your business!
        </p>

        <div className="mb-4 text-left">
          <h3 className="font-semibold mb-2">Your Order:</h3>
          <div className="space-y-2">
            {summary.items.map(({ item, quantity }) => (
              <div key={item.id} className="flex items-center gap-3 border p-2 rounded">
                
                <Image
  src={item.img}
  alt={item.title}
  className="w-16 h-16 object-cover rounded"
/>
               
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">Qty: {quantity}</p>
                  <p className="text-sm font-semibold">₹{item.price * quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 font-semibold text-lg">
            <span>Total:</span>
            <span>₹{summary.totalPrice}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button className="px-6 py-2" onClick={() => router.push("/")}>
            Continue Shopping
          </Button>
          <Button className="px-6 py-2" onClick={() => router.push("/account/orders")}>
            View My Orders
          </Button>
        </div>
      </div>
    </div>
  );
}
