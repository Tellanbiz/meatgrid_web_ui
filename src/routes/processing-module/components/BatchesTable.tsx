import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { QrCode, Barcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeImageDialog from "./CodeImageDialog";
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
import { useBatchesStore } from "../hooks/batches-store";

interface BatchesTableProps {
  searchString: string;
}

const BatchesTable: React.FC<BatchesTableProps> = ({ searchString }) => {
  const { batches, loading, error, fetchBatches } = useBatchesStore();
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    batchNumber: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const filteredBatches = batches.filter((batch) =>
    batch.batch_number.toLowerCase().includes(searchString.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredBatches.slice(startIndex, endIndex);

  const formatQuantity = (quantity: number, unitType: string) => {
    if (
      unitType.toLowerCase() === "kilograms" ||
      (unitType.toLowerCase() === "grams" && quantity > 1000)
    ) {
      const convertedQuantity = quantity / 1000;
      // Format to 2 decimal places if needed, but remove trailing zeros
      const formattedQuantity =
        convertedQuantity % 1 === 0
          ? convertedQuantity.toFixed(0)
          : convertedQuantity.toFixed(2).replace(/\.?0+$/, "");
      return `${formattedQuantity} kilograms`;
    }

    return `${quantity} ${unitType}`;
  };

  if (loading && batches.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading batches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Number</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Total Quantity</TableHead>
              <TableHead>Storage Type</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSelectedImage({
                          url: batch.bar_code_url,
                          title: "Barcode",
                          batchNumber: batch.batch_number,
                        })
                      }
                    >
                      <Barcode className="h-4 w-4 mr-2" />
                      {batch.batch_number}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {batch.products.map((product, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">
                          {product.product_name}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          (
                          {formatQuantity(
                            batch.total_quantity,
                            product.unit_type
                          )}
                          )
                        </span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-bold">
                  {batch.products.length > 0 &&
                    formatQuantity(
                      batch.total_quantity,
                      batch.products[0].unit_type
                    )}
                </TableCell>
                <TableCell>{batch.storage_type}</TableCell>
                <TableCell>{batch.store}</TableCell>
                <TableCell>
                  {format(new Date(batch.expiry_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setSelectedImage({
                          url: batch.qr_code_url,
                          title: "QR Code",
                          batchNumber: batch.batch_number,
                        })
                      }
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="py-4">
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
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
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
      </div>

      {selectedImage && (
        <CodeImageDialog
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          title={selectedImage.title}
          batchNumber={selectedImage.batchNumber}
        />
      )}
    </div>
  );
};

export default BatchesTable;
