"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLoginStore } from "@/app/store/useLoginStore"
import { useRef, useState, useEffect } from "react"

interface OtpStepProps {
  resendDuration?: number
}

export default function OtpStep({ resendDuration = 30 }: OtpStepProps) {
  const otp = useLoginStore((s) => s.otp)
  const mobile = useLoginStore((s) => s.mobile)
  const setOtp = useLoginStore((s) => s.setOtp)
  const verifyOtp = useLoginStore((s) => s.verifyOtp)
  const sendOtp = useLoginStore((s) => s.sendOtp)
  const setStep = useLoginStore((s) => s.setStep)
  const isLoading = useLoginStore((s) => s.isLoading)
  const error = useLoginStore((s) => s.error)

  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const [counter, setCounter] = useState(resendDuration)

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [counter])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  const handleOtpChange = (val: string, idx: number) => {
    if (/^\d?$/.test(val)) {
      const newOtp = [...otp]
      newOtp[idx] = val
      setOtp(newOtp)
      if (val && idx < 5) inputsRef.current[idx + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
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
      setOtp(Array(6).fill(""))
      setCounter(resendDuration)
      inputsRef.current[0]?.focus()
    }
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex justify-center gap-2">
        {otp.map((digit, idx) => (
          <Input
            key={idx}
            ref={(el) => {(inputsRef.current[idx] = el)}}
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
        disabled={otp.some((d) => !d) || isLoading}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>

      <div className="text-center">
        {counter > 0 ? (
          <p className="text-sm text-gray-500">
            Resend OTP in <span className="font-semibold">{counter}</span>s
          </p>
        ) : (
          <Button variant="link" className="text-sm text-green-600" onClick={handleResendOtp}>
            Resend OTP
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <Button variant="ghost" className="text-sm text-gray-500" onClick={() => setStep("mobile")}>
        ← Change Number
      </Button>
    </div>
  )
}
