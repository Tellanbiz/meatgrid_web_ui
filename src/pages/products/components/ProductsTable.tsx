import { useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../shared/constants/TableStyles";
import { Product } from "../../../store/features/products/productTypes";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchProducts } from "../../../store/features/products/productThunks";
import { ProgressBar } from "primereact/progressbar";
import { toast } from "sonner";
import { fetchCategories } from "../../../store/features/categories/categoryThunks";
import { fetchTags } from "../../../store/features/tags/tagThunks";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { resetProductState } from "../../../store/features/products/productSlice";
import { fetchStores } from "../../../store/features/stores/storeThunks";
import { selectProducts } from "../../../store/features/products/productSelectors";
import { useNavigate } from "react-router-dom";

interface ProductsTableProps {
  searchString: string;
  selectedStore: string | null;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  searchString,
  selectedStore,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { status, error } = useAppSelector((state) => state.products);
  const products: Product[] = useAppSelector(selectProducts);

  useEffect(() => {
    dispatch(fetchStores());
    dispatch(
      fetchProducts(selectedStore ? { store_id: selectedStore } : undefined)
    );
    dispatch(fetchTags());
    dispatch(fetchCategories());
  }, [dispatch, selectedStore]);

  useEffect(() => {
    if (status == "failed") {
      toast.error(error);
      dispatch(resetProductState());
    }
  }, [status, error, dispatch]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "KSH",
    });
  };

  const imageBodyTemplate = (rowData: Product) => {
    return (
      <div className="flex items-center px-4">
        <div className="flex-shrink-0">
          <img
            src={rowData.images[0] || "https://via.placeholder.com/40"}
            alt={rowData.name}
            className="h-10 w-10 rounded-md object-cover border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/40";
            }}
          />
        </div>
        <div className="ml-3">
          <div className="text-sm font-semibold text-gray-900">
            {rowData.name}
          </div>
        </div>
      </div>
    );
  };

  const priceBodyTemplate = (rowData: Product) => {
    return (
      <div className="font-medium text-sm">
        {formatCurrency(rowData.regular_price)}
      </div>
    );
  };

  const getTotalInStock = (product: Product) => {
    const stockInfo = product.stock_info;
    const totalIn = stockInfo.total_instock + stockInfo.total_reclaim;

    const totalOut =
      stockInfo.total_damaged +
      stockInfo.total_migrated +
      stockInfo.total_processed +
      stockInfo.total_sold;
    return totalIn - totalOut;
  };

  const getTotalConsumed = (product: Product) => {
    const stockInfo = product.stock_info;
    const totalOut =
      stockInfo.total_damaged +
      stockInfo.total_migrated +
      stockInfo.total_processed +
      stockInfo.total_sold;
    return totalOut;
  };

  const statusBodyTemplate = (product: Product) => {
    const inStock = getTotalInStock(product) > 0;

    return inStock ? (
      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
        In stock
      </Badge>
    ) : (
      <Badge variant="default" className="bg-red-500 hover:bg-red-600">
        Out of stock
      </Badge>
    );
  };

  const totalConsumedBodyTemplate = (product: Product) => {
    const totalOut = getTotalConsumed(product);
    return (
      <div className="text-sm">
        {totalOut.toLocaleString()} {product.unit_type}
      </div>
    );
  };

  const totalInStockBodyTemplate = (product: Product) => {
    const totalIn = getTotalInStock(product);
    return (
      <div className="text-sm font-medium">
        {totalIn.toLocaleString()} {product.unit_type}
      </div>
    );
  };

  const unitTypeBodyTemplate = (product: Product) => {
    return <div className="text-sm">{product.unit_type}</div>;
  };

  const actionsBodyTemplate = (rowData: Product) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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

  const handleEdit = (rowData: Product) => {
    navigate(`/products/${rowData.id}/edit`);
  };

  const handleDelete = (rowData: Product) => {
    console.log("Delete product", rowData);
  };

  const rowClassName = () => {
    return " hover:bg-gray-50";
  };

  return (
    <div className="h-full">
      {status === "loading" && (
        <ProgressBar
          mode="indeterminate"
          style={{ height: "4px" }}
          className="mb-2"
        />
      )}

      <DataTable
        value={products}
        dataKey="id"
        tableStyle={{
          ...DataTableStyle,
          borderCollapse: "separate",
          borderSpacing: "0 4px",
        }}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        scrollable
        scrollHeight="flex"
        size="normal"
        globalFilter={searchString}
        emptyMessage="No products found"
        rowHover
        className="p-datatable-sm"
        rowClassName={rowClassName}
      >
        <Column
          field="name"
          header="Product"
          body={imageBodyTemplate}
          headerStyle={{ ...TableHeaderStyle }}
        />

        <Column
          field="unit_type"
          header="Unit Type"
          body={unitTypeBodyTemplate}
          headerStyle={{ ...TableHeaderStyle }}
        />

        <Column
          header="Price"
          body={priceBodyTemplate}
          headerStyle={{ ...TableHeaderStyle }}
        />

        <Column
          header="Status"
          body={statusBodyTemplate}
          headerStyle={{ ...TableHeaderStyle }}
        />

        <Column
          header="In Stock"
          body={totalInStockBodyTemplate}
          headerStyle={{ ...TableHeaderStyle }}
        />

        <Column
          header="Consumed"
          body={totalConsumedBodyTemplate}
          headerStyle={{ ...TableHeaderStyle }}
        />

        <Column
          header="Actions"
          body={actionsBodyTemplate}
          headerStyle={{
            ...TableHeaderStyle,
          }}
        />
      </DataTable>
    </div>
  );
};

export default React.memo(ProductsTable);
