"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (address: { type: string; details: string }) => void
}

export default function AddressDialog({ open, onOpenChange, onSave }: AddressDialogProps) {
  const [type, setType] = useState("Home")
  const [details, setDetails] = useState("")

  const handleSave = () => {
    if (!details.trim()) return
    onSave({ type, details })
    setDetails("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Type (e.g., Home, Work)"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <Input
            placeholder="Full Address"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">Cancel</Button>
          <Button onClick={handleSave} className="bg-green-600 text-white">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
