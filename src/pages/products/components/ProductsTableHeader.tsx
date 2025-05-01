import React from "react";
import { Dropdown } from "primereact/dropdown";
import { FiSearch } from "react-icons/fi";

interface ProductsTableHeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedStatus: string | null;
  onStatusChange: (e: { value: string | null }) => void;
  dropdownOptions: { label: string; value: string | null }[];
}

const ProductsTableHeader: React.FC<ProductsTableHeaderProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  dropdownOptions,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-2 rounded-t">
      <div className="flex flex-col items-end md:flex-row gap-x-4 w-full md:w-auto">
        <Dropdown
          value={selectedStatus}
          options={dropdownOptions}
          onChange={onStatusChange}
          placeholder="Filter"
          className="w-full md:w-48 h-12 focus:outline-none"
        />

        <div className="relative flex items-center w-full md:w-64">
          <FiSearch className="absolute ml-2 text-gray-400" />
          <input
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search..."
            className="w-full pl-8 pr-4 py-2 h-10 border border-gray-300 rounded focus:outline-none text-sm font-light"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsTableHeader;
