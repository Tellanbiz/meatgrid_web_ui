import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OldProduct } from "../../../types/OldProduct";
import ProductsTableHeader from "./ProductsTableHeader";
import StatusBadge from "../../../components/StatusBadge";
import { inventoryStatusColor } from "../../../constants/StatusColors";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";

interface ProductsTableProps {
  products: OldProduct[];
  selectedProducts: OldProduct[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<OldProduct[]>>;
  globalFilter: string;
  dtRef: React.RefObject<DataTable<OldProduct[]>>;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  onDeleteClicked: () => void;
  onEditClicked: () => void;
}

export default function ProductsTable({
  products,
  selectedProducts,
  setSelectedProducts,
  globalFilter,
  setGlobalFilter,
  dtRef,
  onDeleteClicked,
  onEditClicked,
}: ProductsTableProps) {
  const dropdownOptions = [
    { label: "All", value: "All" },
    { label: "Ready", value: "Ready" },
    { label: "Shipped", value: "Shipped" },
    { label: "Received", value: "Received" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const imageBodyTemplate = (rowData: OldProduct) => {
    return (
      <div className="flex items-center">
        <img
          src={rowData.imageUrl}
          alt={rowData.name}
          className="shadow-2 border-round mr-3"
          style={{ width: "24px", height: "24px", objectFit: "cover" }}
        />

        <div>
          <div className="text-gray-900">{rowData.name}</div>
          <div className="text-sm text-gray-500">{rowData.category}</div>
        </div>
      </div>
    );
  };

  const priceBodyTemplate = (rowData: OldProduct) => {
    return formatCurrency(rowData.price);
  };

  const ratingBodyTemplate = (rowData: OldProduct) => {
    return <span>{rowData.rating.toFixed(1)} (20 votes)</span>;
  };

  const inventoryBodyTemplate = (rowData: OldProduct) => {
    return rowData.totalInventory > 0 ? (
      rowData.totalInventory + " in stock"
    ) : (
      <StatusBadge text="Out Of Stock" className={inventoryStatusColor["Out Of Stock"]} />
    );
  };

  return (
    <div>
      <div className="card bg-background">
        <DataTable
          ref={dtRef}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) =>
            setSelectedProducts(Array.isArray(e.value) ? e.value : [])
          }
          selectionMode="multiple"
          dataKey="name"
          tableStyle={DataTableStyle}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          scrollable
          scrollHeight="500px"
          size="small"
          globalFilter={globalFilter}
          header={
            <ProductsTableHeader
              searchTerm={globalFilter}
              onSearchChange={(e) => setGlobalFilter(e.target.value)}
              selectedStatus={null}
              onStatusChange={() => null}
              dropdownOptions={dropdownOptions}
              onDeleteClicked={onDeleteClicked}
              onEditClicked={onEditClicked}
            />
          }
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column
            field="name"
            header="Product"
            body={imageBodyTemplate}
            style={{ minWidth: "16rem" }}
            headerStyle={TableHeaderStyle}
          ></Column>
          <Column
            field="totalInventory"
            header="Inventory"
            body={inventoryBodyTemplate}
            sortable
            style={{ minWidth: "12rem" }}
            headerStyle={TableHeaderStyle}
          ></Column>
          <Column
            field="color"
            header="Color"
            style={{ minWidth: "8rem" }}
            headerStyle={TableHeaderStyle}
          ></Column>
          <Column
            field="price"
            header="Price"
            body={priceBodyTemplate}
            sortable
            style={{ minWidth: "10rem" }}
            headerStyle={TableHeaderStyle}
          ></Column>
          <Column
            field="rating"
            header="Rating"
            body={ratingBodyTemplate}
            sortable
            style={{ minWidth: "10rem" }}
            headerStyle={TableHeaderStyle}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
