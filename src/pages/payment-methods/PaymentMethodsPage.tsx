import { EllipsisVertical, Pencil, Plus, RefreshCcw } from "lucide-react";
import Breadcrumbs from "../../components/breadcrumbs";
import { Button } from "../../components/ui/button";
import { DataTable } from "primereact/datatable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Column } from "primereact/column";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectIsFetchingPaymentMethods,
  selectPaymentMethods,
  selectPaymentMethodById,
  selectPaymentMethodError,
  selectPaymentMethodSuccessMessage,
} from "../../store/features/payment-methods/paymentMethodSelectors";
import { useEffect, useState } from "react";
import {
  createPaymentMethod,
  fetchPaymentMethods,
  updatePaymentMethod,
} from "../../store/features/payment-methods/paymentMethodThunks";
import { DataTableStyle, TableHeaderStyle } from "../../constants/TableStyles";
import { ProgressBar } from "primereact/progressbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import PaymentMethodForm, {
  PaymentMethodFormData,
} from "./components/PaymentMethodForm";
import { useModal } from "../../hooks/use-modal";
import { PaymentMethod } from "../../store/features/payment-methods/paymentMethodTypes";
import { toast } from "sonner";
import { resetPaymentMethodState } from "../../store/features/payment-methods/paymentMethodSlice";

const PaymentMethodsPage = () => {
  const dispatch = useAppDispatch();
  const paymentMethods = useAppSelector(selectPaymentMethods);
  const isLoadingPaymentMethods = useAppSelector(
    selectIsFetchingPaymentMethods
  );

  const { isOpen: isDialogOpen, openModal, closeModal } = useModal();
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

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchPaymentMethods());
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
    openModal();
  };

  const handleCloseDialog = () => {
    setIsFormLoading(false);
    closeModal();
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
          })
        ).unwrap();
      } else {
        setIsFormLoading(true);
        await dispatch(
          createPaymentMethod({
            name: formData.name,
            active: formData.active,
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
    <div className="h-full overflow-hidden">
      <div className="flex justify-between items-center">
        <Breadcrumbs
          items={[
            {
              label: "Payment Methods",
              isPage: true,
            },
          ]}
        />

        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="hover:bg-gray-200"
            onClick={handleRefresh}
            disabled={isLoadingPaymentMethods}
            aria-label="Refresh"
          >
            <RefreshCcw
              className={`size-4 ${
                isLoadingPaymentMethods ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>

          <Button
            className="hover:bg-blue-800"
            onClick={() => handleOpenDialog(false)}
          >
            <Plus className="size-4" />
            Add Payment Method
          </Button>
        </div>
      </div>
      <div className="mt-4 card h-11/12">
        {isLoadingPaymentMethods && (
          <ProgressBar mode="indeterminate" style={{ height: "6px" }} />
        )}

        {!isLoadingPaymentMethods && (
          <DataTable
            value={paymentMethods}
            loading={isLoadingPaymentMethods}
            className="h-full"
            dataKey="id"
            paginator
            rows={20}
            rowsPerPageOptions={[10, 25, 50]}
            emptyMessage="No payment methods found."
            loadingIcon="pi pi-spin pi-spinner"
            stripedRows
            rowHover
            scrollable
            scrollHeight="flex"
            paginatorPosition="bottom"
            size="small"
            tableStyle={DataTableStyle}
          >
            <Column field="name" header="Name" headerStyle={TableHeaderStyle} />
            <Column field="tag" header="Tag" headerStyle={TableHeaderStyle} />
            <Column
              field="active"
              header="Active"
              headerStyle={TableHeaderStyle}
            />
            <Column
              field="created_at"
              header="Created At"
              headerStyle={TableHeaderStyle}
            />
            <Column
              header="Actions"
              headerStyle={TableHeaderStyle}
              body={actionsBodyTemplate}
            />
          </DataTable>
        )}
      </div>

      {/* Dialog for Create/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={closeModal}>
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
