// "use client"

// import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { X, Trash, Plus } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import useCart from "@/app/store/useCart"
// import LoginDialog from "@/app/(auth)/login-in/LoginDialog"
// import AddressDialog from "./AddressDialog"
// import { useLoginStore } from "@/app/store/useLoginStore"
// import { useSignupStore } from "@/app/store/useSignupStore"

// interface CartSidebarProps {
//   open: boolean
//   onClose: () => void
// }

// interface Address {
//   id: number
//   type: string
//   details: string
// }

// export default function CartSidebar({ open, onClose }: CartSidebarProps) {
//   const { cartItems, increaseQuantity, decreaseQuantity, removeItem } = useCart()

//   const loginToken = useLoginStore((s) => s.token)
// const signupToken = useSignupStore((s) => s.token)
// const token = loginToken || signupToken

//   const [loginOpen, setLoginOpen] = useState(false)
//   const [addressDialogOpen, setAddressDialogOpen] = useState(false)

//   // Sample saved addresses (replace with API/fetch)
  // const [addresses, setAddresses] = useState<Address[]>([
  //   {
  //     id: 1,
  //     type: "Work",
  //     details:
  //       "1540, Gour city mall, Floor 15 Gaur City Mall, Gaur City 1, Sector 4, Noida",
  //   },
  //   {
  //     id: 2,
  //     type: "Work",
  //     details:
  //       "1165, Floor 11, Gaur City Mall, Gaur City 1, Sector 4, Noida",
  //   },
  // ])

//   const totalQty = cartItems.reduce((sum, i) => sum + i.quantity, 0)
//   const totalPrice = cartItems.reduce(
//     (sum, i) => sum + i.quantity * i.item.price,
//     0
//   )

//   const handleCheckout = () => {
//     if (!token) {
//       setLoginOpen(true) // 🔑 Show login if not logged in
//     } else {
//       setAddressDialogOpen(true) // ✅ Open address dialog if logged in
//     }
//   }

//   const handleSaveAddress = (newAddr: { type: string; details: string }) => {
//     setAddresses((prev) => [...prev, { id: prev.length + 1, ...newAddr }])
//   }

//   return (
//     <>
//       <AnimatePresence>
//         {open && (
//           <>
//             {/* Overlay */}
//             <motion.div
//               className="fixed inset-0 bg-black bg-opacity-40 z-40"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 0.5 }}
//               exit={{ opacity: 0 }}
//               onClick={onClose}
//             />

//             {/* Sidebar */}
//             <motion.div
//               className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg z-50 flex flex-col"
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "tween", duration: 0.3 }}
//             >
//               {/* Header */}
//               <div className="flex justify-between items-center p-4 border-b">
//                 <h2 className="text-lg font-semibold">
//                   My Cart ({totalQty})
//                 </h2>
//                 <button onClick={onClose}>
//                   <X className="w-6 h-6 text-gray-600" />
//                 </button>
//               </div>

//               {/* Cart Items */}
//               <div className="flex-1 overflow-y-auto p-4">
//                 {cartItems.length === 0 ? (
//                   <p className="text-sm text-gray-500">Your cart is empty</p>
//                 ) : (
//                   cartItems.map(({ item, quantity }) => (
//                     <div
//                       key={`cart-item-${item.id}`}
//                       className="flex justify-between items-center mb-3"
//                     >
//                       <div className="flex items-center gap-2">
//                         {/* eslint-disable-next-line @next/next/no-img-element */}
//                         <img
//                           src={item.img}
//                           alt={item.title}
//                           className="w-12 h-12 object-cover rounded"
//                         />
//                         <div>
//                           <p className="text-sm font-medium">{item.title}</p>
//                           <p className="text-xs text-gray-500">
//                             ₹{item.price}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <div className="flex items-center gap-2 border border-green-600 rounded-md px-2 py-1">
//                           <button
//                             className="text-green-600 font-bold"
//                             onClick={() => decreaseQuantity(item.id)}
//                           >
//                             −
//                           </button>
//                           <span>{quantity}</span>
//                           <button
//                             className="text-green-600 font-bold"
//                             onClick={() => increaseQuantity(item.id)}
//                           >
//                             +
//                           </button>
//                         </div>
//                         <button
//                           className="text-red-500 ml-2"
//                           onClick={() => removeItem(item.id)}
//                         >
//                           <Trash />
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>

//               {/* Footer */}
//               <div className="border-t p-4">
//                 <p className="text-right font-semibold mb-2">
//                   Total: ₹{totalPrice}
//                 </p>
//                 <Button
//                   className="w-full bg-green-600 text-white disabled:opacity-50"
//                   onClick={handleCheckout}
//                   disabled={cartItems.length === 0}
//                 >
//                   {token ? "Checkout" : "Login to Continue"}
//                 </Button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Login Dialog */}
//       <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />

//       {/* Add Address Dialog */}
//       <AddressDialog
//         open={addressDialogOpen}
//         onOpenChange={setAddressDialogOpen}
//         onSave={handleSaveAddress}
//       />
//     </>
//   )
// }


"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import useCart from "@/app/store/useCart"
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
