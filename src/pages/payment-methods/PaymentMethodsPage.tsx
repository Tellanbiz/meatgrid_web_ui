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
} from "../../store/features/payment-methods/paymentMethodSelectors";
import { useEffect } from "react";
import { fetchPaymentMethods } from "../../store/features/payment-methods/paymentMethodThunks";
import { DataTableStyle, TableHeaderStyle } from "../../constants/TableStyles";
import { ProgressBar } from "primereact/progressbar";

const PaymentMethodsPage = () => {
  const dispatch = useAppDispatch();
  const paymentMethods = useAppSelector(selectPaymentMethods);

  const isLoadingPaymentMethods = useAppSelector(
    selectIsFetchingPaymentMethods
  );

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchPaymentMethods());
  };

  const actionsBodyTemplate = () => {
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
          <DropdownMenuItem onClick={() => null}>
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

          <Button className="hover:bg-blue-800" onClick={() => null}>
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
            {/* Define your columns here */}
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
    </div>
  );
};
export default PaymentMethodsPage;
