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
import { useLoginStore } from "@/app/store/useLoginStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const error = useLoginStore((s) => s.error)
  const successMessage = useLoginStore((s) => s.successMessage)
  const setSuccessMessage = useLoginStore((s) => s.setSuccessMessage)
  const email = useLoginStore((s) => s.email)
  const password = useLoginStore((s) => s.password)
  const setEmail = useLoginStore((s) => s.setEmail)
  const setPassword = useLoginStore((s) => s.setPassword)
  const login = useLoginStore((s) => s.login)
  const isLoading = useLoginStore((s) => s.isLoading)

useEffect(() => {
  if (!successMessage) return

  toast.success(successMessage)
    onOpenChange(false)
    setSuccessMessage(null)
}, [successMessage, onOpenChange, setSuccessMessage])

  useEffect(() => {
    if (!error) return
    toast.error(`Login Failed \n${error}`)
  }, [error])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await login(email, password)
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
            Log in with email
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-4">
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
            autoComplete="current-password"
          />

          <Button className="bg-green-600 hover:bg-green-900 text-black" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
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
