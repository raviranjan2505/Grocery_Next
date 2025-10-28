"use client";

import { useEffect, useState } from "react";
import useAddressStore from "@/app/store/useAddressStore";
import useCart from "@/app/store/useCart";
import { Button } from "@/components/ui/button";
import { handleCheckoutAPI } from "@/lib/actions/action";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; 
import Image from "next/image";

export default function ProductPaymentDetails() {
  const { selectedAddress } = useAddressStore();
  const { cartItems, total, fetchTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const totalPrice =
    total?.payableAmt ??
    cartItems.reduce((sum, i) => sum + i.quantity * i.item.price, 0);

  useEffect(() => {
    fetchTotal();
  }, [fetchTotal]);

 const handleCheckout = async () => {
    if (!selectedAddress) return toast.error("Please select a delivery address");
    if (cartItems.length === 0) return toast.error("Your cart is empty");

    const cookieId = localStorage.getItem("cookieId") || "";
    const selectedAddressId = selectedAddress.id;
    const paymentMethod = "cash";

    setLoading(true);
    const response = await handleCheckoutAPI(cookieId, selectedAddressId, paymentMethod);
    setLoading(false);

    if (response?.success) {
      const orderSummary = {
        items: cartItems,
        totalPrice,
      };
      localStorage.setItem("justPlacedOrderItems", JSON.stringify(orderSummary));

      localStorage.setItem("justPlacedOrder", "true");

      await clearCart();
      toast.success("Order placed successfully ✅");
      router.push(`/checkout/order-summary`);
    } else {
      toast.error(response?.message || "Checkout failed. Try again.");
    }
  };


  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Delivery Address</h2>
      {selectedAddress ? (
        <div className="text-sm text-gray-600 mb-4">
          <p className="text-sm font-medium">
            Deliver to: {selectedAddress.addressType}{" "}
            {selectedAddress.isDefault && "(Default)"}
          </p>
          <p className="text-xs text-gray-600">
            {selectedAddress.fullAddress}, {selectedAddress.locality},{" "}
            {selectedAddress.city}
          </p>
          <p className="text-xs text-gray-500">
            Mobile: {selectedAddress.mobile}
          </p>
        </div>
      ) : (
        <p className="text-sm text-red-500 mb-4">No address selected</p>
      )}

      <div className="mt-4 border-t pt-4">
        <h3 className="text-md font-semibold mb-2">My Cart</h3>
        {cartItems.map(({ item, quantity }) => (
          <div
            key={item.id}
            className="flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-2">
              <Image
  src={item.img}
  alt={item.title}

  className="w-12 h-12 object-cover rounded" 
/>
          
              <span className="text-sm">
                {item.title} x {quantity}
              </span>
            </div>
            <span className="text-sm font-medium">
              ₹{item.price * quantity}
            </span>
          </div>
        ))}

        <div className="mt-4 border-t pt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>SubTotal:</span>
            <span>₹{total?.subTotal ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>₹{total?.discount ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>₹{total?.tax ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>₹{total?.shipping ?? 0}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Payable Amount:</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      </div>

      <Button
        className="w-full mt-4"
        disabled={cartItems.length === 0 || !selectedAddress || loading}
        onClick={handleCheckout}
      >
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
}
