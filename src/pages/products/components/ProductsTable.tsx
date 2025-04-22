import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ProductsTableHeader from "./ProductsTableHeader";
import StatusBadge from "../../../components/StatusBadge";
import { inventoryStatusColor } from "../../../constants/StatusColors";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";
import { Product } from "../../../store/features/products/productTypes";
import { Badge } from "../../../components/ui/badge";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchProducts } from "../../../store/features/products/productSlice";
import { ProgressBar } from "primereact/progressbar";
import { toast } from "sonner";
import { fetchCategories } from "../../../store/features/categories/categoryThunks";
import { fetchTags } from "../../../store/features/tags/tagThunks";
import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

export default function ProductsTable() {
  const dispatch = useAppDispatch();
  const { products, status, error } = useAppSelector((state) => state.products);
  const { tags } = useAppSelector((state) => state.tags);
  const { categories } = useAppSelector((state) => state.categories);

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const dt = useRef<DataTable<Product[]>>(null!);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchTags());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (status == "failed") {
      toast.error(error);
    }
  }, [status, error]);

  const dropdownOptions = [
    { label: "All", value: "All" },
    { label: "Ready", value: "Ready" },
    { label: "Shipped", value: "Shipped" },
    { label: "Received", value: "Received" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  const getCategoryById = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "KSH",
    });
  };

  const imageBodyTemplate = (rowData: Product) => {
    return (
      <div className="flex items-center">
        <img
          src={rowData.images[0]}
          alt={rowData.name}
          className="shadow-2 rounded size-10 object-cover mr-3"
        />

        <div>
          <div className="text-gray-900">{rowData.name}</div>
          <Badge variant="outline" className="mt-1">
            {rowData.category_tag}
          </Badge>
        </div>
      </div>
    );
  };

  const priceBodyTemplate = (rowData: Product) => {
    return formatCurrency(rowData.regular_price);
  };

  const inventoryBodyTemplate = (rowData: Product) => {
    const inStock = rowData.stock_info.total_instock > 0;

    return inStock ? (
      <Badge variant="default" className="bg-green-600 hover:bg-green-600">
        {rowData.stock_info.total_instock.toLocaleString()} in stock
      </Badge>
    ) : (
      <Badge variant="default" className="bg-red-600 hover:bg-red-600">
        Out of stock
      </Badge>
    );
  };

  const actionsBodyTemplate = (rowData: Product) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => handleView(rowData)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleEdit(rowData)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleDelete(rowData)}
            className="flex items-center gap-2 text-red-600"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const handleDeleteClicked = () => {};
  const handleEditClicked = () => {};
  const handleView = (rowData: Product) => {
    // Logic for viewing product
  };

  const handleEdit = (rowData: Product) => {
    // Logic for editing product
  };

  const handleDelete = (rowData: Product) => {
    // Logic for deleting product
  };

  return (
    <div>
      <div className="card bg-background">
        {status === "loading" && (
          <ProgressBar
            mode="indeterminate"
            style={{ height: "6px" }}
          ></ProgressBar>
        )}
        <DataTable
          ref={dt}
          value={products}
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
              onDeleteClicked={handleDeleteClicked}
              onEditClicked={handleEditClicked}
            />
          }
        >
          <Column
            field="name"
            header="Product"
            body={imageBodyTemplate}
            headerStyle={TableHeaderStyle}
          ></Column>
          <Column
            field="unit_type"
            header="Unit Type"
            headerStyle={TableHeaderStyle}
          ></Column>
          <Column
            header="Category"
            body={(rowData) =>
              getCategoryById(rowData.category_id)?.name ?? "-"
            }
            headerStyle={TableHeaderStyle}
          ></Column>
          <Column
            header="Inventory"
            body={inventoryBodyTemplate}
            sortable
            headerStyle={TableHeaderStyle}
          ></Column>
          <Column
            header="Regular Price"
            body={priceBodyTemplate}
            sortable
            headerStyle={TableHeaderStyle}
          ></Column>
          <Column
            header="Actions"
            body={actionsBodyTemplate}
            headerStyle={TableHeaderStyle}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
