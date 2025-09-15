"use client";
import Navbar from "../Navbar";
import Footer from "../Footer";

function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default CommonLayout;