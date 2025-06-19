import React, { useEffect, useState } from "react";
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
  Plus,
  Edit,
} from "lucide-react";
import { PurchasableEditDialog } from "@/components/purchasable-edit-dialog";
import type { Purchasable } from "../domain/models";

export default function PurchasablePage() {
  const { purchasables, loading, error, fetchPurchasables } = usePurchasables();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPurchasable, setSelectedPurchasable] =
    useState<Purchasable | null>(null);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchPurchasables();
  }, [fetchPurchasables]);

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

  const handleRefresh = () => {
    fetchPurchasables();
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
    fetchPurchasables();
  };

  return (
    <div className="p-8 font-lato">
      <div className="flex items-center justify-between mb-6">
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
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Unit Type</TableHead>
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
    </div>
  );
}
