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
import { MoreVertical, Pencil } from "lucide-react";
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
import { formatDate } from "@/utils/dateUtils";
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

interface StocksTableProps {
  searchTerm: string;
  startDate: Date | null;
  endDate: Date | null;
  selectedStatus: string;
}

const StocksTable: React.FC<StocksTableProps> = ({
  searchTerm,
  startDate,
  endDate,
  selectedStatus,
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

    // Filter by date range
    if (startDate || endDate) {
      filtered = filtered.filter((stock) => {
        const stockDate = new Date(stock.created_at);

        if (startDate && endDate) {
          return stockDate >= startDate && stockDate <= endDate;
        } else if (startDate) {
          return stockDate >= startDate;
        } else if (endDate) {
          return stockDate <= endDate;
        }

        return true;
      });
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((stock) => stock.status === selectedStatus);
    }

    setFilteredStocks(filtered);
  }, [stocks, searchTerm, startDate, endDate, selectedStatus]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, startDate, endDate, selectedStatus]);

  const handleEdit = (stock: Stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
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
    if (unitType.toLowerCase() === "grams" && quantity >= 1000) {
      const kgQuantity = quantity / 1000;
      return `${kgQuantity.toLocaleString()} kg`;
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
                  <TableCell>{formatDate(stock.created_at)}</TableCell>
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
    </div>
  );
};

export default StocksTable;
