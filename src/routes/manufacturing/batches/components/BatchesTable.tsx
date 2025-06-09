import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBatches } from "@/store/features/batches/batchThunks";
import { toast } from "sonner";
import { format } from "date-fns";
import { QrCode, Barcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { selectBatches } from "@/store/features/batches/batchSelectors";
import { AvatarStack } from "@/components/common/avatar-stack";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

interface BatchesTableProps {
  searchString: string;
}

const BatchesTable: React.FC<BatchesTableProps> = ({ searchString }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.batches);
  const batches = useAppSelector(selectBatches);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    batchNumber: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    dispatch(fetchBatches());
  }, [dispatch]);

  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(error);
    }
  }, [status, error]);

  const filteredBatches = batches.filter((batch) =>
    batch.batch_number.toLowerCase().includes(searchString.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredBatches.slice(startIndex, endIndex);

  return (
    <div className="h-full">
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Number</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Storage Type</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Suppliers</TableHead>
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
                <TableCell className="font-bold">{batch.product}</TableCell>
                <TableCell>{batch.storage_type}</TableCell>
                <TableCell>{batch.store}</TableCell>
                <TableCell>
                  {format(new Date(batch.expiry_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center cursor-help">
                          <AvatarStack items={batch.suppliers} limit={3} />
                          <span className="ml-3 text-sm text-muted-foreground">
                            {batch.suppliers.length} supplier
                            {batch.suppliers.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px]">
                        <div className="space-y-1">
                          <p className="font-semibold text-sm">Suppliers</p>
                          <ul className="text-sm list-disc pl-4">
                            {batch.suppliers.map((supplier, index) => (
                              <li key={index}>{supplier}</li>
                            ))}
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
          isOpen={true}
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
