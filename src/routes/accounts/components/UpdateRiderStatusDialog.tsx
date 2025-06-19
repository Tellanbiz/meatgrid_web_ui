import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserAccount } from "../domain/models";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { verifyRider } from "@/store/features/riders/riderThunks";
import { selectIsVerifyingRider } from "@/store/features/riders/riderSelectors";
import { toast } from "sonner";

interface UpdateRiderStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: UserAccount | null;
  onUpdateSuccess: () => void;
}

export default function UpdateRiderStatusDialog({
  open,
  onOpenChange,
  account,
  onUpdateSuccess,
}: UpdateRiderStatusDialogProps) {
  const dispatch = useAppDispatch();
  const isVerifying = useAppSelector(selectIsVerifyingRider);

  const handleVerify = async () => {
    if (!account) return;

    try {
      await dispatch(
        verifyRider({
          user_id: account.id,
        })
      ).unwrap();

      toast.success("Rider verification status updated successfully");
      onOpenChange(false);
      onUpdateSuccess();
    } catch (error: unknown) {
      console.error("Error updating rider status:", error);
      toast.error("Failed to update rider verification status");
    }
  };

  // Determine the action text based on current verification status
  const actionText = account?.verified_org ? "unverify" : "verify";
  const actionTitle = account?.verified_org ? "Unverify Rider" : "Verify Rider";
  const actionDescription = account?.verified_org
    ? "Are you sure you want to revoke verification status for this rider?"
    : "Are you sure you want to verify this rider?";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{actionTitle}</DialogTitle>
          <DialogDescription>{actionDescription}</DialogDescription>
        </DialogHeader>

        {account && (
          <div className="flex items-center space-x-3 py-4">
            <div className="flex-shrink-0 h-10 w-10">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                {account.full_name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">{account.full_name}</p>
              <p className="text-xs text-muted-foreground">
                Status: {account.verified_org ? "Verified" : "Unverified"}
              </p>
              <p className="text-xs text-muted-foreground">
                Phone: {account.phone_number}
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isVerifying}
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={isVerifying}
            variant={account?.verified_org ? "destructive" : "default"}
          >
            {isVerifying
              ? "Updating..."
              : ` ${
                  actionText.charAt(0).toUpperCase() + actionText.slice(1)
                } Rider`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
