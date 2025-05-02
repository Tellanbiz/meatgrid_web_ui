import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ProductsTableHeader from "./ProductsTableHeader";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";
import { Product } from "../../../store/features/products/productTypes";
import { Badge } from "../../../components/ui/badge";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchProducts } from "../../../store/features/products/productThunks";
import { ProgressBar } from "primereact/progressbar";
import { toast } from "sonner";
import { fetchCategories } from "../../../store/features/categories/categoryThunks";
import { fetchTags } from "../../../store/features/tags/tagThunks";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import React from "react";
import { resetProductState } from "../../../store/features/products/productSlice";
import { useNavigate } from "react-router-dom";
import { selectCategories } from "../../../store/features/categories/categorySelectors";
import { selectStores } from "../../../store/features/stores/storeSelectors";
import { fetchStores } from "../../../store/features/stores/storeThunks";
import { Store } from "../../../store/features/stores/storeTypes";
import { selectProducts } from "../../../store/features/products/productSelectors";
import { Category } from "../../../store/features/categories/categoryTypes";
const ProductsTable = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { status, error } = useAppSelector((state) => state.products);

  const products: Product[] = useAppSelector(selectProducts);
  const categories: Category[] = useAppSelector(selectCategories);
  const stores: Store[] = useAppSelector(selectStores);

  const [searchString, setSearchString] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const storeOptions = [
    { label: "All Stores", value: "all" },
    ...stores.map((store) => ({
      label: store.name,
      value: store.id,
    })),
  ];

  const handleStoreChange = (e: { value: string }) => {
    const storeId = e.value;
    if (storeId === "all") {
      setSelectedStore(null);
      dispatch(fetchProducts());
      return;
    }

    setSelectedStore(storeId);
    dispatch(fetchProducts({ store_id: storeId }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  useEffect(() => {
    dispatch(fetchStores());
    dispatch(fetchProducts());
    dispatch(fetchTags());
    dispatch(fetchCategories());
  }, [dispatch]);

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

  const getTotalInStock = (product: Product) => {
    const stockInfo = product.stock_info;
    const totalIn = stockInfo.total_instock + stockInfo.total_reclaim;

    const totalOut =
      stockInfo.total_correction +
      stockInfo.total_damaged +
      stockInfo.total_migrated +
      stockInfo.total_processed +
      stockInfo.total_sold;
    return totalIn - totalOut;
  };

  const getTotalConsumed = (product: Product) => {
    const stockInfo = product.stock_info;
    const totalOut =
      stockInfo.total_correction +
      stockInfo.total_damaged +
      stockInfo.total_migrated +
      stockInfo.total_processed +
      stockInfo.total_sold;
    return totalOut;
  };

  const statusBodyTemplate = (product: Product) => {
    const inStock = getTotalInStock(product) > 0;

    return inStock ? (
      <Badge variant="default" className="bg-green-600 hover:bg-green-600">
        In stock
      </Badge>
    ) : (
      <Badge variant="default" className="bg-red-600 hover:bg-red-600">
        Out of stock
      </Badge>
    );
  };

  const totalConsumedBodyTemplate = (product: Product) => {
    const totalOut = getTotalConsumed(product);
    return `${totalOut.toLocaleString()} ${product.unit_type}`;
  };

  const totalInStockBodyTemplate = (product: Product) => {
    const totalIn = getTotalInStock(product);
    return `${totalIn.toLocaleString()} ${product.unit_type}`;
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

  return (
    <div className="h-full">
      {status === "loading" && (
        <ProgressBar
          mode="indeterminate"
          style={{ height: "6px" }}
        ></ProgressBar>
      )}

      {status !== "loading" && (
        <DataTable
          value={products}
          dataKey="id"
          tableStyle={DataTableStyle}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          scrollable
          scrollHeight="flex"
          size="small"
          globalFilter={searchString}
          header={
            <ProductsTableHeader
              searchString={searchString}
              onSearchChange={handleSearchChange}
              selectedStore={selectedStore}
              onStoreChange={handleStoreChange}
              storeOptions={storeOptions}
            />
          }
        >
          <Column
            field="name"
            header="Product"
            body={imageBodyTemplate}
            headerStyle={TableHeaderStyle}
          />

          <Column
            field="unit_type"
            header="Unit Type"
            headerStyle={TableHeaderStyle}
          />

          <Column
            header="Regular Price"
            body={priceBodyTemplate}
            sortable
            headerStyle={TableHeaderStyle}
          />

          <Column
            header="Status"
            body={statusBodyTemplate}
            headerStyle={TableHeaderStyle}
          />

          <Column
            header="Total Instock"
            body={totalInStockBodyTemplate}
            headerStyle={TableHeaderStyle}
          />

          <Column
            header="Total Consumed"
            body={totalConsumedBodyTemplate}
            headerStyle={TableHeaderStyle}
          />

          <Column
            header="Actions"
            body={actionsBodyTemplate}
            headerStyle={TableHeaderStyle}
          />
        </DataTable>
      )}
    </div>
  );
};

export default React.memo(ProductsTable);
