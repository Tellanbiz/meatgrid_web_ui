import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { createSupplier } from "../../../store/features/suppliers/supplierThunks";
import { CreateSupplierRequest } from "../../../store/features/suppliers/request/CreateSupplierRequest";

interface CreateSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const supplierSchema = z.object({
  full_name: z.string().min(1, "Full Name is required"),
  phone_number: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^\d+$/, "Phone must be numeric"),
  email: z.string().email("Enter a valid email"),
  address: z.string().min(1, "Address is required"),
  building_name: z.string().min(1, "Building name is required"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

const CreateSupplierDialog = ({
  open,
  onOpenChange,
}: CreateSupplierDialogProps) => {
  const dispatch = useAppDispatch();

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
      email: "",
      address: "",
      building_name: "",
      website: "",
    },
  });

  const { status, currentOperation, error, successMessage } = useAppSelector(
    (state) => state.suppliers
  );

  useEffect(() => {
    if(currentOperation !== "create") return;
    
    if (status == "failed" && error) {
      toast.error(error);
    }
    if (status == "succeeded" && successMessage) {
      toast.success(successMessage);
      onOpenChange(false);
      form.reset();
    }
  }, [currentOperation, status, error, successMessage, onOpenChange, form]);

  const onSubmit = (data: SupplierFormData) => {
    const request: CreateSupplierRequest = {
      full_name: data.full_name,
      email: data.email,
      phone_number: data.phone_number,
      address: data.address,
      building_name: data.building_name,
      website: data.website ?? "",
    };

    dispatch(createSupplier(request));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>New Supplier</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="0712345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Kajiado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="building_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. JS67" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Website{" "}
                    <span className="text-gray-500 text-xs font-light">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSupplierDialog;
