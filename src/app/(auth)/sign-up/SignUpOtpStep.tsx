"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSignupStore } from "@/app/store/useSignupStore"
import { useRef, useState, useEffect } from "react"

interface SignUpOtpStepProps {
  resendDuration?: number // default 30s
}

export default function SignUpOtpStep({ resendDuration = 30 }: SignUpOtpStepProps) {
  const otp = useSignupStore((s) => s.otp)
  const mobile = useSignupStore((s) => s.mobile)
  const setOtp = useSignupStore((s) => s.setOtp)
  const verifyOtp = useSignupStore((s) => s.verifyOtp)
  const sendOtp = useSignupStore((s) => s.sendOtp) // Make sure you have sendOtp in store
  const setStep = useSignupStore((s) => s.setStep)
  const isLoading = useSignupStore((s) => s.isLoading)
  const error = useSignupStore((s) => s.error)

  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const [counter, setCounter] = useState(resendDuration)

  // Timer effect
  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => setCounter((c) => c - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [counter])

  const handleOtpChange = (val: string, idx: number) => {
    if (/^\d?$/.test(val)) {
      const newOtp = [...otp]
      newOtp[idx] = val
      setOtp(newOtp)

      if (val && idx < 5) {
        inputsRef.current[idx + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus()
    }
  }

 const handleVerifyOtp = () => {
    if (otp.every((d) => d)) {
      verifyOtp(mobile, otp)
    }
  }

  const handleResendOtp = async () => {
    const success = await sendOtp(mobile)
    if (success) {
      setOtp(Array(6).fill("")) // clear OTP inputs
      setCounter(resendDuration) // reset timer
      inputsRef.current[0]?.focus() // focus first input
    }
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex justify-center gap-2">
        {otp.map((digit, idx) => (
          <Input
            key={idx}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-10 h-12 text-center text-lg font-bold border rounded-md focus:ring-2 focus:ring-green-600"
          />
        ))}
      </div>

      <Button
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={handleVerifyOtp}
        disabled={otp.join("").length !== 6 || isLoading}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>

      {/* 🔹 Resend OTP section */}
      <div className="text-center">
        {counter > 0 ? (
          <p className="text-sm text-gray-500">
            Resend OTP in <span className="font-semibold">{counter}</span>s
          </p>
        ) : (
          <Button
            variant="link"
            className="text-sm text-green-600"
            onClick={handleResendOtp}
          >
            Resend OTP
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <Button
        variant="ghost"
        className="text-sm text-gray-500"
        onClick={() => setStep("mobile")}
      >
        ← Change Number
      </Button>
    </div>
  )
}
