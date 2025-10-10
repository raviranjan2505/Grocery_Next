"use client";

import Navbar from "../Navbar";
import Footer from "../Footer";
import { useEffect } from "react";
import useCart from "@/app/store/useCart";
import { useLoginStore } from "@/app/store/useLoginStore";

function CommonLayout({ children }: { children: React.ReactNode }) {
  const { initCookieId, fetchCart, cartItems } = useCart();
  const loadTokenFromCookie = useLoginStore((state) => state.loadTokenFromCookie);

  // Init cart cookie and fetch cart
  useEffect(() => {
    initCookieId();
    fetchCart();
  }, [initCookieId, fetchCart]);

  // Remove cookieId if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      localStorage.removeItem("cookieId");
      console.log("cookieId removed because cart is empty");
    } else {
      console.log("cookieId kept because cart has items");
    }
  }, [cartItems]);

  // Load auth token from cookie into zustand store on page load
  useEffect(() => {
    loadTokenFromCookie();
  }, [loadTokenFromCookie]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default CommonLayout;
