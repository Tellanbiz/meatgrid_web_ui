import React from "react";
import { Dropdown } from "primereact/dropdown";
import { FiSearch } from "react-icons/fi";

interface OrdersTableHeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedStatus: string | null;
  onStatusChange: (e: { value: string | null }) => void;
  orderStatusOptions: { label: string; value: string | null }[];
}

const OrdersTableHeader: React.FC<OrdersTableHeaderProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  orderStatusOptions,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 p-2 bg-gray-50 rounded-t">
      <div className="flex flex-col items-end md:flex-row gap-x-4 w-full md:w-auto">
        <Dropdown
          value={selectedStatus}
          options={orderStatusOptions}
          onChange={onStatusChange}
          placeholder="Filter"
          className="w-full md:w-48 h-12"
        />

        <div className="relative flex items-center w-full md:w-64">
          <FiSearch className="absolute ml-2 text-gray-400" />
          <input
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search..."
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded focus:outline-none font-light text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersTableHeader;
