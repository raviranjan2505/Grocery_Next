"use client";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import AddressDialog from "@/app/(root)/cart/AddressDialog";
import LoginDialog from "@/app/(auth)/login-in/LoginDialog";
import { useLoginStore } from "@/app/store/useLoginStore";
import {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    Address,
} from "@/lib/actions/action";


export default function AddressesPage() {

    const [addressDialogOpen, setAddressDialogOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const token = useLoginStore((s) => s.token);

    const loadAddresses = async () => {
        if (!token) return;
        const data = await getAddresses(token);
        setAddresses(data || []);
    };

    useEffect(() => {
        loadAddresses();
    },);

    const handleSaveAddress = async (data: Address) => {
        if (!token) {
            setLoginOpen(true);
            return;
        }

        if (data.id) {
            const ok = await updateAddress(token, data);
            if (ok) {
                setEditingAddress(null);
                setAddressDialogOpen(false);
                await loadAddresses();
            }
        } else {
            const saved = await addAddress(token, data);
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
        const ok = await deleteAddress(token, id);
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
            <h2 className="text-2xl font-semibold mb-6">My Addresses</h2>
            <button
                className="flex items-center gap-2 text-green-600 mb-3"
                onClick={handleAddNewAddress}
            >
                <Plus className="w-5 h-5" /> Add a new address
            </button>

            <div className="space-y-3">
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className={`border rounded-lg p-3 hover:border-green-600 transition ${addr.isDefault ? "border-green-600 bg-green-50" : ""
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div
                            >
                                <p className="font-medium">
                                    {addr.addressType} {addr.isDefault && "(Default)"}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {addr.fullAddress}, {addr.locality}, {addr.city}, {addr.state} -{" "}
                                    {addr.pincode}
                                </p>
                                {addr.landmark && (
                                    <p className="text-sm text-gray-500">Landmark: {addr.landmark}</p>
                                )}
                                <p className="text-sm text-gray-500">Mobile: {addr.mobile}</p>
                                {addr.alternatePhone && (
                                    <p className="text-sm text-gray-500">
                                        Alternate: {addr.alternatePhone}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(addr)} className="text-blue-600">
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDelete(addr.id)} className="text-red-600">
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












