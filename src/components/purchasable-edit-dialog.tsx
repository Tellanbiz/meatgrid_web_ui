import { useState, useEffect } from "react";
import { toast } from "sonner";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createPurchasable,
  updatePurchasable,
} from "@/routes/purchasables/domain/purchasable-post";
import type {
  CreatePurchaseParams,
  Purchasable,
} from "@/routes/purchasables/domain/models";

interface PurchasableEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchasable?: Purchasable | null;
  onSuccess: () => void;
}

export function PurchasableEditDialog({
  open,
  onOpenChange,
  purchasable,
  onSuccess,
}: PurchasableEditDialogProps) {
  const [formData, setFormData] = useState<CreatePurchaseParams>({
    name: "",
    description: "",
    unit_type: "pieces",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!purchasable;

  // Reset form when dialog opens/closes or purchasable changes
  useEffect(() => {
    if (open) {
      setError(null);
      if (purchasable) {
        setFormData({
          id: purchasable.id,
          name: purchasable.name,
          description: purchasable.description,
          unit_type: purchasable.unit_type as
            | "grams"
            | "kilograms"
            | "liters"
            | "pieces"
            | "strands"
            | "rolls"
            | "packets",
        });
      } else {
        setFormData({
          name: "",
          description: "",
          unit_type: "pieces",
        });
      }
    }
  }, [open, purchasable]);

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let error: string | undefined;

      if (isEditMode) {
        error = await updatePurchasable(formData);
      } else {
        error = await createPurchasable(formData);
      }

      if (!error) {
        onSuccess();
        onOpenChange(false);
        // Reset form
        setFormData({
          name: "",
          description: "",
          unit_type: "pieces",
        });
        // Show success toast
        toast.success(
          isEditMode
            ? "Purchasable updated successfully!"
            : "Purchasable created successfully!"
        );
      } else {
        setError(error || "Failed to save purchasable. Please try again.");
      }
    } catch (err) {
      console.error("Error saving purchasable:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Update Purchasable" : "Create New Purchasable"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details of the selected purchasable."
              : "Add a new purchasable item to the system."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="col-span-3"
              placeholder="Enter purchasable name"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="col-span-3"
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit_type" className="text-right">
              Unit Type
            </Label>
            <Select
              value={formData.unit_type}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  unit_type: value as
                    | "grams"
                    | "kilograms"
                    | "liters"
                    | "pieces",
                })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select unit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grams">Grams</SelectItem>
                <SelectItem value="kilograms">Kilograms</SelectItem>
                <SelectItem value="liters">Liters</SelectItem>
                <SelectItem value="strands">Strands</SelectItem>
                <SelectItem value="rolls">Rolls</SelectItem>
                <SelectItem value="packets">Packets</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update"
              : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
