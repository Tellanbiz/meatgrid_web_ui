import {
  EllipsisVertical,
  Pencil,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "primereact/datatable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Column } from "primereact/column";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectIsFetchingPaymentMethods,
  selectPaymentMethods,
  selectPaymentMethodById,
  selectPaymentMethodError,
  selectPaymentMethodSuccessMessage,
} from "../../../store/features/payment-methods/paymentMethodSelectors";
import { useEffect, useState } from "react";
import {
  createPaymentMethod,
  fetchPaymentMethods,
  updatePaymentMethod,
} from "../../../store/features/payment-methods/paymentMethodThunks";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../shared/constants/TableStyles";
import { ProgressBar } from "primereact/progressbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaymentMethodForm, {
  PaymentMethodFormData,
} from "../components/PaymentMethodForm";
import { useModal } from "../../../shared/hooks/use-modal";
import { PaymentMethod } from "../../../store/features/payment-methods/paymentMethodTypes";
import { toast } from "sonner";
import { resetPaymentMethodState } from "../../../store/features/payment-methods/paymentMethodSlice";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PaymentMethodsPage = () => {
  const dispatch = useAppDispatch();
  const paymentMethods = useAppSelector(selectPaymentMethods);
  const isLoadingPaymentMethods = useAppSelector(
    selectIsFetchingPaymentMethods
  );

  const [searchString, setSearchString] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useModal();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const selectedPaymentMethod = useAppSelector(
    selectedPaymentMethodId
      ? selectPaymentMethodById(selectedPaymentMethodId)
      : () => undefined
  );

  // Filter payment methods based on search and status
  const getFilteredPaymentMethods = () => {
    let filtered = paymentMethods.filter(
      (method) =>
        method.name.toLowerCase().includes(searchString.toLowerCase()) ||
        method.tag.toLowerCase().includes(searchString.toLowerCase())
    );

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((method) => {
        if (selectedStatus === "active") return method.active;
        if (selectedStatus === "inactive") return !method.active;
        return true;
      });
    }

    return filtered;
  };

  const filteredPaymentMethods = getFilteredPaymentMethods();

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchPaymentMethods());
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const paymentMethodError = useAppSelector(selectPaymentMethodError);
  const paymentMethodSuccessMessage = useAppSelector(
    selectPaymentMethodSuccessMessage
  );
  useEffect(() => {
    if (paymentMethodError) {
      setIsFormLoading(false);
      toast.error(paymentMethodError);
      dispatch(resetPaymentMethodState());
    }
  }, [paymentMethodError, dispatch]);

  useEffect(() => {
    if (paymentMethodSuccessMessage) {
      toast.success(paymentMethodSuccessMessage);
      dispatch(resetPaymentMethodState());
    }
  }, [paymentMethodSuccessMessage, dispatch]);

  const handleOpenDialog = (
    isEdit: boolean,
    paymentMethodId: string | null = null
  ) => {
    setIsEditMode(isEdit);
    setSelectedPaymentMethodId(paymentMethodId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsFormLoading(false);
    setIsDialogOpen(false);
    setSelectedPaymentMethodId(null);
  };

  const handleSubmit = async (formData: PaymentMethodFormData) => {
    try {
      if (isEditMode && selectedPaymentMethodId) {
        setIsFormLoading(true);
        await dispatch(
          updatePaymentMethod({
            id: selectedPaymentMethodId,
            name: formData.name,
            active: formData.active,
            disable_total: formData.disable_total,
          })
        ).unwrap();
      } else {
        setIsFormLoading(true);
        await dispatch(
          createPaymentMethod({
            name: formData.name,
            active: formData.active,
            disable_total: formData.disable_total,
          })
        ).unwrap();
      }
      setIsFormLoading(false);
      handleCloseDialog();
      dispatch(fetchPaymentMethods());
    } catch (err) {
      console.error("Failed to save payment method:", err);
    }
  };

  const actionsBodyTemplate = (rowData: PaymentMethod) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            aria-label="Actions"
          >
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuItem onClick={() => handleOpenDialog(true, rowData.id)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-4 p-6 bg-white">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search payment methods..."
                value={searchString}
                onChange={handleSearchChange}
                className="pl-9 h-10 border-gray-200 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>

            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40 h-10 border-gray-200 bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoadingPaymentMethods}
              size="sm"
              className="px-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isLoadingPaymentMethods ? "animate-spin" : ""
                }`}
              />
              <span className="ml-2">Refresh</span>
            </Button>

            <Button onClick={() => handleOpenDialog(false)} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              <span>Add Payment Method</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="h-table rounded-md border border-gray-200 overflow-hidden bg-white">
        {isLoadingPaymentMethods && (
          <ProgressBar mode="indeterminate" style={{ height: "4px" }} />
        )}

        <DataTable
          value={filteredPaymentMethods}
          dataKey="id"
          paginator
          rows={25}
          rowsPerPageOptions={[10, 25, 50]}
          emptyMessage="No payment methods found."
          loadingIcon="pi pi-spin pi-spinner"
          scrollable
          scrollHeight="flex"
          size="small"
          tableStyle={DataTableStyle}
          className="bg-white"
        >
          <Column
            field="name"
            header="Name"
            headerStyle={TableHeaderStyle}
            body={(rowData) => (
              <span className="font-bold">{rowData.name}</span>
            )}
            style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
          />
          <Column
            field="tag"
            header="Tag"
            headerStyle={TableHeaderStyle}
            style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
          />
          <Column
            field="active"
            header="Active"
            headerStyle={TableHeaderStyle}
            style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
          />
          <Column
            field="disable_total"
            header="Disable Total"
            headerStyle={TableHeaderStyle}
            body={(rowData) => (
              <span
                className={
                  rowData.disable_total ? "text-green-600" : "text-red-600"
                }
              >
                {rowData.disable_total ? "Enabled" : "Disabled"}
              </span>
            )}
            style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
          />
          <Column
            header="Created At"
            body={(rowData) => {
              return new Date(rowData.created_at).toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });
            }}
            headerStyle={TableHeaderStyle}
            style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
          />
          <Column
            header="Actions"
            headerStyle={TableHeaderStyle}
            body={actionsBodyTemplate}
            style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
          />
        </DataTable>
      </div>

      {/* Dialog for Create/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Payment Method" : "Add Payment Method"}
            </DialogTitle>
          </DialogHeader>
          <PaymentMethodForm
            initialValues={
              isEditMode && selectedPaymentMethod
                ? {
                    name: selectedPaymentMethod.name,
                    tag: selectedPaymentMethod.tag,
                    active: selectedPaymentMethod.active,
                    disable_total: selectedPaymentMethod.disable_total,
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
            isEditMode={isEditMode}
            isLoading={isFormLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentMethodsPage;
