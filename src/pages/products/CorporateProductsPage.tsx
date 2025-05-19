import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import {
  selectCorporateProducts,
  selectIsFetchingCorporateProducts,
} from "../../store/features/products/productSelectors";
import { ProgressBar } from "primereact/progressbar";
import { fetchCorporateProducts } from "../../store/features/products/corporateProductThunks";
import { CorporateProduct } from "../../store/features/products/corporateProductTypes";
import { Button } from "../../components/ui/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Pencil, RefreshCw, Search } from "lucide-react";
import { TableHeaderStyle, DataTableStyle } from "../../constants/TableStyles";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { clearProductMessages } from "../../store/features/products/productSlice";
import { UpdateCorporateProductDialog } from "./components";

const CorporateProductsPage = () => {
  const dispatch = useAppDispatch();
  const { organizationId } = useParams();
  const [searchString, setSearchString] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<CorporateProduct | null>(null);

  const corporateProducts = useAppSelector(selectCorporateProducts);
  const isFetching = useAppSelector(selectIsFetchingCorporateProducts);

  useEffect(() => {
    if (organizationId) {
      dispatch(fetchCorporateProducts({ user_id: organizationId }));
    }
  }, [dispatch, organizationId]);

  // Error handling
  const error = useAppSelector((state) => state.products.error);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearProductMessages());
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    if (organizationId) {
      dispatch(fetchCorporateProducts({ user_id: organizationId }));
    }
  };
  
  const refreshProducts = () => {
    if (organizationId) {
      dispatch(fetchCorporateProducts({ user_id: organizationId }));
    }
  };

  const imageBodyTemplate = (rowData: CorporateProduct) => {
    return (
      <div className="flex items-center py-2">
        <div className="flex-shrink-0">
          <img
            src={rowData.image || "https://via.placeholder.com/40"}
            alt={rowData.name}
            className="h-10 w-10 rounded-md object-cover border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/40";
            }}
          />
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-900">
            {rowData.name}
          </div>
          <div className="text-xs text-gray-500">{rowData.org.full_name}</div>
        </div>
      </div>
    );
  };

  const priceBodyTemplate = (rowData: CorporateProduct) => {
    return (
      <div className="text-sm font-medium">
        {rowData.regular_price.toLocaleString("en-US", {
          style: "currency",
          currency: "KSH",
        })}
      </div>
    );
  };

  const weightBodyTemplate = (rowData: CorporateProduct) => {
    return (
      <div className="text-sm">
        {rowData.weight} {rowData.unit_type}
      </div>
    );
  };

  const unitTypeBodyTemplate = (rowData: CorporateProduct) => {
    return <div className="text-sm">{rowData.unit_type}</div>;
  };

  const actionsBodyTemplate = (rowData: CorporateProduct) => {
    return (
      <div className="flex items-center justify-center w-full">
        <Button
          variant="ghost"
          size="sm"
          className="p-2"
          onClick={() => handleEditProduct(rowData)}
        >
          <Pencil className="h-4 w-4 text-primary" />
        </Button>
      </div>
    );
  };

  const handleEditProduct = (product: CorporateProduct) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedProduct(null);
  };

  const getFilteredProducts = () => {
    const search = searchString.trim().toLowerCase();
    if (search === "") return corporateProducts;

    return corporateProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.org.full_name.toLowerCase().includes(search)
    );
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col gap-4 bg-background border-b border-gray-100 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BackButton />
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                className="pl-9 h-10 border-gray-200 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isFetching}
            size="sm"
            className="px-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 card rounded-md shadow-sm border border-gray-100 overflow-hidden bg-white">
        {isFetching && (
          <ProgressBar
            mode="indeterminate"
            style={{ height: "4px" }}
            className="mb-2"
          />
        )}
        <DataTable
          value={filteredProducts}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          dataKey="id"
          emptyMessage={
            searchString.trim() !== ""
              ? "No matching products found"
              : "No corporate products found"
          }
          tableStyle={DataTableStyle}
          scrollable
          scrollHeight="flex"
          size="small"
        >
          <Column
            header="Product"
            body={imageBodyTemplate}
            headerStyle={TableHeaderStyle}
          />
          <Column
            field="unit_type"
            header="Unit Type"
            body={unitTypeBodyTemplate}
            headerStyle={TableHeaderStyle}
          />
          <Column
            header="Weight"
            body={weightBodyTemplate}
            headerStyle={TableHeaderStyle}
            field="weight"
          />
          <Column
            header="Price"
            body={priceBodyTemplate}
            field="regular_price"
            headerStyle={TableHeaderStyle}
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

      {/* Update Dialog */}
      <UpdateCorporateProductDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        product={selectedProduct}
        organizationId={organizationId || ""}
        onSuccess={refreshProducts}
      />
    </div>
  );
};

export default CorporateProductsPage;
