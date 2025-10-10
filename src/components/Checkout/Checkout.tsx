import PaymentMethod from "./PaymentMethod";
import ProductPaymentDetails from "./ProductPaymentDetails";

export default function Checkout() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Side: Payment Methods */}
          <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4">Select Payment Method</h2>
            <PaymentMethod selectedPayment="cash" setSelectedPayment={() => {}} />
          </div>

          {/* Right Side: Product + Address */}
          <div className="md:col-span-1 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4">Order Summary</h2>
            <ProductPaymentDetails />
          </div>
        </div>
      </div>
    </div>
  );
}
