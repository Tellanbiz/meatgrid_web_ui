import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import { deleteProduct } from "../domain/products-api";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductsTableProps {
  searchString: string;
  selectedStore: string | null;
  selectedStockStatus: string;
  filteredProducts: Product[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  searchString,
  selectedStore,
  selectedStockStatus,
  filteredProducts,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { status, error } = useAppSelector((state) => state.products);

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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchString, selectedStockStatus, selectedStore]);

  // Helper function to get total in stock
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

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
    setProductToDelete(rowData);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      const error = await deleteProduct(productToDelete.id);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Product deleted successfully");
        dispatch(
          fetchProducts(selectedStore ? { store_id: selectedStore } : undefined)
        );
      }
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const rowClassName = () => {
    return " hover:bg-gray-50";
  };

  return (
    <div className="h-full flex flex-col">
      {status === "loading" && (
        <ProgressBar
          mode="indeterminate"
          style={{ height: "4px" }}
          className="mb-2"
        />
      )}

      <div className="bg-white rounded-md overflow-hidden flex flex-col flex-1">
        <div className="flex-1">
          <DataTable
            value={currentProducts}
            dataKey="id"
            tableStyle={{
              ...DataTableStyle,
              borderCollapse: "separate",
              borderSpacing: "0 4px",
            }}
            scrollable
            scrollHeight="flex"
            size="normal"
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

        {/* ShadCN Pagination - Always at the end */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-700">
                Showing {filteredProducts.length > 0 ? startIndex + 1 : 0} to{" "}
                {Math.min(endIndex, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-700">Rows per page:</p>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(value) => {
                    setRowsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {generatePageNumbers().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={currentPage === page}
                            onClick={() => setCurrentPage(page as number)}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Product"
        description={
          <div>
            <p>Are you sure you want to delete this product?</p>
            {productToDelete && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <p className="font-medium text-gray-900">
                  {productToDelete.name}
                </p>
                <p className="text-sm text-gray-600">
                  ID: {productToDelete.id}
                </p>
              </div>
            )}
            <p className="text-sm text-red-600 mt-2">
              This action cannot be undone.
            </p>
          </div>
        }
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default React.memo(ProductsTable);
