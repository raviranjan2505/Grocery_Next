"use client";

import { useEffect, useState } from "react";
import { getMyOrder, getOrderDetails, Order, OrderDetail } from "@/lib/actions/action";

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getMyOrder();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const handleViewDetails = async (orderNumber: string) => {
    const data = await getOrderDetails(orderNumber);
    setSelectedOrder(data);
  };

  if (!orders) return <p className="text-sm text-gray-500">Loading orders...</p>;
  if (orders.length === 0) return <p className="text-sm text-gray-500">No orders found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Orders</h2>

      {!selectedOrder && (
        <div className="flex flex-col space-y-3">
          {orders.map((order) => (
            <div
              key={order.orderNumber}
              className="flex items-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer bg-white transition"
              onClick={() => handleViewDetails(order.orderNumber)}
            >
              {/* Left: Order info */}
              <div className="flex-1 text-gray-700 text-sm space-y-1">
                <p><span className="font-medium">Order:</span> {order.orderNumber}</p>
                <p><span className="font-medium">Status:</span> <span className="text-blue-600">{order.status}</span></p>
                <p><span className="font-medium">Placed on:</span> {order.orderPlaced}</p>
                <p><span className="font-medium">Total:</span> ₹{order.orderAmount.toLocaleString()}</p>
                <p><span className="font-medium">Ship To:</span> {order.shipToCustomerName}</p>
              </div>

              {/* Right: Product images */}
              <div className="flex space-x-2 ml-4">
                {order.orderItems.slice(0, 3).map((item) => (
                  <img
                    key={item.productId}
                    src={item.image}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
                {order.orderItems.length > 3 && (
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded text-gray-600 text-xs font-semibold">
                    +{order.orderItems.length - 3}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div>
          <button
            className="mb-4 px-4 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded transition"
            onClick={() => setSelectedOrder(null)}
          >
            ← Back to Orders
          </button>

          <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Order Details: {selectedOrder.orderNumber}</h3>
            <div className="text-gray-700 text-sm mb-4 space-y-1">
              <p><span className="font-medium">Placed on:</span> {selectedOrder.orderPlaced}</p>
              <p><span className="font-medium">Status:</span> {selectedOrder.status}</p>
              <p><span className="font-medium">Ship To:</span> {selectedOrder.shipToCustomerName}</p>
              <p><span className="font-medium">Total Amount:</span> ₹{selectedOrder.orderAmount.toLocaleString()}</p>
            </div>

            <h4 className="text-lg font-medium mb-2 text-gray-800">Products</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedOrder.orderItems.map((item) => (
                <div key={item.productId} className="border border-gray-100 p-2 rounded flex flex-col items-center bg-gray-50 text-sm">
                  <img src={item.image} alt={item.productName} className="w-24 h-24 object-cover rounded mb-2" />
                  <p className="text-center font-medium">{item.productName}</p>
                  <p className="font-semibold text-blue-600 mt-1">₹{item.totalPrice.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
