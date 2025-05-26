import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  UserAccount,
  UserRole,
} from "../../../store/features/accounts/accountTypes";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectIsUpdatingUserRole,
  selectAccountError,
  selectAccountSuccessMessage,
} from "../../../store/features/accounts/accountSelectors";
import { updateUserRole } from "../../../store/features/accounts/accountThunks";
import { clearAccountMessages } from "../../../store/features/accounts/accountSlice";

interface UpdateUserRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: UserAccount | null;
  onUpdateSuccess?: () => void;
}

const UpdateUserRoleDialog = ({
  open,
  onOpenChange,
  onUpdateSuccess,
  account,
}: UpdateUserRoleDialogProps) => {
  const dispatch = useAppDispatch();
  const isUpdating = useAppSelector(selectIsUpdatingUserRole);
  const error = useAppSelector(selectAccountError);
  const successMessage = useAppSelector(selectAccountSuccessMessage);

  const [selectedRole, setSelectedRole] = useState<UserRole>(
    account?.role || "indivual"
  );

  useEffect(() => {
    if (account) {
      setSelectedRole(account.role);
    }
  }, [account]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAccountMessages());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearAccountMessages());
      onOpenChange(false);
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    }
  }, [successMessage, dispatch, onOpenChange, onUpdateSuccess]);

  const handleUpdateRole = async () => {
    if (!account) return;

    dispatch(
      updateUserRole({
        id: account.id,
        role: selectedRole,
      })
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isUpdating) {
          onOpenChange(isOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update User Role</DialogTitle>
          <DialogDescription>
            {account
              ? `Change the role for ${account.full_name}`
              : "Select a new role for this user"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indivual">Individual</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                  <SelectItem value="adminstrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Role Permissions
              </Label>
              <div className="bg-muted p-3 rounded-md">
                {selectedRole === "indivual" && (
                  <p className="text-sm">
                    Basic access to place orders and view order history.
                  </p>
                )}
                {selectedRole === "organization" && (
                  <p className="text-sm">
                    Can manage multiple accounts and view organization-level
                    data.
                  </p>
                )}
                {selectedRole === "staff" && (
                  <p className="text-sm">
                    Access to manage orders, products, and customer accounts.
                  </p>
                )}
                {selectedRole === "adminstrator" && (
                  <p className="text-sm">
                    Full access to all system features except user management.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateRole}
            disabled={isUpdating || selectedRole === account?.role}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Role"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserRoleDialog;
