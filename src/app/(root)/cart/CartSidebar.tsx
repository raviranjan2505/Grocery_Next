
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import LoginDialog from "@/app/(auth)/login-in/LoginDialog"
import { useLoginStore } from "@/app/store/useLoginStore"
import { useSignupStore } from "@/app/store/useSignupStore"
import CartView from "@/components/Cart/CartView"
import AddressView from "@/components/Cart/AddressView"

interface CartSidebarProps {
  open: boolean
  onClose: () => void
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const loginToken = useLoginStore((s) => s.token)
  const signupToken = useSignupStore((s) => s.token)
  const token = loginToken || signupToken

  const [loginOpen, setLoginOpen] = useState(false)
  const [step, setStep] = useState<"cart" | "address">("cart")

  const goToAddress = () => setStep("address")
  const goToCart = () => setStep("cart")

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg z-50 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">
                  {step === "cart" ? "My Cart" : "Select delivery address"}
                </h2>
                <button onClick={onClose}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4">
                {step === "cart" ? (
                  <CartView
                    token={token}
                    onLoginRequired={() => setLoginOpen(true)}
                    onProceed={goToAddress}
                  />
                ) : (
                  <AddressView onBack={goToCart} />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Dialog */}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  )
}
