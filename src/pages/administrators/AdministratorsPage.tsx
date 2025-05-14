import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import RevokeAdminDialog from "./components/RevokeAdminDialog";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectAdminAccounts,
  selectIsFetchingAdminAccounts,
  selectAdminAccountsError,
  selectAccountError,
  selectAccountSuccessMessage,
} from "../../store/features/accounts/accountSelectors";
import { fetchAdminAccounts } from "../../store/features/accounts/accountThunks";
import { AdminAccount } from "../../store/features/accounts/accountTypes";
import { ProgressBar } from "primereact/progressbar";
import { toast } from "sonner";
import { MoreVertical, RefreshCcw, Shield, UserMinus2 } from "lucide-react";
import { DataTableStyle, TableHeaderStyle } from "../../constants/TableStyles";
import { Badge } from "../../components/ui/badge";
import { formatDate } from "../../utils/dateUtils";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../hooks/use-modal";
import { clearAccountMessages } from "../../store/features/accounts/accountSlice";

const AdministratorsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const admins = useAppSelector(selectAdminAccounts);
  const isLoading = useAppSelector(selectIsFetchingAdminAccounts);
  const error = useAppSelector(selectAdminAccountsError);
  const accountError = useAppSelector(selectAccountError);
  const accountSuccessMessage = useAppSelector(selectAccountSuccessMessage);

  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useModal();
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);

  useEffect(() => {
    dispatch(fetchAdminAccounts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAccountMessages());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (accountError) {
      toast.error(accountError);
    }
  }, [accountError]);

  useEffect(() => {
    if (accountSuccessMessage) {
      toast.success(accountSuccessMessage);
      dispatch(clearAccountMessages());
    }
  }, [accountSuccessMessage, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAdminAccounts());
  };

  const handleRevokeSuccess = () => {
    setIsRevokeDialogOpen(false);
    dispatch(fetchAdminAccounts());
  };

  const actionsBodyTemplate = (rowData: AdminAccount) => {
    const handleRevokeAdmin = () => {
      setSelectedAdmin(rowData);
      setIsRevokeDialogOpen(true);
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuItem
            onClick={() =>
              navigate(`/administrators/${rowData.id}/permissions`)
            }
          >
            <Shield className="lucide lucide-shield w-4 h-4 mr-2" />
            Update Permissions
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={handleRevokeAdmin}
          >
            <UserMinus2 className="lucide lucide-user-minus w-4 h-4 mr-2 text-red-600" />
            Revoke Administrator
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const nameBodyTemplate = (rowData: AdminAccount) => (
    <span className="font-semibold">{rowData.full_name}</span>
  );

  const statusBodyTemplate = (rowData: AdminAccount) => (
    <Badge
      className={
        rowData.status === "normal"
          ? "bg-green-100 text-green-800 hover:bg-green-200"
          : rowData.status === "suspended"
          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          : "bg-red-100 text-red-800 hover:bg-red-200"
      }
    >
      {rowData.status.charAt(0).toUpperCase() + rowData.status.slice(1)}
    </Badge>
  );

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Administrators</h1>
        <Button
          variant="outline"
          size="sm"
          className="px-2"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCcw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          <span className="ml-2">Refresh</span>
        </Button>
      </div>
      <div className="card h-table">
        {isLoading && (
          <ProgressBar mode="indeterminate" style={{ height: "6px" }} />
        )}
        {!isLoading && (
          <DataTable
            value={admins}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            emptyMessage="No administrators found."
            scrollable
            scrollHeight="flex"
            size="small"
            style={DataTableStyle}
          >
            <Column
              field="full_name"
              header="Full Name"
              body={nameBodyTemplate}
              style={TableHeaderStyle}
            />
            <Column
              field="phone_number"
              header="Phone Number"
              style={TableHeaderStyle}
            />
            <Column
              field="email"
              header="Email"
              body={(rowData) => rowData.email || "No Email Provided"}
              style={TableHeaderStyle}
            />
            <Column field="role" header="Role" style={TableHeaderStyle} />
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              style={TableHeaderStyle}
            />
            <Column
              field="created_at"
              header="Created At"
              body={(rowData) => formatDate(rowData.created_at)}
              style={TableHeaderStyle}
            />
            <Column
              header="Actions"
              body={actionsBodyTemplate}
              style={TableHeaderStyle}
            />
          </DataTable>
        )}
      </div>

      {/* Revoke Administrator Access Confirmation Dialog */}
      <RevokeAdminDialog
        open={isRevokeDialogOpen}
        onOpenChange={setIsRevokeDialogOpen}
        admin={selectedAdmin}
        onSuccess={handleRevokeSuccess}
      />
    </div>
  );
};

export default AdministratorsPage;
