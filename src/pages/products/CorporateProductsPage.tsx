import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useLocation, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import {
  selectCorporateProducts,
  selectStoreProducts,
  selectIsFetchingCorporateProducts,
  selectIsFetchingStoreProducts,
  selectProductSuccessMessage,
  selectProductError,
  selectIsDeletingStoreProduct,
} from "../../store/features/products/productSelectors";
import { deleteStoreProduct } from "../../store/features/products/storeProductThunks";
import DeleteDialog from "../../components/DeleteDialog";
import { ProgressBar } from "primereact/progressbar";
import { fetchCorporateProducts } from "../../store/features/products/corporateProductThunks";
import { CorporateProduct } from "../../store/features/products/corporateProductTypes";
import { StoreProduct } from "../../store/features/products/storeProductTypes";
import { BaseProduct } from "../../store/features/products/productTypes";
import { Button } from "../../components/ui/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  Pencil,
  RefreshCw,
  Search,
  MoreVertical,
  Trash2,
  Plus,
} from "lucide-react";
import { TableHeaderStyle, DataTableStyle } from "../../constants/TableStyles";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { clearProductMessages } from "../../store/features/products/productSlice";
import {
  UpdateCorporateProductDialog,
  AddCorporateProductDialog,
} from "./components";
import { formatCurrency, formatWeight } from "../../utils/formatters";
import { fetchStoreProducts } from "../../store/features/products/storeProductThunks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useModal } from "../../hooks/use-modal";

const CorporateProductsPage = () => {
  const dispatch = useAppDispatch();
  const { organizationId, warehouseId } = useParams();
  const location = useLocation();

  const isOrganizationContext = location.pathname.includes("/organizations/");
  const contextId = organizationId || warehouseId;

  const [searchString, setSearchString] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useModal();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useModal();
  const [selectedProduct, setSelectedProduct] = useState<
    CorporateProduct | StoreProduct | null
  >(null);
  const [productToDelete, setProductToDelete] = useState<
    CorporateProduct | StoreProduct | null
  >(null);

  const corporateProducts = useAppSelector(selectCorporateProducts);
  const storeProducts = useAppSelector(selectStoreProducts);
  const isFetchingCorporateProducts = useAppSelector(
    selectIsFetchingCorporateProducts
  );
  const isFetchingStoreProducts = useAppSelector(selectIsFetchingStoreProducts);
  const isDeletingStoreProduct = useAppSelector(selectIsDeletingStoreProduct);
  const isLoading = isFetchingCorporateProducts || isFetchingStoreProducts;

  // Fetch corporate products for this organization
  useEffect(() => {
    if (contextId) {
      if (isOrganizationContext && organizationId) {
        dispatch(fetchCorporateProducts({ user_id: contextId }));
      } else if (warehouseId) {
        dispatch(fetchStoreProducts({ store_id: warehouseId }));
      }
    }
  }, [dispatch, organizationId, warehouseId, contextId, isOrganizationContext]);

  // Error handling
  const error = useAppSelector(selectProductError);
  const successMessage = useAppSelector(selectProductSuccessMessage);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearProductMessages());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearProductMessages());
    }
  }, [successMessage, dispatch]);

  const handleRefresh = () => {
    if (contextId) {
      if (isOrganizationContext && organizationId) {
        dispatch(fetchCorporateProducts({ user_id: organizationId }));
      } else if (warehouseId) {
        dispatch(fetchStoreProducts({ store_id: warehouseId }));
      }
    }
  };

  const refreshProducts = () => {
    if (contextId) {
      if (isOrganizationContext && organizationId) {
        dispatch(fetchCorporateProducts({ user_id: organizationId }));
      } else if (warehouseId) {
        dispatch(fetchStoreProducts({ store_id: warehouseId }));
      }
    }
  };

  const handleAddProduct = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const getOrganizationName = (product: CorporateProduct | StoreProduct) => {
    if ("org" in product) {
      return product.org.full_name;
    }
    return product.store.name;
  };

  const imageBodyTemplate = (rowData: CorporateProduct | StoreProduct) => {
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
          <div className="text-xs text-gray-500">
            {getOrganizationName(rowData)}
          </div>
        </div>
      </div>
    );
  };

  const priceBodyTemplate = (rowData: BaseProduct) => {
    return (
      <div className="text-sm font-medium">
        {formatCurrency(rowData.regular_price)}
      </div>
    );
  };

  const weightBodyTemplate = (rowData: BaseProduct) => {
    return (
      <div className="text-sm">
        {formatWeight(rowData.weight, rowData.unit_type)}
      </div>
    );
  };

  const unitTypeBodyTemplate = (rowData: BaseProduct) => {
    return <div className="text-sm">{rowData.unit_type}</div>;
  };

  const actionsBodyTemplate = (rowData: CorporateProduct | StoreProduct) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => handleEditProduct(rowData)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleDeleteProduct(rowData)}
            className="flex items-center gap-2 text-red-600"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const handleEditProduct = (product: CorporateProduct | StoreProduct) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleDeleteProduct = (product: CorporateProduct | StoreProduct) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete || !warehouseId) return;

    try {
      await dispatch(
        deleteStoreProduct({
          store_id: warehouseId,
          product_id: productToDelete.id,
        })
      ).unwrap();

      setIsDeleteDialogOpen(false);
      refreshProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedProduct(null);
  };

  const getFilteredProducts = () => {
    const products = isOrganizationContext ? corporateProducts : storeProducts;
    const search = searchString.trim().toLowerCase();
    if (search === "") return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        getOrganizationName(product).toLowerCase().includes(search)
    );
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="h-full p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-x-2">
            <BackButton />
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                className="pl-9 h-9 border-gray-200 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              size="sm"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="ml-2">Refresh</span>
            </Button>

            <Button onClick={handleAddProduct} size="sm" className="px-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {isLoading && (
        <ProgressBar mode="indeterminate" style={{ height: "4px" }} />
      )}

      <div className="h-table">
        <DataTable
          value={filteredProducts}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          dataKey="id"
          emptyMessage={
            searchString.trim() !== ""
              ? "No matching products found"
              : `No ${
                  isOrganizationContext ? "organization" : "store"
                } products found`
          }
          tableStyle={DataTableStyle}
          scrollable
          scrollHeight="flex"
          size="small"
          className="bg-white p-2 rounded-md"
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

      <UpdateCorporateProductDialog
        context={isOrganizationContext ? "organization" : "store"}
        contextId={contextId || ""}
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        product={selectedProduct}
        onSuccess={refreshProducts}
      />

      {/* Add Product Dialog */}
      <AddCorporateProductDialog
        context={isOrganizationContext ? "organization" : "store"}
        contextId={contextId || ""}
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        onSuccess={refreshProducts}
      />

      {/*  Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingStoreProduct}
      />
    </div>
  );
};

export default CorporateProductsPage;
