"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import Cookies from "js-cookie";

import type { Address } from "@/lib/data";
import { getAddresses } from "@/lib/actions/action";
import useAddressStore from "@/app/store/useAddressStore";
import { useLoginStore } from "@/app/store/useLoginStore";
import { useSignupStore } from "@/app/store/useSignupStore";
import Skeleton from "@/components/Loaders/Skeleton";

function formatAddressLine(addr: Address) {
  const line1 = (addr.address1 || addr.fullAddress || "").trim();
  const line2 = [addr.city, addr.state].filter(Boolean).join(", ");
  const pin = addr.pincode ? ` - ${addr.pincode}` : "";
  const combined = [line1, line2 ? `${line2}${pin}` : ""].filter(Boolean).join(", ");
  return combined || "Select delivery location";
}

export default function HeaderLocation() {
  const selectedAddress = useAddressStore((s) => s.selectedAddress);

  const loginToken = useLoginStore((s) => s.token);
  const signupToken = useSignupStore((s) => s.token);
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [fallbackAddress, setFallbackAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setToken(loginToken || signupToken || Cookies.get("authToken") || null);
  }, [mounted, loginToken, signupToken]);

  useEffect(() => {
    let cancelled = false;

    async function loadDefaultAddress() {
      if (!mounted) return;
      if (!token) {
        setFallbackAddress(null);
        return;
      }
      if (selectedAddress) return;

      try {
        setLoading(true);
        const list = await getAddresses();
        if (cancelled) return;
        const defaultAddr = list.find((a) => a?.isDefault) || list[0] || null;
        setFallbackAddress(defaultAddr);
      } catch {
        if (!cancelled) setFallbackAddress(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDefaultAddress();
    return () => {
      cancelled = true;
    };
  }, [mounted, token, selectedAddress]);

  const addr = selectedAddress || fallbackAddress;

  const line = useMemo(() => {
    // Keep the first render deterministic across SSR and client hydration.
    if (!mounted) return "Select delivery location";
    if (!token) return "Login to add address";
    if (!addr) return "Select delivery location";
    return formatAddressLine(addr);
  }, [addr, mounted, token]);

  return (
    <Link
      href="/account/addresses"
      className="ml-2 text-sm group max-w-[14rem] sm:max-w-[18rem] md:max-w-[22rem]"
      aria-label="Manage delivery address"
    >
      <div className="flex items-start gap-2">
        <MapPin className="h-4 w-4 text-green-700 mt-0.5 flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-semibold leading-4">Delivery in 12 minutes</p>
          {mounted && token && !addr && loading ? (
            <div className="mt-1 space-y-1">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
          ) : (
            <p className="text-gray-500 truncate group-hover:text-gray-700">{line}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
