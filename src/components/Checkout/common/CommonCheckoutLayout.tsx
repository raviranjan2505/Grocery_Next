"use client";
import CheckoutNavbar from "../CheckoutNavbar";
function CommonCheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <CheckoutNavbar />
      <main>{children}</main>
    </div>
  );
}

export default CommonCheckoutLayout;