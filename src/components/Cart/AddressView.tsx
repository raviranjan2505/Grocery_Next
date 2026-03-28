"use client";

import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import AddressDialog from "@/app/(root)/cart/AddressDialog";
import LoginDialog from "@/app/(auth)/login-in/LoginDialog";
import { useLoginStore } from "@/app/store/useLoginStore";
import { useSignupStore } from "@/app/store/useSignupStore";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/actions/action";
import type { Address } from "@/lib/data";
import Cookies from "js-cookie";
import Skeleton from "@/components/Loaders/Skeleton";

interface AddressViewProps {
  onBack: () => void;
  onSelectAddress: (addr: Address) => void;
}

export default function AddressView({ onBack, onSelectAddress }: AddressViewProps) {
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  const loginToken = useLoginStore((s) => s.token);
  const signupToken = useSignupStore((s) => s.token);
  const token = loginToken || signupToken || Cookies.get("authToken") || null;

  // Load addresses
  const loadAddresses = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAddresses();
      setAddresses(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSaveAddress = async (data: Address) => {
    if (!token) {
      setLoginOpen(true);
      return;
    }

    if (data.id) {
      const ok = await updateAddress(data); // ✅ send full object with id
      if (ok) {
        setEditingAddress(null);
        setAddressDialogOpen(false);
        await loadAddresses();
      }
    } else {
      const saved = await addAddress(data);
      if (saved) {
        setAddressDialogOpen(false);
        await loadAddresses();
      }
    }
  };

  const handleEdit = (addr: Address) => {
    setEditingAddress(addr);
    setAddressDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    const ok = await deleteAddress(id);
    if (ok) await loadAddresses();
  };

  const handleSetDefault = async (addr: Address) => {
    if (!token || addr.isDefault) return;
    const ok = await updateAddress({ ...addr, isDefault: true }); // ✅ consistent API
    if (ok) await loadAddresses();
  };

  const handleAddNewAddress = () => {
    if (token) {
      setEditingAddress(null);
      setAddressDialogOpen(true);
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 mb-4 text-gray-700">
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <button
        className="flex items-center gap-2 text-green-600 mb-3"
        onClick={handleAddNewAddress}
      >
        <Plus className="w-5 h-5" /> Add a new address
      </button>

      <div className="space-y-3">
        {loading && addresses.length === 0 && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-3">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        )}
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`border rounded-lg p-3 hover:border-green-600 transition ${
              addr.isDefault ? "border-green-600 bg-green-50" : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <div
                className="cursor-pointer"
                onClick={() => {
                  onSelectAddress(addr);
                  handleSetDefault(addr);
                  onBack();
                }}
              >
                <p className="font-medium">
                  {addr.type} {addr.isDefault && "(Default)"}
                </p>
                <p className="text-sm text-gray-600">
                  {addr.address1}
                  {addr.address2 ? `, ${addr.address2}` : ""}, {addr.city},{" "}
                  {addr.state} - {addr.pincode}
                </p>
                <p className="text-sm text-gray-500">Phone: {addr.phone}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleEdit(addr)} className="text-blue-600">
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => addr.id && handleDelete(addr.id)} 
                  className="text-red-600"
                  disabled={!addr.id}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />

      {addressDialogOpen && (
        <AddressDialog
          key={editingAddress ? `edit-${editingAddress.id}` : "add-new"}
          open={addressDialogOpen}
          onOpenChange={setAddressDialogOpen}
          onSave={handleSaveAddress}
          initialData={editingAddress}
        />
      )}
    </div>
  );
}
