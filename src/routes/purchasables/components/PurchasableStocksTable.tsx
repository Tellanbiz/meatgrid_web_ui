import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import type { PurchasableStock } from "../domain/models";
import { formatLocalDate } from "../utils/dateUtils";
import {
  deletePurchasableStock,
  updatePurchasableStock,
} from "../domain/purchasable-post";

interface PurchasableStocksTableProps {
  stocks: PurchasableStock[];
  loading: boolean;
  searchTerm: string;
  startDate: Date | null;
  endDate: Date | null;
  selectedStatus: string;
  selectedStore: string;
  onDelete?: () => void;
}

const PurchasableStocksTable: React.FC<PurchasableStocksTableProps> = ({
  stocks,
  loading,
  searchTerm,
  startDate,
  endDate,
  selectedStatus,
  selectedStore,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState<PurchasableStock | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [stockToUpdate, setStockToUpdate] = useState<PurchasableStock | null>(
    null
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateQuantity, setUpdateQuantity] = useState<string>("");

  // Calculate pagination
  const totalPages = Math.ceil(stocks.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentStocks = stocks.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedStore, startDate, endDate]);

  const handleDelete = (stock: PurchasableStock) => {
    setStockToDelete(stock);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!stockToDelete) return;

    setIsDeleting(true);
    try {
      const error = await deletePurchasableStock(stockToDelete.production_id);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Purchasable stock deleted successfully");
        setIsDeleteDialogOpen(false);
        setStockToDelete(null);
        if (onDelete) {
          onDelete();
        }
      }
    } catch {
      toast.error("An error occurred while deleting the stock");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setStockToDelete(null);
  };

  const handleUpdate = (stock: PurchasableStock) => {
    setStockToUpdate(stock);
    setUpdateQuantity(stock.quantity.toString());
    setIsUpdateDialogOpen(true);
  };

  const handleConfirmUpdate = async () => {
    if (!stockToUpdate || !updateQuantity) return;

    const quantity = parseFloat(updateQuantity);
    if (isNaN(quantity) || quantity < 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    setIsUpdating(true);
    try {
      const error = await updatePurchasableStock({
        id: stockToUpdate.id,
        quantity: quantity,
      });
      if (error) {
        toast.error(error);
      } else {
        toast.success("Purchasable stock updated successfully");
        setIsUpdateDialogOpen(false);
        setStockToUpdate(null);
        setUpdateQuantity("");
        if (onDelete) {
          onDelete();
        }
      }
    } catch {
      toast.error("An error occurred while updating the stock");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelUpdate = () => {
    setIsUpdateDialogOpen(false);
    setStockToUpdate(null);
    setUpdateQuantity("");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "instock":
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-blue-100 text-blue-800";
      case "migrated":
        return "bg-purple-100 text-purple-800";
      case "processed":
        return "bg-orange-100 text-orange-800";
      case "damaged":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatQuantity = (quantity: number, unitType: string) => {
    // Convert grams to kilograms if quantity is >= 1000 and unit type is kilograms
    if (
      (unitType === "kilograms" || unitType === "kilogram") &&
      quantity >= 1000
    ) {
      const kgQuantity = quantity / 1000;
      return `${kgQuantity.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })} kg`;
    }
    return `${quantity.toLocaleString()} ${unitType}`;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-12 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loading && <Progress value={undefined} className="w-full" />}

      <div className="bg-white rounded-md overflow-hidden border border-gray-200">
        <div className="flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purchasable</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">
                      {searchTerm ||
                      selectedStatus !== "all" ||
                      selectedStore !== "all" ||
                      startDate ||
                      endDate
                        ? "No stocks found matching your filters."
                        : "No purchasable stocks found."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                currentStocks.map((stock) => {
                  // Handle both 'purchasable' and 'product' properties
                  const purchasable = stock.purchasable || stock.product;

                  return (
                    <TableRow key={stock.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {purchasable?.name || "Unknown Purchasable"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {stock.store?.name || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {formatQuantity(
                            stock.quantity,
                            purchasable?.unit_type || "pieces"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(stock.status)}>
                          {stock.status || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {stock.created_at
                            ? formatLocalDate(stock.created_at)
                            : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdate(stock)}
                            className="flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" /> Update
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(stock)}
                            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-700">
                  Showing {stocks.length > 0 ? startIndex + 1 : 0} to{" "}
                  {Math.min(endIndex, stocks.length)} of {stocks.length} stocks
                </p>
              </div>

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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
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
            </div>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Purchasable Stock</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this purchasable stock? This
              action cannot be undone.
            </DialogDescription>
            {stockToDelete && (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="font-medium">
                  {stockToDelete.purchasable?.name ||
                    stockToDelete.product?.name ||
                    "Unknown Purchasable"}
                </p>
                <p className="text-sm text-gray-600">
                  Quantity:{" "}
                  {formatQuantity(
                    stockToDelete.quantity,
                    stockToDelete.purchasable?.unit_type ||
                      stockToDelete.product?.unit_type ||
                      "pieces"
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  Store: {stockToDelete.store?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {stockToDelete.status || "Unknown"}
                </p>
              </div>
            )}
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Purchasable Stock</DialogTitle>
            <DialogDescription>
              Update the quantity for this purchasable stock.
            </DialogDescription>
            {stockToUpdate && (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="font-medium">
                  {stockToUpdate.purchasable?.name ||
                    stockToUpdate.product?.name ||
                    "Unknown Purchasable"}
                </p>
                <p className="text-sm text-gray-600">
                  Current Quantity:{" "}
                  {formatQuantity(
                    stockToUpdate.quantity,
                    stockToUpdate.purchasable?.unit_type ||
                      stockToUpdate.product?.unit_type ||
                      "pieces"
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  Store: {stockToUpdate.store?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {stockToUpdate.status || "Unknown"}
                </p>
              </div>
            )}
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">New Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0"
                value={updateQuantity}
                onChange={(e) => setUpdateQuantity(e.target.value)}
                placeholder="Enter new quantity"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelUpdate}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUpdate}
              disabled={isUpdating || !updateQuantity}
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchasableStocksTable;
