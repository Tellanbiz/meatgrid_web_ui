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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Store,
} from "lucide-react";
import { PurchasableEditDialog } from "@/components/purchasable-edit-dialog";
import type { Purchasable } from "../domain/models";
import { deletePurchasable } from "../domain/purchasable-post";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import { toast } from "sonner";

export default function PurchasablePage() {
  const { 
    purchasables, 
    stores,
    selectedStore,
    loading, 
    storesLoading,
    error, 
    fetchPurchasables, 
    fetchStores,
    setSelectedStore,
    refreshData 
  } = usePurchasables();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPurchasable, setSelectedPurchasable] =
    useState<Purchasable | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purchasableToDelete, setPurchasableToDelete] =
    useState<Purchasable | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 15;

  // Helper function to get total in stock (same logic as product table)
  const getTotalInStock = (purchasable: Purchasable) => {
    const stockInfo = purchasable.stock_info;
    const totalIn = stockInfo.total_instock + stockInfo.total_reclaim;
    const totalOut =
      stockInfo.total_damaged +
      stockInfo.total_migrated +
      stockInfo.total_processed +
      stockInfo.total_sold;
    return totalIn - totalOut;
  };

  // Helper function to get total consumed
  const getTotalConsumed = (purchasable: Purchasable) => {
    const stockInfo = purchasable.stock_info;
    const totalOut =
      stockInfo.total_damaged +
      stockInfo.total_migrated +
      stockInfo.total_processed +
      stockInfo.total_sold;
    return totalOut;
  };

  // Helper function to format quantity with unit conversion
  const formatQuantity = (quantity: number, unitType: string) => {
    // Convert grams to kilograms if quantity is >= 1000 and unit type is kilograms
    if ((unitType === "kilograms" || unitType === "kilogram") && quantity >= 1000) {
      const kgQuantity = quantity / 1000;
      return `${kgQuantity.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg`;
    }
    return `${quantity.toLocaleString()} ${unitType}`;
  };

  useEffect(() => {
    fetchPurchasables();
    fetchStores();
  }, [fetchPurchasables, fetchStores]);

  // Filter purchasables based on search query
  const filteredPurchasables = purchasables.filter(
    (purchasable) =>
      purchasable.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchasable.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination for filtered results
  const totalPages = Math.ceil(filteredPurchasables.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPurchasables = filteredPurchasables.slice(startIndex, endIndex);

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

  const handleRefresh = async () => {
    await refreshData();
    toast.success("Data refreshed successfully!");
  };

  const handleNew = () => {
    setSelectedPurchasable(null);
    setIsDialogOpen(true);
  };

  const handleUpdate = (purchasable: Purchasable) => {
    setSelectedPurchasable(purchasable);
    setIsDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    refreshData();
  };

  const handleDelete = (purchasable: Purchasable) => {
    setPurchasableToDelete(purchasable);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!purchasableToDelete) return;

    setIsDeleting(true);
    try {
      const error = await deletePurchasable(purchasableToDelete.id.toString());
      if (error) {
        toast.error(error);
      } else {
        toast.success("Purchasable deleted successfully");
        refreshData();
      }
    } catch {
      toast.error("Failed to delete purchasable");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setPurchasableToDelete(null);
    }
  };

  return (
    <div className="p-8 font-lato bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Store Selection */}
          <div className="flex items-center space-x-2">
            <Store className="h-4 w-4 text-gray-500" />
            <Select value={selectedStore || "all"} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-48" disabled={storesLoading}>
                <SelectValue placeholder={storesLoading ? "Loading stores..." : "Select a store"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search purchasables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button size="sm" onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-400">Loading purchasables...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && filteredPurchasables.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">
            {searchQuery
              ? "No purchasables found matching your search."
              : "No purchasables found."}
          </p>
        </div>
      )}

      {!loading && !error && filteredPurchasables.length > 0 && (
        <>
          <div className="rounded-md border bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Unit Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>In Stock</TableHead>
                  <TableHead>Consumed</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPurchasables.map((purchasable) => (
                  <TableRow key={purchasable.id}>
                    <TableCell className="font-medium">
                      {purchasable.name}
                    </TableCell>
                    <TableCell>{purchasable.description}</TableCell>
                    <TableCell>{purchasable.unit_type}</TableCell>
                    <TableCell>
                      {getTotalInStock(purchasable) > 0 ? (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                          In stock
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-red-500 hover:bg-red-600">
                          Out of stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {formatQuantity(getTotalInStock(purchasable), purchasable.unit_type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatQuantity(getTotalConsumed(purchasable), purchasable.unit_type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(purchasable.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdate(purchasable)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(purchasable)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
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
                {Math.min(endIndex, filteredPurchasables.length)} of{" "}
                {filteredPurchasables.length} results
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

      {/* Purchasable Edit Dialog */}
      <PurchasableEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        purchasable={selectedPurchasable}
        onSuccess={handleDialogSuccess}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Purchasable"
        description={
          <div>
            <p>Are you sure you want to delete this purchasable?</p>
            {purchasableToDelete && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <p className="font-medium text-gray-900">
                  {purchasableToDelete.name}
                </p>
                <p className="text-sm text-gray-600">
                  {purchasableToDelete.description}
                </p>
                <p className="text-sm text-gray-600">
                  Unit Type: {purchasableToDelete.unit_type}
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
}
