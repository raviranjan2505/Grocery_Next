"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import MobileStep from "./MobileStep"
import OtpStep from "./OtpStep"
import { useEffect } from "react"
import { toast } from "sonner"
import { useLoginStore } from "@/app/store/useLoginStore"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const step = useLoginStore((s) => s.step)
  const error = useLoginStore((s) => s.error)
  const successMessage = useLoginStore((s) => s.successMessage)
  const setSuccessMessage = useLoginStore((s) => s.setSuccessMessage)
useEffect(() => {
  if (!successMessage) return

  toast.success(successMessage)
    onOpenChange(false)
    setSuccessMessage(null)
}, [successMessage, onOpenChange, setSuccessMessage])

  useEffect(() => {
    if (!error) return
    toast.error(`Login Failed ❌\n${error}`)
  }, [error])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-1/2 -translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 bottom-0 sm:rounded-xl rounded-t-2xl w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center">
            <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-lg">
              NexusGrocery
            </div>
            <span className="mt-3 text-center text-lg font-semibold">
              India&apos;s last minute app
            </span>
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {step === "mobile" ? "Log in" : "Enter OTP sent to your number"}
          </DialogDescription>
        </DialogHeader>

        {step === "mobile" ? (
          <MobileStep />
        ) : (
          <OtpStep resendDuration={60} />
        )}

        {step === "mobile" && (
          <p className="text-xs text-gray-500 text-center mt-3">
            By continuing, you agree to our{" "}
            <span className="underline">Terms of service</span> &{" "}
            <span className="underline">Privacy policy</span>
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
