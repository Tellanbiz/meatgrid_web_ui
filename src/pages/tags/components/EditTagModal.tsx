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
import { updateTag } from "../../../store/features/tags/tagThunks";
import { useAppDispatch } from "../../../store/hooks";
import { Tag } from "../../../store/features/tags/tagTypes";
import { Label } from "@/components/ui/label";
import Loader from "../../../components/Loader";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  priority: z.number().min(1, "Priority is required"),
  promotional_price: z.number().min(0, "Promotional price is required"),
  is_mobile: z.boolean(),
  is_pos: z.boolean(),
  active: z.boolean(),
});

type TagFormValues = z.infer<typeof tagSchema>;

type EditTagModalProps = {
  isUpdating: boolean;
  open: boolean;
  onClose: () => void;
  tag: Tag | null;
};

const EditTagModal = ({
  isUpdating,
  open,
  onClose,
  tag,
}: EditTagModalProps) => {
  const dispatch = useAppDispatch();

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name || "",
      priority: tag?.priority || 1,
      promotional_price: tag?.promotional_price || 0,
      is_mobile: tag?.is_mobile || false,
      is_pos: tag?.is_pos || false,
      active: tag?.active || false,
    },
  });

  const onSubmit = (values: TagFormValues) => {
    if (!tag) return;
    dispatch(
      updateTag({
        id: tag.id,
        name: values.name,
        priority: values.priority,
        promotional_price: values.promotional_price,
        is_mobile: values.is_mobile,
        is_pos: values.is_pos,
        active: values.active,
      })
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Tag</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit">{isUpdating ? <Loader size={24} color="border-white" className="mx-3"/> : "Update"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTagModal;
