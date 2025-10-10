"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Address, State, getStates } from "@/lib/actions/action"

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
  const [form, setForm] = React.useState<Address>({
    id: 0,
    name: "",
    mobile: "",
    pincode: "",
    locality: "",
    fullAddress: "",
    city: "",
    state: "0", // store SID internally
    landmark: "",
    alternatePhone: "",
    addressType: "Home",
    isDefault: false,
  })

  const [states, setStates] = React.useState<State[]>([])
  const [loadingStates, setLoadingStates] = React.useState(true)

  // Fetch states
  React.useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true)
      const result = await getStates()
      setStates(result)
      setLoadingStates(false)
    }
    fetchStates()
  }, [])

  // Prefill form
  React.useEffect(() => {
    if (initialData && states.length > 0) {
      // Convert state string to SID
      // const stateObj = states.find((s) => s.stateName === initialData.state)
      const stateObj = states.find(
  (s) => s.sid === Number(initialData.state)
)
      setForm({
        ...initialData,
        state: stateObj ? String(stateObj.sid) : "0",
      })
    } else if (!initialData) {
      setForm((prev) => ({
        ...prev,
        id: 0,
        name: "",
        mobile: "",
        pincode: "",
        locality: "",
        fullAddress: "",
        city: "",
        state: "0",
        landmark: "",
        alternatePhone: "",
        addressType: "Home",
        isDefault: false,
      }))
    }
  }, [initialData, states, open])

  const handleChange = (field: keyof Address, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!form.name || !form.mobile || !form.pincode || !form.fullAddress || !form.city || !form.state) {
      alert("Please fill all required fields.")
      return
    }

    // Send SID as string for backend
    const payloadToSend: Address = {
      ...form,
      state: form.state,
    }

    onSave(payloadToSend)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit Address" : "Add New Address"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Input placeholder="Name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
          <Input placeholder="Mobile" value={form.mobile} onChange={(e) => handleChange("mobile", e.target.value)} />
          <Input placeholder="Pincode" value={form.pincode} onChange={(e) => handleChange("pincode", e.target.value)} />
          <Input placeholder="Locality" value={form.locality} onChange={(e) => handleChange("locality", e.target.value)} />
          <Input placeholder="Full Address" value={form.fullAddress} onChange={(e) => handleChange("fullAddress", e.target.value)} />
          <Input placeholder="City" value={form.city} onChange={(e) => handleChange("city", e.target.value)} />

          {/* State Dropdown */}
          {loadingStates ? (
            <p>Loading states...</p>
          ) : (
            <select
              value={form.state}
              onChange={(e) => handleChange("state", Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            >
              <option value={0}>-- Select State --</option>
              {states.map((s) => (
                <option key={s.sid} value={s.sid}>
                  {s.stateName}
                </option>
              ))}
            </select>
          )}

          <Input placeholder="Landmark (optional)" value={form.landmark} onChange={(e) => handleChange("landmark", e.target.value)} />
          <Input placeholder="Alternate Phone (optional)" value={form.alternatePhone} onChange={(e) => handleChange("alternatePhone", e.target.value)} />

          <select value={form.addressType} onChange={(e) => handleChange("addressType", e.target.value)} className="w-full border rounded px-2 py-1">
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>

          <div className="flex items-center gap-2 mt-2">
           <input
  type="checkbox"
  checked={!!form.isDefault} // <-- ensures boolean
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
