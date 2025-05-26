import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface DeleteDialogProps {
  isLoading?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string | ReactNode;
  onConfirm: () => void;
}

const DeleteDialog = ({
  isLoading = false,
  open,
  onOpenChange,
  title = "Delete item?",
  description = "This action cannot be undone. Are you sure you want to continue?",
  onConfirm,
}: DeleteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>{title}</DialogTitle>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading && <Loader2 className="animate-spin" />}
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
