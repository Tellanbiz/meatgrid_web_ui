import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Search, ChevronLeft, ChevronRight, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProductionBatches } from "../domain/purchasable-get";
import type { ProductionBatch } from "../domain/production-models";
import { toast } from "sonner";

const PurchasableProductionBatchesPage = () => {
  const navigate = useNavigate();
  const [searchString, setSearchString] = useState<string>("");
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductionBatches();
      setBatches(data);
    } catch (err) {
      setError("Failed to fetch production batches");
      toast.error("Failed to fetch production batches");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchBatches();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter batches based on search query
  const filteredBatches = batches.filter(batch =>
    batch.batch_number.toLowerCase().includes(searchString.toLowerCase()) ||
    batch.product.name.toLowerCase().includes(searchString.toLowerCase()) ||
    batch.production_id.toLowerCase().includes(searchString.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBatches = filteredBatches.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleProduceProducts = () => {
    navigate("/purchasable-produce");
  };







    return (
    <div className="space-y-4 p-6 bg-white">
      <div className="flex flex-col border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search batches..."
                value={searchString}
                onChange={handleSearchChange}
                className="pl-9 h-10 border-gray-200 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleProduceProducts}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Factory className="h-4 w-4" />
              <span className="ml-2">Produce</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              size="sm"
              className="px-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="ml-2">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="h-table">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-400">Loading production batches...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && filteredBatches.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">
              {searchString
                ? "No production batches found matching your search."
                : "No production batches found."}
            </p>
          </div>
        )}

        {!loading && !error && filteredBatches.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Frozen At</TableHead>
                    <TableHead>Chilled At</TableHead>
                    <TableHead>Manufactured At</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBatches.map((batch) => (
                    <TableRow 
                      key={batch.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/purchasable-production-batches/${batch.id}`)}
                    >
                      <TableCell className="font-medium">
                        {batch.batch_number}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {batch.product.image && (
                            <img
                              src={batch.product.image}
                              alt={batch.product.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">{batch.product.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{(batch.quantity || 0).toLocaleString()}</span>
                        {/* Note: Unit type not available in ProductionBatch interface */}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {batch.frozen_at ? new Date(batch.frozen_at).toLocaleDateString() : 'Not frozen'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {batch.chilled_at ? new Date(batch.chilled_at).toLocaleDateString() : 'Not chilled'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {batch.manufactured_at ? new Date(batch.manufactured_at).toLocaleDateString() : 'Not manufactured'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(batch.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/purchasable-production-batches/${batch.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredBatches.length)} of{" "}
              {filteredBatches.length} results
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
      </div>
    </div>
  );
};

export default PurchasableProductionBatchesPage; 