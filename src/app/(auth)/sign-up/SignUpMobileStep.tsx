"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSignupStore } from "@/app/store/useSignupStore"

export default function SignUpMobileStep() {
  const mobile = useSignupStore((s) => s.mobile)
  const isLoading = useSignupStore((s) => s.isLoading)
  const error = useSignupStore((s) => s.error)
  const sendOtp = useSignupStore((s) => s.sendOtp)
  const setMobile = useSignupStore((s) => s.setMobile)

  const handleContinue = () => {
    if (mobile.length === 10) {
      sendOtp(mobile)
    }
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center border rounded-lg overflow-hidden">
        <span className="px-3 text-gray-600">+91</span>
        <Input
          type="tel"
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          placeholder="Enter mobile number"
          className="flex-1 border-0 focus-visible:ring-0"
          maxLength={10}
        />
      </div>

      <Button
        className="bg-green-600 hover:bg-green-900 text-black"
        onClick={handleContinue}
        disabled={mobile.length !== 10 || isLoading}
      >
        {isLoading ? "Sending..." : "Continue"}
      </Button>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  )
}
