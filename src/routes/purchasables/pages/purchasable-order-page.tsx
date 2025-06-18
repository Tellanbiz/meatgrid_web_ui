import React, { useEffect } from "react";
import { usePurchasables } from "../hooks/usePurchasables";

export default function PurchasableOrderPage() {
  const { purchasableOrders, loading, error, fetchPurchasableOrders } =
    usePurchasables();

  useEffect(() => {
    fetchPurchasableOrders();
  }, [fetchPurchasableOrders]);

  return (
    <div className="p-8 font-lato">
      <h1 className="text-2xl font-bold mb-4">Purchasable Orders</h1>
      <div className="bg-white rounded-lg shadow p-6 min-h-[200px]">
        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && purchasableOrders.length === 0 && (
          <p className="text-gray-500">No purchasable orders yet.</p>
        )}
        {!loading && !error && purchasableOrders.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {purchasableOrders.map((order) => (
              <li key={order.id} className="py-3">
                <div className="font-semibold text-lg text-gray-800">
                  Order #{order.id}
                </div>
                <div className="text-gray-500 text-sm mb-1">
                  Supplier: {order.supplier.full_name}
                </div>
                <div className="text-gray-500 text-sm mb-1">
                  User: {order.user.full_name}
                </div>
                <div className="text-xs text-gray-400">
                  Created: {new Date(order.created_at).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">
                  Items: {order.items.length}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
