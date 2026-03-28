"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, User } from "lucide-react"
import useCart from "@/app/store/useCart"
import CartSidebar from "@/app/(root)/cart/CartSidebar"
import WishlistSidebar from "@/app/(root)/wishlist/WishlistSidebar"
import LoginDialog from "@/app/(auth)/login-in/LoginDialog"
import SignUpDialog from "@/app/(auth)/sign-up/SignUpDialog"
import AccountMenu from "@/app/(auth)/account/AccountMenu"
import AccountMenuMobile from "@/app/(auth)/account/AccountMenuMobile"
import Link from "next/link"
import clsx from "clsx"
import AnimatedSearchInput from "./AnimatedSearchInput"
import HeaderLocation from "./HeaderLocation"
import { useLoginStore } from "@/app/store/useLoginStore"
import { useSignupStore } from "@/app/store/useSignupStore"
import { useWishlistStore } from "@/app/store/useWishlistStore"

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [signUpOpen, setSignUpOpen] = useState(false)

  const { cartItems } = useCart()
  const totalQty = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = cartItems.reduce((sum, i) => sum + i.quantity * i.item.price, 0)

  // ✅ Persisted user/token
  const loginToken = useLoginStore((s) => s.token)
  const signupToken = useSignupStore((s) => s.token)
  const token = loginToken || signupToken

  const loginUser = useLoginStore((s) => s.user)
  const signupUser = useSignupStore((s) => s.user)
  const user = loginUser || signupUser

  const wishlistCount = useWishlistStore((s) => s.entries.length)
  const fetchWishlistEntries = useWishlistStore((s) => s.fetchEntries)
  const clearWishlist = useWishlistStore((s) => s.clear)

  // Close dialogs automatically when logged in
  useEffect(() => {
    if (user) {
      setLoginOpen(false)
      setSignUpOpen(false)
    }
  }, [user])

  useEffect(() => {
    if (token) {
      fetchWishlistEntries()
    } else {
      clearWishlist()
    }
  }, [token, fetchWishlistEntries, clearWishlist])

  return (
    <header className="border-b shadow-sm sticky top-0 bg-white z-50">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo + Location */}
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-bold text-green-600 hidden md:block">
            NexusGrocery
          </Link>
          <HeaderLocation />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <AnimatedSearchInput />

          {token ? (
            <AccountMenu />
          ) : (
            <>
              <Button variant="ghost" onClick={() => setLoginOpen(true)}>Login</Button>
              <Button variant="ghost" onClick={() => setSignUpOpen(true)}>SignUp</Button>
            </>
          )}

          <button
            type="button"
            className="relative rounded-md border border-gray-200 p-2 hover:bg-gray-50"
            onClick={() => setWishlistOpen(true)}
            aria-label="Open wishlist"
          >
            <Heart className="h-5 w-5 text-gray-700" />
            {token && wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            className={clsx(
              "bg-green-600 text-white hover:bg-green-800 transition-colors duration-300 px-2 rounded-md font-bold text-[14px] flex items-center gap-1",
              totalQty === 0 && "py-2"
            )}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart />
            <div>
              <div>{totalQty === 0 ? "My Cart" : `${totalQty} items`}</div>
              <div>{totalQty !== 0 && `₹ ${totalPrice}`}</div>
            </div>
          </button>
        </div>

        {/* Mobile Account Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            className="relative rounded-md border border-gray-200 p-2 hover:bg-gray-50"
            onClick={() => setWishlistOpen(true)}
            aria-label="Open wishlist"
          >
            <Heart className="h-5 w-5 text-gray-700" />
            {token && wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {token ? (
            <AccountMenuMobile />
          ) : (
            <Button variant="ghost" onClick={() => setLoginOpen(true)}>
              <User className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      <div className="px-4 pb-3 md:hidden">
        <AnimatedSearchInput />
      </div>

      {/* Mobile Bottom Cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-green-600 text-white px-4 py-3 flex items-center justify-between md:hidden z-50">
        <div>
          <p className="font-semibold">
            {totalQty === 0 ? "My Cart" : `${totalQty} item${totalQty > 1 ? "s" : ""}`}
          </p>
          {totalQty !== 0 && <p className="text-sm">₹ {totalPrice}</p>}
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="bg-white text-green-600 font-bold px-4 py-2 rounded-lg"
        >
          {totalQty === 0 ? "Start Shopping" : "View Cart"}
        </button>
      </div>

      {/* Dialogs */}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistSidebar open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <SignUpDialog open={signUpOpen} onOpenChange={setSignUpOpen} />
    </header>
  )
}
