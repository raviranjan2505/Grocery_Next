"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useLoginStore } from "@/app/store/useLoginStore"
import { useSignupStore } from "@/app/store/useSignupStore"

export default function AccountMenuMobile() {
  // ✅ Get user from either store
  const loginUser = useLoginStore((s) => s.user)
  const signupUser = useSignupStore((s) => s.user)
  const user = loginUser || signupUser

  // ✅ Logout clears both stores
  const loginLogout = useLoginStore((s) => s.logout)
  const signupLogout = useSignupStore((s) => s.logout)
  const logout = async () => {
    await loginLogout()
    await signupLogout()
  }

  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        {user?.name ? `Hi, ${user.name}` : "Account"}
      </Button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="flex-1 bg-black/40"
              onClick={() => setOpen(false)}
            />

            {/* Sliding Panel */}
            <motion.div
              className="w-full max-w-full bg-white shadow-xl h-full flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <p className="font-semibold">Delivery in 12 minutes</p>
                  <p className="text-sm text-gray-500 truncate w-40">
                    2 Chhaprola sanday, market...
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Account Info */}
              <div className="p-4 border-b">
                <p className="text-lg font-medium">
                  {user?.phone || user?.email || "7042472287"}
                </p>
              </div>

              {/* Menu Links */}
              <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/orders">Order History</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/addresses">Address Book</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/wallet">Wallet Details</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/gift-cards">E-Gift Cards</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/privacy">Account Privacy</Link>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                >
                  Logout
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
