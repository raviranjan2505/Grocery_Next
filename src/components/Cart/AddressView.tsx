"use client"

import { ArrowLeft, Plus } from "lucide-react"
import { useState } from "react"
import AddressDialog from "@/app/(root)/cart/AddressDialog"
import LoginDialog from "@/app/(auth)/login-in/LoginDialog"
import { useLoginStore } from "@/app/store/useLoginStore"
import { useSignupStore } from "@/app/store/useSignupStore"
interface Address {
    id: number
    type: string
    details: string
}

interface AddressViewProps {
    onBack: () => void
}

export default function AddressView({ onBack }: AddressViewProps) {
    const [addressDialogOpen, setAddressDialogOpen] = useState(false)
    const [loginOpen, setLoginOpen] = useState(false)
    const loginToken = useLoginStore((s) => s.token)
    const signupToken = useSignupStore((s) => s.token)
    const token = loginToken || signupToken

   const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      type: "Work",
      details:
        "1540, Gour city mall, Floor 15 Gaur City Mall, Gaur City 1, Sector 4, Noida",
    },
    {
      id: 2,
      type: "Work",
      details:
        "1165, Floor 11, Gaur City Mall, Gaur City 1, Sector 4, Noida",
    },
  ])
    const handleCheckout = () => {
        if (!token) {
            setLoginOpen(true) // 🔑 Show login if not logged in
        } else {
            setAddressDialogOpen(true) // ✅ Open address dialog if logged in
        }
    }
    const handleSaveAddress = (newAddr: { type: string; details: string }) => {
setAddresses((prev) => [...prev, { id: prev.length + 1, ...newAddr }])
}
    return (
        <div>
            <button
                onClick={onBack}
                className="flex items-center gap-2 mb-4 text-gray-700"
            >
                <ArrowLeft className="w-5 h-5" /> Back
            </button>

            <button className="flex items-center gap-2 text-green-600 mb-3"
                onClick={handleCheckout}
            >
                <Plus className="w-5 h-5" /> Add a new address
            </button>

            <div className="space-y-3">
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className="border rounded-lg p-3 cursor-pointer hover:border-green-600"
                    >
                        <p className="font-medium">{addr.type}</p>
                        <p className="text-sm text-gray-600">{addr.details}</p>
                    </div>
                ))}
            </div>
            {/* Login Dialog */}
            <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
            <AddressDialog
                open={addressDialogOpen}
                onOpenChange={setAddressDialogOpen}
                onSave={handleSaveAddress}
            />
        </div>
    )
}
