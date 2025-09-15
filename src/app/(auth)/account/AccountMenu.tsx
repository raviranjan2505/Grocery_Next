"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useLoginStore } from "@/app/store/useLoginStore"
import { useSignupStore } from "@/app/store/useSignupStore"

export default function AccountMenu() {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {user?.name ? `Hi, ${user.name}` : "Account"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel>
          <div className="font-semibold">My Account</div>
          <div className="text-sm text-gray-600">{user?.phone || user?.email}</div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/orders" className="w-full">My Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/addresses" className="w-full">Saved Addresses</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/gift-cards" className="w-full">E-Gift Cards</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/faqs" className="w-full">FAQ&apos;s</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/privacy" className="w-full">Account Privacy</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={logout}
        >
          Log Out
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* QR Section */}
        <div className="flex flex-col items-center text-center px-2 py-3">
          <Image
            src="/qr-code.png"
            alt="QR Code"
            width={100}
            height={100}
          />
          <p className="text-xs font-medium mt-2">
            Simple way to get groceries in minutes
          </p>
          <p className="text-xs text-gray-500">
            Scan the QR code and download our app
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
