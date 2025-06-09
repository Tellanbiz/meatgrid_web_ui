import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Supplier } from "@/store/features/suppliers/supplierTypes";
import {
  deleteSupplier,
  fetchSuppliers,
} from "@/store/features/suppliers/supplierThunks";
import { toast } from "sonner";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import { resetSupplierState } from "@/store/features/suppliers/supplierSlice";
import {
  selectIsDeletingSupplier,
  selectSupplierError,
  selectSuppliers,
  selectSupplierSuccessMessage,
} from "@/store/features/suppliers/supplierSelectors";
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

interface SuppliersTableProps {
  onEdit: (supplier: Supplier) => void;
}

const SuppliersTable = ({ onEdit }: SuppliersTableProps) => {
  const dispatch = useAppDispatch();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const suppliers = useAppSelector(selectSuppliers);
  const isDeletingSupplier = useAppSelector(selectIsDeletingSupplier);
  const supplierError = useAppSelector(selectSupplierError);
  const supplierSuccessMessage = useAppSelector(selectSupplierSuccessMessage);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  useEffect(() => {
    if (supplierSuccessMessage) {
      toast.success(supplierSuccessMessage);
      setDeleteDialogOpen(false);
      dispatch(resetSupplierState());
    }
  }, [supplierSuccessMessage, dispatch]);

  useEffect(() => {
    if (supplierError) {
      toast.error(supplierError);
      dispatch(resetSupplierState());
    }
  }, [supplierError, dispatch]);

  const handleDelete = (rowData: Supplier) => {
    setSupplierToDelete(rowData);
    setTimeout(() => setDeleteDialogOpen(true), 1);
  };

  const handleConfirmDelete = () => {
    if (!supplierToDelete) return;
    dispatch(deleteSupplier(supplierToDelete.id));
  };

  const totalPages = Math.ceil(suppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = suppliers.slice(startIndex, endIndex);

  return (
    <>
      <div className="h-full">
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Building Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.full_name}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone_number}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>{supplier.building_name}</TableCell>
                  <TableCell>
                    {supplier.created_at &&
                      new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(supplier.created_at))}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => onEdit(supplier)}
                          className="flex items-center gap-2"
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleDelete(supplier)}
                          className="flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
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
      </div>

      <DeleteDialog
        isLoading={isDeletingSupplier}
        onConfirm={handleConfirmDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Delete ${supplierToDelete?.full_name}`}
      />
    </>
  );
};

export default SuppliersTable;
