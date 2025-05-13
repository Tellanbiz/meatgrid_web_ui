"use client";

import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";
import { Badge } from "../../../components/ui/badge";

interface TopCustomerItem {
  name: string;
  orders: number;
  profileImage: string;
}

const TopCustomer = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const customers: TopCustomerItem[] = [
    {
      name: "Samuel Njuguna",
      orders: 20,
      profileImage: "/images/unsplash-avatar.jpg",
    },
    {
      name: "Samuel Njuguna",
      orders: 20,
      profileImage: "/images/unsplash-avatar.jpg",
    },
    {
      name: "Samuel Njuguna",
      orders: 20,
      profileImage: "/images/unsplash-avatar.jpg",
    },
    {
      name: "Samuel Njuguna",
      orders: 20,
      profileImage: "/images/unsplash-avatar.jpg",
    },
    {
      name: "Samuel Njuguna",
      orders: 20,
      profileImage: "/images/unsplash-avatar.jpg",
    },
  ];

  const nameTemplate = (rowData: TopCustomerItem) => (
    <div className="flex items-center space-x-3">
      <img
        src={rowData.profileImage}
        alt={rowData.name}
        className="w-8 h-8 rounded-full"
      />
      <span className="text-sm text-gray-700">{rowData.name}</span>
    </div>
  );

  const ordersTemplate = (rowData: TopCustomerItem) => (
    <Badge className="bg-green-100 text-green-500 rounded-md px-2 py-1">Orders: {rowData.orders}</Badge>
  );

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex flex-col space-y-4">
        <h3 className="text-xl font-medium">Top Customer</h3>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full bg-white border-gray-200"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <DataTable
            value={filteredCustomers}
            tableStyle={{
              ...DataTableStyle,
              borderCollapse: "separate",
              borderSpacing: "0 8px",
            }}
            className="w-full"
          >
            <Column
              field="name"
              header="Customer Name ↓"
              body={nameTemplate}
              headerStyle={{
                ...TableHeaderStyle,
                background: "none",
                paddingLeft: "1rem",
                fontSize: "0.875rem",
                color: "#4B5563",
              }}
            />
            <Column
              field="orders"
              header="Total Orders"
              body={ordersTemplate}
              headerStyle={{
                ...TableHeaderStyle,
                background: "none",
               justifyContent: "center",
              }}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default TopCustomer;
