"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Checkout from "@/components/Checkout/Checkout";
import useCart from "@/app/store/useCart";
import { useLoginStore } from "@/app/store/useLoginStore";
import { useSignupStore } from "@/app/store/useSignupStore";

export default function CheckOutPage() {
  const router = useRouter();

  // Cart store
  const { cartItems, loading, fetchCart } = useCart();

  // Login & Signup token stores
  const loginToken = useLoginStore((s) => s.token);
  const loadLoginToken = useLoginStore((s) => s.loadTokenFromCookie);
  const signupToken = useSignupStore((s) => s.token);

  const token = loginToken || signupToken;

  // Hydration flag
  const [hydrated, setHydrated] = useState(false);

  // Load token from cookie & fetch cart
  useEffect(() => {
    loadLoginToken();

    fetchCart();
    setHydrated(true);
  }, [loadLoginToken, fetchCart]);

  // Redirect logic
  useEffect(() => {
    if (!hydrated) return; // Wait until hydration

    // If token is not present, redirect to login
    if (!token) {
      router.replace("/login");
      return;
    }

    const justPlacedOrder = localStorage.getItem("justPlacedOrder") === "true";

    // Redirect to order summary if an order was just placed
    if (justPlacedOrder) {
      router.replace("/checkout/order-summary");
      return;
    }

    // If cart is empty, redirect home
    if (!loading && cartItems.length === 0) {
      router.replace("/");
      return;
    }
  }, [hydrated, token, cartItems, loading, router]);

  // Show loading message while checking authentication or fetching cart
  if (!hydrated || loading || token === null) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  return <Checkout />;
}
