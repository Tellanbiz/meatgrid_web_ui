import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Rider } from "../../../store/features/riders/riderTypes";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { verifyRider } from "../../../store/features/riders/riderThunks";
import { selectIsVerifyingRider } from "../../../store/features/riders/riderSelectors";
import { Loader2 } from "lucide-react";

interface VerifyRiderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rider: Rider | null;
  onVerifySuccess?: () => void;
}

const VerifyRiderDialog = ({
  open,
  onOpenChange,
  rider,
  onVerifySuccess,
}: VerifyRiderDialogProps) => {
  const dispatch = useAppDispatch();
  const isVerifying = useAppSelector(selectIsVerifyingRider);

  const handleVerify = async () => {
    if (!rider) return;

    try {
      await dispatch(
        verifyRider({
          user_id: rider.id,
        })
      ).unwrap();

      onOpenChange(false);
      if (onVerifySuccess) {
        onVerifySuccess();
      }
    } catch (error: unknown) {
      console.error("Error verifying rider:", error);
    }
  };

  // Determine the action text based on current verification status
  const actionText = rider?.verified ? "unverify" : "verify";
  const actionTitle = rider?.verified ? "Unverify Rider" : "Verify Rider";
  const actionDescription = rider?.verified
    ? "Are you sure you want to revoke verification status for this rider?"
    : "Are you sure you want to verify this rider?";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{actionTitle}</DialogTitle>
          <DialogDescription>{actionDescription}</DialogDescription>
        </DialogHeader>

        {rider && (
          <div className="flex items-center space-x-3 py-4">
            <div className="flex-shrink-0 h-10 w-10">
              {rider.profile.picture && rider.profile.picture !== "none" ? (
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={rider.profile.picture}
                  alt={`${rider.profile.full_name}'s profile`}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                  {rider.profile.full_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{rider.profile.full_name}</p>
              <p className="text-xs text-muted-foreground">
                Status: {rider.verified ? "Verified" : "Unverified"}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-end">
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
            variant={rider?.verified ? "destructive" : "default"}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `${
                actionText.charAt(0).toUpperCase() + actionText.slice(1)
              } Rider`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyRiderDialog;
