type RazorpayPrefill = {
  name?: string;
  email?: string;
  contact?: string;
};

type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  order_id: string;
  prefill?: RazorpayPrefill;
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: { ondismiss?: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

let razorpayScriptPromise: Promise<boolean> | null = null;

export function loadRazorpayScript() {
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

export async function openRazorpayCheckout(input: {
  razorpayKey: string;
  razorpayOrderId: string;
  amountPaise: number;
  currency: string;
  name: string;
  description: string;
  prefill?: RazorpayPrefill;
  notes?: Record<string, string>;
}) {
  const ok = await loadRazorpayScript();
  if (!ok || !window.Razorpay) throw new Error("Failed to load Razorpay checkout");
  if (!input.razorpayKey || !input.razorpayOrderId) throw new Error("Missing Razorpay order details");
  if (!Number.isFinite(input.amountPaise) || input.amountPaise < 1) throw new Error("Invalid payable amount");

  return await new Promise<RazorpayHandlerResponse>((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: input.razorpayKey,
      amount: input.amountPaise,
      currency: input.currency,
      name: input.name,
      description: input.description,
      order_id: input.razorpayOrderId,
      prefill: input.prefill,
      notes: input.notes,
      theme: { color: "#16a34a" },
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    });

    rzp.open();
  });
}
