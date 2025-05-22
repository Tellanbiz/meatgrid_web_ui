import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectAccounts,
  selectIsFetchingAccounts,
  selectAccountError,
} from "../../store/features/accounts/accountSelectors";
import { fetchAccounts } from "../../store/features/accounts/accountThunks";
import { UserAccount } from "../../store/features/accounts/accountTypes";
import { ProgressBar } from "primereact/progressbar";
import { toast } from "sonner";
import { CheckCircle, RefreshCcw, XCircle } from "lucide-react";
import { DataTableStyle, TableHeaderStyle } from "../../constants/TableStyles";
import { Badge } from "../../components/ui/badge";
import { formatDate } from "../../utils/dateUtils";

const OrganizationsPage = () => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAccounts);
  const isFetchingAccounts = useAppSelector(selectIsFetchingAccounts);
  const accountError = useAppSelector(selectAccountError);

  useEffect(() => {
    dispatch(fetchAccounts({ role: "organization" }));
  }, [dispatch]);

  useEffect(() => {
    if (accountError) {
      toast.error(accountError);
    }
  }, [accountError]);

  const handleRefresh = () => {
    dispatch(fetchAccounts({ role: "organization" }));
  };

  // Name template with verification badge
  const nameBodyTemplate = (rowData: UserAccount) => {
    return (
      <div className="flex items-center gap-2 p-2">
        <span>{rowData.full_name}</span>
        {rowData.verified_org ? (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 hover:bg-green-100"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-600 hover:bg-gray-100"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Unverified
          </Badge>
        )}
      </div>
    );
  };

  const productsBodyTemplate = (rowData: UserAccount) => {
    return (
      <Link
        to={`/organizations/${rowData.id}/products`}
        className="underline text-primary-500 hover:text-primary-700"
      >
        View Products
      </Link>
    );
  };

  const statusBodyTemplate = (rowData: UserAccount) => {
    return (
      <Badge
        className={
          rowData.status === "normal"
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : rowData.status === "suspended"
            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            : "bg-red-100 text-red-800 hover:bg-red-200"
        }
      >
        {rowData.status}
      </Badge>
    );
  };

  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Organizations</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="px-2"
            onClick={handleRefresh}
            disabled={isFetchingAccounts}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetchingAccounts ? "animate-spin" : ""}`}
            />
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      {isFetchingAccounts && (
        <ProgressBar mode="indeterminate" style={{ height: "4px" }} />
      )}

      <div className="card h-table">
        <DataTable
          value={accounts}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          emptyMessage="No organizations found."
          scrollable
          scrollHeight="flex"
          size="small"
          style={DataTableStyle}
        >
          <Column
            field="full_name"
            header="Organization Name"
            body={nameBodyTemplate}
            style={TableHeaderStyle}
          />
          <Column
            field="phone_number"
            header="Phone Number"
            style={TableHeaderStyle}
          />
          <Column field="email" header="Email" style={TableHeaderStyle} />
          <Column
            field="created_at"
            header="Joined On"
            body={(rowData) => formatDate(rowData.created_at)}
            style={TableHeaderStyle}
          />
          <Column
            field="status"
            header="Status"
            body={statusBodyTemplate}
            style={TableHeaderStyle}
          />
          <Column
            header="Products"
            body={productsBodyTemplate}
            style={TableHeaderStyle}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default OrganizationsPage;
