import React from "react";

export default function PurchasablePage() {
  return (
    <div className="p-8 font-lato">
      <h1 className="text-2xl font-bold mb-4">Purchasables</h1>
      <div className="bg-white rounded-lg shadow p-6 min-h-[200px]">
        {/* Purchasable list or content will go here */}
        <p className="text-gray-500">No purchasables yet.</p>
      </div>
    </div>
  );
}
