"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Package } from "lucide-react";

import { useLoginStore } from "@/app/store/useLoginStore";
import { useSignupStore } from "@/app/store/useSignupStore";
import { getAddresses, getMyOrder } from "@/lib/actions/action";
import type { Address, Order } from "@/lib/data";

export default function AccountPage() {
  const loginUser = useLoginStore((s) => s.user);
  const signupUser = useSignupStore((s) => s.user);
  const user = loginUser || signupUser;

  const [orders, setOrders] = useState<Order[] | null>(null);
  const [addresses, setAddresses] = useState<Address[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const o = await getMyOrder();
        setOrders(o || []);
      } catch {
        setOrders([]);
      }

      try {
        const a = await getAddresses();
        setAddresses(a || []);
      } catch {
        setAddresses([]);
      }
    })();
  }, []);

  const defaultAddress = useMemo(() => {
    if (!addresses?.length) return null;
    return addresses.find((a) => a.isDefault) || addresses[0] || null;
  }, [addresses]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 p-4 bg-white">
        <h2 className="text-xl font-semibold text-gray-800">Account</h2>
        <p className="text-sm text-gray-600 mt-1">
          {user?.email ? `Signed in as ${user.email}` : "Signed in"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/account/orders"
          className="rounded-lg border border-gray-200 p-4 bg-white hover:shadow-sm transition flex items-start gap-3"
        >
          <Package className="w-5 h-5 text-green-700 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900">My Orders</p>
            <p className="text-sm text-gray-600">
              {orders === null ? "Loading…" : `${orders.length} order${orders.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </Link>

        <Link
          href="/account/addresses"
          className="rounded-lg border border-gray-200 p-4 bg-white hover:shadow-sm transition flex items-start gap-3"
        >
          <MapPin className="w-5 h-5 text-green-700 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900">My Addresses</p>
            <p className="text-sm text-gray-600">
              {addresses === null ? "Loading…" : `${addresses.length} saved`}
            </p>
            {defaultAddress && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                Default: {defaultAddress.address1 || defaultAddress.fullAddress || ""}
              </p>
            )}
          </div>
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
        <p className="text-sm text-gray-700">
          Tip: open an order to see shipping status and tracking number (if available).
        </p>
      </div>
    </div>
  );
}
