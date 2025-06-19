import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, RefreshCcw, Search, Plus } from "lucide-react";
import { useAccounts } from "../hooks/useAccounts";
import { UserAccount, UserRole, FetchAccountsRequest } from "../domain/models";
import { formatDate } from "@/utils/dateUtils";
import { UpdateUserRoleDialog } from "../components/UpdateUserRoleDialog";
import UpdateStaffPermissionsDialog from "@/pages/accounts/components/UpdateStaffPermissionsDialog";
import CreateAccountDialog from "../components/CreateAccountDialog";
import UpdateRiderStatusDialog from "../components/UpdateRiderStatusDialog";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectStores } from "@/store/features/stores/storeSelectors";
import { fetchStores } from "@/store/features/stores/storeThunks";

export default function AccountsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { accounts, loading, errors, fetchAccounts, clearMessages } =
    useAccounts();
  const stores = useAppSelector(selectStores);

  const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(
    null
  );
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRiderDialogOpen, setIsRiderDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch accounts with all parameters
  useEffect(() => {
    const params: FetchAccountsRequest = {};

    if (selectedRole !== "all") {
      params.role = selectedRole;
    }

    if (selectedStatus !== "all") {
      params.status = selectedStatus;
    }

    if (debouncedSearchQuery.trim()) {
      params.full_name = debouncedSearchQuery.trim();
    }

    fetchAccounts(Object.keys(params).length > 0 ? params : undefined);
    dispatch(fetchStores());
  }, [
    fetchAccounts,
    selectedRole,
    selectedStatus,
    debouncedSearchQuery,
    dispatch,
  ]);

  useEffect(() => {
    if (errors.accounts) {
      // Error is already shown via toast in the hook
      clearMessages();
    }
  }, [errors.accounts, clearMessages]);

  const handleRefresh = () => {
    const params: FetchAccountsRequest = {};

    if (selectedRole !== "all") {
      params.role = selectedRole;
    }

    if (selectedStatus !== "all") {
      params.status = selectedStatus;
    }

    if (debouncedSearchQuery.trim()) {
      params.full_name = debouncedSearchQuery.trim();
    }

    fetchAccounts(Object.keys(params).length > 0 ? params : undefined);
  };

  const handleCreateAccount = () => {
    // Navigate to create account page or open create dialog
    setIsCreateDialogOpen(true);
  };

  const handleUpdateRole = (account: UserAccount) => {
    setSelectedAccount(account);
    setIsRoleDialogOpen(true);
  };

  const handleUpdateSuccess = () => {
    window.location.reload();
  };

  const handleUpdateStaffStatus = (account: UserAccount) => {
    setSelectedAccount(account);
    setIsStaffDialogOpen(true);
  };

  const handleUpdateRiderStatus = (account: UserAccount) => {
    setSelectedAccount(account);
    setIsRiderDialogOpen(true);
  };

  // Pagination calculations
  const totalPages = Math.ceil(accounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAccounts = accounts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderStatus = (account: UserAccount) => {
    return (
      <Badge
        className={
          account.status === "normal"
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : account.status === "suspended"
            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            : "bg-red-100 text-red-800 hover:bg-red-200"
        }
      >
        {account.status}
      </Badge>
    );
  };

  const renderActions = (account: UserAccount) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuItem onClick={() => handleUpdateRole(account)}>
            Update Role
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleUpdateStaffStatus(account)}>
            Update Staff Permissions
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleUpdateRiderStatus(account)}>
            Update Rider Status
          </DropdownMenuItem>
          {account.role === "organization" && (
            <>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/organizations/${account.id}/products`)
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

  return (
    <div className="space-y-6 p-6">
      {/* Header with search and filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="relative w-full lg:w-[350px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search accounts by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
          <Select
            value={selectedRole}
            onValueChange={(value) =>
              setSelectedRole(value as UserRole | "all")
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="indivual">Individual</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="organization">Organization</SelectItem>
              <SelectItem value="adminstrator">Administrator</SelectItem>
              <SelectItem value="super-adminstrator">
                Super Administrator
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="ban">Banned</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading.accounts}
            className="w-full sm:w-auto"
          >
            <RefreshCcw
              className={`h-4 w-4 ${loading.accounts ? "animate-spin" : ""}`}
            />
            <span className="ml-2">Refresh</span>
          </Button>
          <Button onClick={handleCreateAccount} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Account
          </Button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading.accounts && (
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-pulse"></div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {!loading.accounts && accounts.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">
              {searchQuery || selectedRole !== "all" || selectedStatus !== "all"
                ? "No accounts found matching your filters."
                : "No accounts found."}
            </p>
          </div>
        )}

        {!loading.accounts && accounts.length > 0 && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <span className="font-semibold">
                          {account.full_name}
                        </span>
                      </TableCell>
                      <TableCell>{account.phone_number}</TableCell>
                      <TableCell>{account.email || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {account.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(account.created_at)}</TableCell>
                      <TableCell>{renderStatus(account)}</TableCell>
                      <TableCell>{renderActions(account)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, accounts.length)} of {accounts.length}{" "}
                  results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <UpdateUserRoleDialog
        open={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        account={selectedAccount}
        onSuccess={handleUpdateSuccess}
      />

      <UpdateStaffPermissionsDialog
        open={isStaffDialogOpen}
        onOpenChange={setIsStaffDialogOpen}
        account={selectedAccount}
        stores={stores}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <CreateAccountDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleRefresh}
      />

      <UpdateRiderStatusDialog
        open={isRiderDialogOpen}
        onOpenChange={setIsRiderDialogOpen}
        account={selectedAccount}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
