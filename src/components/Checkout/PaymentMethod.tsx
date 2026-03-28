
"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type CheckoutPaymentMethod =
  | "wallets"
  | "cards"
  | "netbanking"
  | "upi"
  | "cash"
  | "paylater";

interface PaymentMethodProps {
  selectedPayment: CheckoutPaymentMethod;
  setSelectedPayment: (method: CheckoutPaymentMethod) => void;
}

export default function PaymentMethod({ selectedPayment, setSelectedPayment }: PaymentMethodProps) {
  const [upiId, setUpiId] = useState("");

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={selectedPayment}
        onValueChange={(value) => {
          if (!value) return;
          setSelectedPayment(value as CheckoutPaymentMethod);
        }}
      >

        <AccordionItem value="wallets">
          <AccordionTrigger>Wallets</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-gray-600">Pay using your favorite wallet.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cards">
          <AccordionTrigger>Credit/Debit Card</AccordionTrigger>
          <AccordionContent>
            <Input placeholder="Card Number" className="mb-2" />
            <Input placeholder="MM/YY" className="mb-2" />
            <Input placeholder="CVV" className="mb-2" />
            <Button className="w-full">Pay with Card</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="netbanking">
          <AccordionTrigger>Netbanking</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-gray-600">Choose your bank to continue.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="upi">
          <AccordionTrigger>UPI</AccordionTrigger>
          <AccordionContent>
            <div className="p-3 border rounded-lg">
              <Input placeholder="example@upi" className="mb-2" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
              <Button className="w-full" onClick={() => alert(`UPI ID saved: ${upiId}`)}>Save UPI</Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cash">
          <AccordionTrigger>Cash on Delivery</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-gray-600">Pay with cash upon delivery.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="paylater">
          <AccordionTrigger>Pay Later</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-gray-600">Use Pay Later services to complete the order.</p>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      <p className="mt-2 text-sm text-gray-500">
        Selected Payment: <strong>{selectedPayment || "None"}</strong>
      </p>
    </div>
  );
}
