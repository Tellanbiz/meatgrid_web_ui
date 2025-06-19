import { useEffect, useState } from "react";
import { usePurchasables } from "../hooks/usePurchasables";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  Calendar,
  Plus,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PurchasableOrderCreateDialog } from "@/components/purchasable-order-create-dialog";

export default function PurchasableOrderPage() {
  const {
    purchasables,
    purchasableOrders,
    loading,
    error,
    fetchPurchasableOrders,
    fetchPurchasables,
  } = usePurchasables();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const itemsPerPage = 15;

  useEffect(() => {
    // Set default dates (30 days ago to today)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Convert to dd-mm-yyyy format for API
    const formatDateForAPI = (date: Date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    setEndDate(today.toISOString().split("T")[0]); // Keep YYYY-MM-DD for HTML input
    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]); // Keep YYYY-MM-DD for HTML input

    // Pass dd-mm-yyyy format to API
    fetchPurchasableOrders(
      formatDateForAPI(thirtyDaysAgo),
      formatDateForAPI(today)
    );
    fetchPurchasables(); // Also fetch purchasables for the create dialog
  }, [fetchPurchasableOrders, fetchPurchasables]);

  // Filter purchasable orders based on search query
  const filteredOrders = purchasableOrders.filter(
    (order) =>
      order.supplier.full_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery)
  );

  // Calculate pagination for filtered results
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleRefresh = () => {
    if (startDate && endDate) {
      const formatDateForAPI = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
      fetchPurchasableOrders(
        formatDateForAPI(startDate),
        formatDateForAPI(endDate)
      );
    }
  };

  const handleDateChange = () => {
    if (startDate && endDate) {
      const formatDateForAPI = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
      fetchPurchasableOrders(
        formatDateForAPI(startDate),
        formatDateForAPI(endDate)
      );
      setCurrentPage(1);
    }
  };

  const handleNewOrder = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateSuccess = () => {
    handleRefresh(); // Refresh the orders list
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="font-lato">
      {/* Tabs Header */}
      <Tabs defaultValue="orders" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2 h-12 bg-white border-0 rounded-none p-0">
          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700 data-[state=active]:border-b-2 data-[state=active]:border-red-600 rounded-none border-b-2 border-transparent h-full font-medium"
          >
            Purchasable Orders
          </TabsTrigger>
          <TabsTrigger
            value="new-order"
            className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700 data-[state=active]:border-b-2 data-[state=active]:border--600 rounded-none border-b-2 border-transparent h-full font-medium"
          >
            New Purchasable Order
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6 px-8">
          <div className="flex items-center justify-between mb-6">
            {/* Search Bar and Date Range */}
            <div className="flex items-center space-x-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders, suppliers, users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {/* Date Range Filter */}
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                />
                <span className="text-gray-400">to</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40"
                />
                <Button
                  size="sm"
                  onClick={handleDateChange}
                  disabled={!startDate || !endDate}
                >
                  Apply
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm" onClick={handleNewOrder}>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-400">Loading purchasable orders...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && filteredOrders.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">
                {searchQuery
                  ? "No orders found matching your search."
                  : "No purchasable orders found for the selected date range."}
              </p>
            </div>
          )}

          {!loading && !error && filteredOrders.length > 0 && (
            <>
              <div className="rounded-md border bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Items Count</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {order.supplier.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.supplier.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {order.user.full_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {order.items.length} items
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(order.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredOrders.length)} of{" "}
                    {filteredOrders.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="new-order" className="mt-6">
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Create New Purchasable Order
            </h3>
            <p className="text-gray-600 mb-4">
              Click the button below to create a new purchasable order
            </p>
            <Button onClick={handleNewOrder} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create New Order
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Order Dialog */}
      <PurchasableOrderCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        purchasables={purchasables}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
