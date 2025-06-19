import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { MoreVertical, RefreshCcw, Search } from "lucide-react";
import { useAccounts } from "../hooks/useAccounts";
import { AdminAccount } from "../domain/models";
import { formatDate } from "@/utils/dateUtils";
import { UpdateAdministratorPermissionsDialog } from "../components/UpdateAdministratorPermissionsDialog";

export default function AdministratorsPage() {
  const { adminAccounts, loading, errors, fetchAdminAccounts, clearMessages } =
    useAccounts();

  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAdminAccounts();
  }, [fetchAdminAccounts]);

  useEffect(() => {
    if (errors.adminAccounts) {
      // Error is already shown via toast in the hook
      clearMessages();
    }
  }, [errors.adminAccounts, clearMessages]);

  const handleRefresh = () => {
    fetchAdminAccounts();
  };

  const handleUpdatePermissions = (admin: AdminAccount) => {
    setSelectedAdmin(admin);
    setIsPermissionsDialogOpen(true);
  };

  const handleUpdateSuccess = () => {
    fetchAdminAccounts();
  };

  // Filter administrators based on search query
  const filteredAdmins = adminAccounts.filter(
    (admin) =>
      admin.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.phone_number.includes(searchQuery)
  );

  const renderStatus = (admin: AdminAccount) => {
    return (
      <Badge
        className={
          admin.status === "normal"
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : admin.status === "suspended"
            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            : "bg-red-100 text-red-800 hover:bg-red-200"
        }
      >
        {admin.status}
      </Badge>
    );
  };

  const renderActions = (admin: AdminAccount) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuItem onClick={() => handleUpdatePermissions(admin)}>
            Update Permissions
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="p-8 font-lato">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Administrators</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading.adminAccounts}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search administrators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading.adminAccounts && (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-400">Loading administrators...</p>
        </div>
      )}

      {!loading.adminAccounts && filteredAdmins.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">
            {searchQuery
              ? "No administrators found matching your search."
              : "No administrators found."}
          </p>
        </div>
      )}

      {!loading.adminAccounts && filteredAdmins.length > 0 && (
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.full_name}</TableCell>
                  <TableCell>{admin.email || "N/A"}</TableCell>
                  <TableCell>{admin.phone_number}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {admin.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{renderStatus(admin)}</TableCell>
                  <TableCell>{formatDate(admin.created_at)}</TableCell>
                  <TableCell>{renderActions(admin)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialogs */}
      <UpdateAdministratorPermissionsDialog
        open={isPermissionsDialogOpen}
        onOpenChange={setIsPermissionsDialogOpen}
        admin={selectedAdmin}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
