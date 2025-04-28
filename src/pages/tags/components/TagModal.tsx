import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag } from "../../../store/features/tags/tagTypes";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  priority: z.number().min(1, "Priority is required"),
  promotional_price: z.number().min(0, "Promotional price is required"),
  is_mobile: z.boolean(),
  is_pos: z.boolean(),
});

export type TagFormValues = z.infer<typeof tagSchema>;
type TagModalProps = {
  isLoading?: boolean;
  open: boolean;
  onClose: () => void;
  tag: Tag | null;
  onSubmit: (values: TagFormValues) => void;
};

const TagModal = ({
  isLoading = false,
  open,
  onClose,
  tag,
  onSubmit,
}: TagModalProps) => {
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name || "",
      priority: tag?.priority || 1,
      promotional_price: tag?.promotional_price || 0,
      is_mobile: tag?.is_mobile || false,
      is_pos: tag?.is_pos || false,
    },
  });

  const handleSubmit = (values: TagFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tag ? "Edit Tag" : "Create Tag"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-2">Priority</Label>
            <Input
              type="number"
              {...form.register("priority", { valueAsNumber: true })}
            />
            {form.formState.errors.priority && (
              <p className="text-sm text-red-500">
                {form.formState.errors.priority.message}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-2">Promotional Price</Label>
            <Input
              type="number"
              {...form.register("promotional_price", { valueAsNumber: true })}
            />
            {form.formState.errors.promotional_price && (
              <p className="text-sm text-red-500">
                {form.formState.errors.promotional_price.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="is_mobile"
              checked={form.watch("is_mobile")}
              onCheckedChange={(checked) =>
                form.setValue("is_mobile", checked === true)
              }
            />
            <Label htmlFor="is_mobile">Mobile</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="is_pos"
              checked={form.watch("is_pos")}
              onCheckedChange={(checked) =>
                form.setValue("is_pos", checked === true)
              }
            />
            <Label htmlFor="is_pos">POS</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || form.formState.isSubmitting}
            >
              {isLoading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TagModal;
