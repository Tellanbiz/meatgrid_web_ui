/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectIsUpdatingStaffPermissions,
  selectStaffError,
  selectStaffSuccessMessage,
  selectCurrentStaff,
  selectIsFetchingStaffInfo,
} from "../../../store/features/staff/staffSelectors";
import {
  updateStaffPermissions,
  fetchStaff,
} from "../../../store/features/staff/staffThunks";
import { clearStaffMessages } from "../../../store/features/staff/staffSlice";
import { Loader2, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resetStaffCode, deleteStaff } from "../domain/staff-api";

interface Store {
  id: string;
  name: string;
}

interface StaffMinimal {
  id: string;
  full_name?: string;
}

interface UpdateStaffPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: StaffMinimal | null;
  stores: Store[];
  onUpdateSuccess?: () => void;
}

const UpdateStaffPermissionsDialog = ({
  open,
  onOpenChange,
  account,
  stores,
  onUpdateSuccess,
}: UpdateStaffPermissionsDialogProps) => {
  const dispatch = useAppDispatch();
  const isUpdating = useAppSelector(selectIsUpdatingStaffPermissions);
  const isFetchingStaffInfo = useAppSelector(selectIsFetchingStaffInfo);
  const error = useAppSelector(selectStaffError);
  const successMessage = useAppSelector(selectStaffSuccessMessage);
  const currentStaff = useAppSelector(selectCurrentStaff);

  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [canClaim, setCanClaim] = useState<boolean>(false);
  const [canDispatch, setCanDispatch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Fetch staff info when dialog opens with a user
  useEffect(() => {
    if (open && account) {
      setIsLoading(true);
      dispatch(fetchStaff({ user_id: account.id }))
        .unwrap()
        .catch(() => {
          setSelectedStoreId("");
          setCanClaim(false);
          setCanDispatch(false);
          setIsLoading(false);
        });
    }
  }, [open, account, dispatch]);

  useEffect(() => {
    if (currentStaff) {
      setSelectedStoreId(currentStaff.store.id);
      setCanClaim(currentStaff.can_claim);
      setCanDispatch(currentStaff.can_dispatch);
      setIsLoading(false);
    }
  }, [currentStaff]);

  useEffect(() => {
    if (error) {
      if (!error.includes("not found")) {
        toast.error(error);
      }
      dispatch(clearStaffMessages());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearStaffMessages());
      onOpenChange(false);

      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    }
  }, [successMessage, dispatch, onOpenChange, onUpdateSuccess]);

  const handleUpdatePermissions = () => {
    if (!account) return;

    if (!selectedStoreId) {
      toast.error("Please select a store");
      return;
    }

    dispatch(
      updateStaffPermissions({
        user_id: account.id,
        store_id: selectedStoreId,
        can_claim: canClaim,
        can_dispatch: canDispatch,
      })
    );
  };

  const handleDeleteStaff = async () => {
    if (!account) return;

    if (!confirm(`Are you sure you want to delete ${account.full_name}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const error = await deleteStaff(account.id);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Staff deleted successfully");
        onOpenChange(false);
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      }
    } catch (err) {
      toast.error("Failed to delete staff");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetStaffCode = async () => {
    if (!account || !selectedStoreId) return;

    if (!confirm(`Are you sure you want to reset the code for ${account.full_name}?`)) {
      return;
    }

    setIsResetting(true);
    try {
      const error = await resetStaffCode(account.id, selectedStoreId);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Staff code reset successfully");
      }
    } catch (err) {
      toast.error("Failed to reset staff code");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isUpdating && !isDeleting && !isResetting) {
          onOpenChange(isOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Staff Permissions</DialogTitle>
          <DialogDescription>
            {account
              ? `Set permissions for ${account.full_name}`
              : "Set staff permissions for this user"}
          </DialogDescription>
        </DialogHeader>

        {isLoading || isFetchingStaffInfo ? (
          <div className="py-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading staff information...</span>
          </div>
        ) : (
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store">Select Store</Label>
                <Select
                  value={selectedStoreId}
                  onValueChange={setSelectedStoreId}
                  disabled={isUpdating || isDeleting || isResetting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="can_claim"
                      checked={canClaim}
                      onCheckedChange={(checked) =>
                        setCanClaim(checked === true)
                      }
                      disabled={isUpdating || isDeleting || isResetting}
                    />
                    <Label htmlFor="can_claim" className="text-sm">
                      Can claim orders
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="can_dispatch"
                      checked={canDispatch}
                      onCheckedChange={(checked) =>
                        setCanDispatch(checked === true)
                      }
                      disabled={isUpdating || isDeleting || isResetting}
                    />
                    <Label htmlFor="can_dispatch" className="text-sm">
                      Can dispatch orders
                    </Label>
                  </div>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="space-y-2 pt-4 border-t">
                <Label className="text-sm">Additional Actions</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetStaffCode}
                    disabled={isUpdating || isDeleting || isResetting || !selectedStoreId}
                    className="flex-1"
                  >
                    {isResetting ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Reset Code
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteStaff}
                    disabled={isUpdating || isDeleting || isResetting}
                    className="flex-1"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete Staff
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating || isFetchingStaffInfo || isDeleting || isResetting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdatePermissions}
            disabled={isUpdating || isFetchingStaffInfo || !selectedStoreId || isDeleting || isResetting}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Permissions"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStaffPermissionsDialog;
