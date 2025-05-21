import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectAccounts,
  selectIsFetchingAccounts,
  selectAccountError,
} from "../../store/features/accounts/accountSelectors";
import { fetchAccounts } from "../../store/features/accounts/accountThunks";
import {
  UserAccount,
  UserRole,
} from "../../store/features/accounts/accountTypes";
import { ProgressBar } from "primereact/progressbar";
import { toast } from "sonner";
import { CheckCircle, MoreVertical, RefreshCcw, XCircle } from "lucide-react";
import { DataTableStyle, TableHeaderStyle } from "../../constants/TableStyles";
import { Badge } from "../../components/ui/badge";
import { formatDate } from "../../utils/dateUtils";
import UpdateUserRoleDialog from "./components/UpdateUserRoleDialog";
import { useModal } from "../../hooks/use-modal";
import UpdateStaffPermissionsDialog from "./components/UpdateStaffPermissionsDialog";
import { selectStores } from "../../store/features/stores/storeSelectors";
import { fetchStores } from "../../store/features/stores/storeThunks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const AccountsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAccounts);
  const stores = useAppSelector(selectStores);
  const isFetchingAccounts = useAppSelector(selectIsFetchingAccounts);
  const accountError = useAppSelector(selectAccountError);

  const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(
    null
  );

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useModal();
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useModal();

  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");

  useEffect(() => {
    dispatch(
      fetchAccounts(selectedRole !== "all" ? { role: selectedRole } : undefined)
    );
    dispatch(fetchStores());
  }, [dispatch, selectedRole]);

  useEffect(() => {
    if (accountError) {
      toast.error(accountError);
    }
  }, [accountError]);

  const handleRefresh = () => {
    dispatch(
      fetchAccounts(selectedRole !== "all" ? { role: selectedRole } : undefined)
    );
  };

  const actionsBodyTemplate = (rowData: UserAccount) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuItem onClick={() => handleUpdateRole(rowData)}>
            Update Role
          </DropdownMenuItem>

          {rowData.role !== "indivual" && (
            <DropdownMenuItem onClick={() => handleUpdateStaffStatus(rowData)}>
              Update Staff Permissions
            </DropdownMenuItem>
          )}

          {rowData.role === "organization" && (
            <>
              <DropdownMenuItem
                onClick={() => handleUpdateRiderStatus(rowData)}
              >
                Update Rider Status
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/organizations/${rowData.id}/products`)
                }
              >
                Organization Products
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const handleUpdateRole = (account: UserAccount) => {
    setSelectedAccount(account);
    setIsRoleDialogOpen(true);
  };

  const handleUpdateSuccess = () => {
    dispatch(fetchAccounts());
  };

  const handleUpdateStaffStatus = (account: UserAccount) => {
    setSelectedAccount(account);
    setIsStaffDialogOpen(true);
  };

  const handleUpdateRiderStatus = (account: UserAccount) => {
    setSelectedAccount(account);
  };

  // Updated name template with verification badge
  const nameBodyTemplate = (rowData: UserAccount) => {
    return (
      <div className="flex items-center gap-2">
        <span>{rowData.full_name}</span>
        {rowData.role == "organization" &&
          (rowData.verified_org ? (
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
          ))}
      </div>
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
    <div className="h-full p-6 ">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Accounts</h1>
        <div className="flex items-center gap-2">
          <Select
            value={selectedRole}
            onValueChange={(value) =>
              setSelectedRole(value as UserRole | "all")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="organization">Organization</SelectItem>
              <SelectItem value="administrator">Administrator</SelectItem>
              <SelectItem value="super-administrator">
                Super Administrator
              </SelectItem>
            </SelectContent>
          </Select>
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

      <div className="card h-table">
        {isFetchingAccounts && (
          <ProgressBar mode="indeterminate" style={{ height: "6px" }} />
        )}

        {!isFetchingAccounts && (
          <DataTable
            value={accounts}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            emptyMessage="No accounts found."
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
            <Column field="email" header="Email" style={TableHeaderStyle} />
            <Column field="role" header="Role" style={TableHeaderStyle} />
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
              header="Actions"
              body={actionsBodyTemplate}
              style={TableHeaderStyle}
            />
          </DataTable>
        )}
      </div>

      <UpdateUserRoleDialog
        open={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        account={selectedAccount}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <UpdateStaffPermissionsDialog
        open={isStaffDialogOpen}
        onOpenChange={setIsStaffDialogOpen}
        account={selectedAccount}
        stores={stores}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default AccountsPage;
