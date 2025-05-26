import React from "react";
import { Dropdown } from "primereact/dropdown";

interface DropdownOption {
  label: string;
  value: string | null;
}

interface ActionButton {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

interface TableHeaderProps {
  searchTerm: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  dropdowns?: {
    value: string | null;
    options: DropdownOption[];
    onChange: (e: { value: string | null }) => void;
    placeholder?: string;
    className?: string;
  }[];
  actionButtons?: ActionButton[];
}

const TableHeader: React.FC<TableHeaderProps> = ({
  searchTerm = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  dropdowns = [],
  actionButtons = [],
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-gray-50 border-b border-gray-200 rounded-t">
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        {dropdowns.map((dropdown, index) => (
          <Dropdown
            key={index}
            value={dropdown.value}
            options={dropdown.options}
            onChange={dropdown.onChange}
            placeholder={dropdown.placeholder || "Filter"}
            className={`w-full md:w-48 ${dropdown.className || ""}`}
          />
        ))}
        {onSearchChange && (
          <div className="relative flex items-center w-full md:w-64">
            <i className="pi pi-search absolute left-3 text-gray-400" />
            <input
              value={searchTerm}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        {actionButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={`h-10 w-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 ${
              button.className || ""
            }`}
          >
            {button.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TableHeader;
