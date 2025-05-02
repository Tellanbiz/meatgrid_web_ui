import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ProgressBar } from "primereact/progressbar";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Supplier } from "../../../store/features/suppliers/supplierTypes";
import { useEffect, useState } from "react";
import {
  deleteSupplier,
  fetchSuppliers,
} from "../../../store/features/suppliers/supplierThunks";
import { toast } from "sonner";
import DeleteDialog from "../../../components/DeleteDialog";
import { DeleteSupplierRequest } from "../../../store/features/suppliers/request/DeleteSupplierRequest";
import { resetSupplierState } from "../../../store/features/suppliers/supplierSlice";
import {
  selectIsDeletingSupplier,
  selectIsFetchingSuppliers,
  selectSupplierError,
  selectSuppliers,
  selectSupplierSuccessMessage,
} from "../../../store/features/suppliers/supplierSelectors";

interface SuppliersTableProps {
  onEdit: (supplier: Supplier) => void;
}

const SuppliersTable = ({ onEdit }: SuppliersTableProps) => {
  const dispatch = useAppDispatch();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(
    null
  );
  const suppliers = useAppSelector(selectSuppliers)
  const isFetchingSuppliers = useAppSelector(selectIsFetchingSuppliers);
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
      setDeleteDialogOpen(false);
      dispatch(resetSupplierState());
    }
  }, [supplierError, dispatch]);

  const handleDelete = (rowData: Supplier) => {
    setSupplierToDelete(rowData);
    setTimeout(() => setDeleteDialogOpen(true), 1);
  };

  const handleConfirmDelete = () => {
    const payload: DeleteSupplierRequest = {
      id: supplierToDelete?.id ?? "",
    };
    dispatch(deleteSupplier(payload));
  };

  const actionsBodyTemplate = (supplier: Supplier) => {
    return (
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
    );
  };
  return (
    <>
      <div className="h-full">
        {isFetchingSuppliers && (
          <ProgressBar
            mode="indeterminate"
            style={{ height: "6px" }}
          ></ProgressBar>
        )}
        <DataTable
          value={suppliers}
          dataKey="id"
          tableStyle={DataTableStyle}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} suppliers"
          scrollable
          scrollHeight="flex"
          size="small"
        >
          <Column
            field="full_name"
            header="Full Name"
            headerStyle={TableHeaderStyle}
          ></Column>
          <Column
            field="email"
            header="Email"
            headerStyle={TableHeaderStyle}
          ></Column>
          <Column
            field="phone_number"
            header="Phone Number"
            headerStyle={TableHeaderStyle}
          ></Column>
          <Column
            field="address"
            header="Address"
            headerStyle={TableHeaderStyle}
          ></Column>
          <Column
            field="building_name"
            header="Building Name"
            headerStyle={TableHeaderStyle}
          ></Column>
          <Column
            header="Created At"
            body={(rowData) => {
              const date = new Date(rowData.created_at);
              return new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(date);
            }}
            headerStyle={TableHeaderStyle}
          />
          <Column
            header="Actions"
            body={actionsBodyTemplate}
            headerStyle={TableHeaderStyle}
          ></Column>
        </DataTable>
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
