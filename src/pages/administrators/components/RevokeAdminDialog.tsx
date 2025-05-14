import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectIsUpdatingUserRole,
} from "../../../store/features/accounts/accountSelectors";
import { updateUserRole } from "../../../store/features/accounts/accountThunks";
import { AdminAccount } from "../../../store/features/accounts/accountTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Loader2 } from "lucide-react";

interface RevokeAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: AdminAccount | null;
  onSuccess?: () => void;
}

const RevokeAdminDialog = ({
  open,
  onOpenChange,
  admin,
  onSuccess,
}: RevokeAdminDialogProps) => {
  const dispatch = useAppDispatch();
  const isUpdating = useAppSelector(selectIsUpdatingUserRole);

  const handleRevoke = async () => {
    if (!admin) return;

    try {
      await dispatch(
        updateUserRole({
          id: admin.id,
          role: "indivual",
        })
      ).unwrap();
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error handling is done through the global state
      console.error("Failed to revoke admin privileges:", error);
    }
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
          <DialogTitle>Revoke Administrator Access</DialogTitle>
          <DialogDescription>
            {admin && 
              `Are you sure you want to revoke administrator access from ${admin.full_name}? This action will change their role to Individual.`
            }
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRevoke}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Revoking...
              </>
            ) : (
              "Revoke Access"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RevokeAdminDialog;
