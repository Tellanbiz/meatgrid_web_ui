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

const SuppliersTable = () => {
  const dispatch = useAppDispatch();
  const { suppliers, status, error, currentOperation } = useAppSelector(
    (state) => state.suppliers
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  useEffect(() => {
    if (
      (status == "succeeded" || status == "failed") &&
      currentOperation == "delete"
    ) {
      toast.success("Supplier deleted successfully");
      setDeleteDialogOpen(false);
      dispatch(resetSupplierState());
    }
  }, [status, error, currentOperation, dispatch]);

  const actionsBodyTemplate = (rowData: Supplier) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => handleEdit(rowData)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleDelete(rowData)}
            className="flex items-center gap-2 text-red-600"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const handleEdit = (rowData: Supplier) => {
    // Logic for editing product
  };

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

  return (
    <>
      <div className="card bg-background">
        {status === "loading" && currentOperation == "fetch" && (
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
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          scrollable
          scrollHeight="500px"
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
        isLoading={status == "loading" && currentOperation == "delete"}
        onConfirm={handleConfirmDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Delete ${supplierToDelete?.full_name}`}
      />
    </>
  );
};

export default SuppliersTable;
