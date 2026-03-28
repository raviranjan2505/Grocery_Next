"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useEffect, type FormEvent } from "react"
import { toast } from "sonner"
import { useSignupStore } from "@/app/store/useSignupStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SignUpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SignUpDialog({ open, onOpenChange }: SignUpDialogProps) {
  const error = useSignupStore((s) => s.error)
const successMessage = useSignupStore((s) => s.successMessage)
  const setSuccessMessage = useSignupStore((s) => s.setSuccessMessage)
  const email = useSignupStore((s) => s.email)
  const password = useSignupStore((s) => s.password)
  const name = useSignupStore((s) => s.name)
  const setEmail = useSignupStore((s) => s.setEmail)
  const setPassword = useSignupStore((s) => s.setPassword)
  const setName = useSignupStore((s) => s.setName)
  const signup = useSignupStore((s) => s.signup)
  const isLoading = useSignupStore((s) => s.isLoading)

useEffect(() => {
  if (!successMessage) return

  toast.success(successMessage)
    onOpenChange(false)
    setSuccessMessage(null)

}, [successMessage, onOpenChange, setSuccessMessage])

  //  Show error toast
  useEffect(() => {
    if (!error) return
    toast.error(`Signup Failed \n${error}`)
  }, [error])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await signup({ email, password, name })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed h-[60%] left-1/2 -translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 bottom-0 sm:rounded-xl rounded-t-2xl w-full max-w-md">
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
            Sign up with email
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            autoComplete="name"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            autoComplete="email"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="new-password"
          />

          <Button className="bg-green-600 hover:bg-green-900 text-black" type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our{" "}
            <span className="underline">Terms of service</span> &{" "}
            <span className="underline">Privacy policy</span>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
