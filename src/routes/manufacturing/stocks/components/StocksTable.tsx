import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchStocks,
  updateStockQuantity,
} from "@/store/features/stock/stockThunks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stock } from "@/store/features/stock/stockTypes";
import { Badge } from "@/components/ui/badge";
import {
  selectIsFetchingStocks,
  selectStocks,
} from "@/store/features/stock/stockSelectors";
import { useModal } from "@/shared/hooks/use-modal";
import UpdateStockDialog from "./UpdateStockDialog";
import { toast } from "sonner";
import { UpdateStockQuantityRequest } from "@/store/features/stock/request/UpdateStockQuantityRequest";
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
import { deleteStock } from "../services/stock-helpers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StocksTableProps {
  searchTerm: string;
  startDate: Date | null;
  endDate: Date | null;
  selectedStatus: string;
  selectedStore: string;
}

const StocksTable: React.FC<StocksTableProps> = ({
  searchTerm,
  startDate,
  endDate,
  selectedStatus,
  selectedStore,
}) => {
  const dispatch = useAppDispatch();
  const isFetchingStocks = useAppSelector(selectIsFetchingStocks);
  const stocks = useAppSelector(selectStocks);
  const [isModalOpen, setIsModalOpen] = useModal();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [filteredStocks, setFilteredStocks] = useState(stocks);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState<Stock | null>(null);

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  useEffect(() => {
    let filtered = stocks;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((stock) =>
        stock.product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range (use local time)
    if (startDate || endDate) {
      filtered = filtered.filter((stock) => {
        // Convert created_at to local Date
        const stockDate = new Date(stock.created_at);
        // Remove time for date-only comparison
        const stockLocalDate = new Date(stockDate.getFullYear(), stockDate.getMonth(), stockDate.getDate());
        let afterStart = true;
        let beforeEnd = true;
        if (startDate) {
          const startLocal = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
          afterStart = stockLocalDate >= startLocal;
        }
        if (endDate) {
          const endLocal = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
          beforeEnd = stockLocalDate <= endLocal;
        }
        return afterStart && beforeEnd;
      });
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((stock) => stock.status === selectedStatus);
    }

    // Filter by store
    if (selectedStore !== "all") {
      filtered = filtered.filter((stock) => stock.store?.id === selectedStore);
    }

    setFilteredStocks(filtered);
  }, [stocks, searchTerm, startDate, endDate, selectedStatus, selectedStore]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, startDate, endDate, selectedStatus, selectedStore]);

  const handleEdit = (stock: Stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const handleDelete = (stock: Stock) => {
    setStockToDelete(stock);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!stockToDelete) return;

    setIsLoading(true);
    try {
      const success = await deleteStock(stockToDelete.id);
      if (success) {
        toast.success("Stock deleted successfully");
        dispatch(fetchStocks());
      } else {
        toast.error("Failed to delete stock");
      }
    } catch {
      toast.error("An error occurred while deleting the stock");
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setStockToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setStockToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateStock = async (newQuantity: number) => {
    setIsLoading(true);
    try {
      if (!selectedStock) {
        return;
      }

      const request: UpdateStockQuantityRequest = {
        id: selectedStock.id,
        quantity: newQuantity,
      };

      const message = await dispatch(updateStockQuantity(request)).unwrap();
      toast.success(message);
      setIsModalOpen(false);
      dispatch(fetchStocks());
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred while updating the stock.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredStocks.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in stock":
        return "bg-green-100 text-green-800";
      case "low stock":
        return "bg-yellow-100 text-yellow-800";
      case "out of stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatQuantity = (quantity: number, unitType: string) => {
    if (unitType.toLowerCase() === "kilograms" && quantity >= 1000) {
      const kgQuantity = quantity / 1000;
      return `${kgQuantity.toLocaleString()} ${unitType}`;
    }
    return `${quantity.toLocaleString()} ${unitType}`;
  };

  if (isFetchingStocks) {
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
    <div className="h-full flex flex-col bg-white`">
      {isFetchingStocks && <Progress value={undefined} className="h-1" />}

      {/* Table */}
      <div className="flex-1 rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  {searchTerm || startDate || endDate
                    ? "No stocks found matching your search criteria."
                    : "No stocks available."}
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell className="font-medium">
                    {stock.product.name}
                  </TableCell>
                  <TableCell>{stock.store?.name ?? "N/A"}</TableCell>
                  <TableCell>
                    {formatQuantity(stock.quantity, stock.product.unit_type)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(stock.status)}>
                      {stock.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(stock.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => handleEdit(stock)}
                          className="flex items-center gap-2"
                        >
                          <Pencil className="h-4 w-4" /> Update Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleDelete(stock)}
                          className="flex items-center gap-2 text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" /> Delete Stock
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="py-4 border-t mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first page, last page, current page, and pages around current page
                  const isFirstPage = page === 1;
                  const isLastPage = page === totalPages;
                  const isCurrentPage = page === currentPage;
                  const isNearCurrentPage = Math.abs(page - currentPage) <= 1;

                  if (
                    isFirstPage ||
                    isLastPage ||
                    isCurrentPage ||
                    isNearCurrentPage
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={isCurrentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <span className="px-4">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                }
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <UpdateStockDialog
        isLoading={isLoading}
        open={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdateStock}
        stock={selectedStock}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Stock</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this stock? This action cannot be
              undone.
            </DialogDescription>
            {stockToDelete && (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="font-medium">{stockToDelete.product.name}</p>
                <p className="text-sm text-gray-600">
                  Quantity:{" "}
                  {formatQuantity(
                    stockToDelete.quantity,
                    stockToDelete.product.unit_type
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  Store: {stockToDelete.store?.name ?? "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Created At: {new Date(stockToDelete.created_at).toLocaleString()}
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
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StocksTable;
