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
import type { PurchasableStock } from "../domain/models";
import { formatLocalDate } from "../utils/dateUtils";

interface PurchasableStocksTableProps {
  stocks: PurchasableStock[];
  loading: boolean;
  searchTerm: string;
  startDate: Date | null;
  endDate: Date | null;
  selectedStatus: string;
  selectedStore: string;
}

const PurchasableStocksTable: React.FC<PurchasableStocksTableProps> = ({
  stocks,
  loading,
  searchTerm,
  startDate,
  endDate,
  selectedStatus,
  selectedStore,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(stocks.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentStocks = stocks.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedStore, startDate, endDate]);

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
    if ((unitType === "kilograms" || unitType === "kilogram") && quantity >= 1000) {
      const kgQuantity = quantity / 1000;
      return `${kgQuantity.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg`;
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
      {loading && (
        <Progress
          value={undefined}
          className="w-full"
        />
      )}

      <div className="bg-white rounded-md overflow-hidden">
        <div className="flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purchasable</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-gray-500">
                      {searchTerm || selectedStatus !== "all" || selectedStore !== "all" || startDate || endDate
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
                          <div className="font-medium">{purchasable?.name || "Unknown Purchasable"}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {stock.store?.name || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {formatQuantity(stock.quantity, purchasable?.unit_type || "pieces")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(stock.status)}>
                          {stock.status || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {stock.created_at ? formatLocalDate(stock.created_at) : "N/A"}
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
                  {Math.min(endIndex, stocks.length)} of{" "}
                  {stocks.length} stocks
                </p>
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasableStocksTable; 