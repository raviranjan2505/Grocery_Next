"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Address } from "@/lib/data";

interface AddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Address) => void
  initialData?: Address | null
}

export default function AddressDialog({
  open,
  onOpenChange,
  onSave,
  initialData,
}: AddressDialogProps) {
  const [form, setForm] = React.useState<Partial<Address>>({
    id: 0,
    fullName: "",
    phone: "",
    pincode: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "India",
    type: "HOME",
    isDefault: false,
  })

  // Prefill form
  React.useEffect(() => {
    if (initialData) {
      setForm(initialData)
    } else {
      setForm({
        id: 0,
        fullName: "",
        phone: "",
        pincode: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "India",
        type: "HOME",
        isDefault: false,
      })
    }
  }, [initialData, open])

  const handleChange = (field: keyof Address, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!form.fullName || !form.phone || !form.pincode || !form.address1 || !form.city || !form.state) {
      alert("Please fill all required fields.")
      return
    }

    onSave(form as Address)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit Address" : "Add New Address"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Input placeholder="Full Name" value={form.fullName || ""} onChange={(e) => handleChange("fullName", e.target.value)} />
          <Input placeholder="Phone" value={form.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} />
          <Input placeholder="Pincode" value={form.pincode || ""} onChange={(e) => handleChange("pincode", e.target.value)} />
          <Input placeholder="Address Line 1" value={form.address1 || ""} onChange={(e) => handleChange("address1", e.target.value)} />
          <Input placeholder="Address Line 2 (optional)" value={form.address2 || ""} onChange={(e) => handleChange("address2", e.target.value)} />
          <Input placeholder="City" value={form.city || ""} onChange={(e) => handleChange("city", e.target.value)} />
          <Input placeholder="State" value={form.state || ""} onChange={(e) => handleChange("state", e.target.value)} />
          <Input placeholder="Country" value={form.country || "India"} onChange={(e) => handleChange("country", e.target.value)} />

          <select value={form.type || "HOME"} onChange={(e) => handleChange("type", e.target.value)} className="w-full border rounded px-2 py-1">
            <option value="HOME">Home</option>
            <option value="WORK">Work</option>
            <option value="OTHER">Other</option>
          </select>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={!!form.isDefault}
              onChange={(e) => handleChange("isDefault", e.target.checked)}
              id="isDefault"
            />
            <label htmlFor="isDefault">Set as default</label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full mt-2">
            {form.id ? "Update Address" : "Add Address"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
