import React from "react";
import { Dropdown } from "primereact/dropdown";
import { FiSearch } from "react-icons/fi";

export interface DropdownOption {
  label: string;
  value: string | null;
}

interface ProductsTableHeaderProps {
  searchString: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedStore: string | null;
  onStoreChange: (e: { value: string }) => void;
  storeOptions: DropdownOption[];
}

const ProductsTableHeader: React.FC<ProductsTableHeaderProps> = ({
  searchString,
  onSearchChange,
  selectedStore,
  onStoreChange,
  storeOptions,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-2 rounded-t">
      <div className="flex flex-col items-end md:flex-row gap-x-4 w-full md:w-auto">
        <Dropdown
          value={selectedStore}
          options={storeOptions}
          onChange={onStoreChange}
          placeholder="Select Store"
          className="w-full md:w-48 h-12 focus:outline-none"
        />

        <div className="relative flex items-center w-full md:w-64">
          <FiSearch className="absolute ml-2 text-gray-400" />
          <input
            value={searchString}
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
