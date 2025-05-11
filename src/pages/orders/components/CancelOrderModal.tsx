import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Order } from "../../../store/features/orders/orderTypes";
import { cancelOrder } from "../../../store/features/orders/orderThunks";
import { resetCancelOrderState } from "../../../store/features/orders/orderSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Button } from "../../../components/ui/button";
import {
  selectIsCancellingOrder,
  selectOrderError,
  selectOrderSuccessMessage,
} from "../../../store/features/orders/orderSelectors";
import { Loader2 } from "lucide-react";

interface CancelOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onCancelled: () => void;
}

const cancelSchema = z.object({
  reason: z.string().min(1, "Reason for cancelling order is required"),
});

type CancelFormValues = z.infer<typeof cancelSchema>;

const CancelOrderModal = ({
  open,
  onOpenChange,
  order,
  onCancelled,
}: CancelOrderModalProps) => {
  const dispatch = useAppDispatch();

  const isCancellingOrder = useAppSelector(selectIsCancellingOrder);
  const errorMessage = useAppSelector(selectOrderError);
  const successMessage = useAppSelector(selectOrderSuccessMessage);

  const form = useForm<CancelFormValues>({
    resolver: zodResolver(cancelSchema),
    defaultValues: {
      reason: "",
    },
  });


  useEffect(() => {
    if (successMessage) {
      onOpenChange(false);
      form.reset();
      toast.success(successMessage ?? "Order cancelled successfully");
      dispatch(resetCancelOrderState());
      onCancelled();
    }
  }, [successMessage, dispatch, form, onCancelled, onOpenChange]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(resetCancelOrderState());
    }
  }, [errorMessage, dispatch]);

  const handleConfirmCancelOrder = async (data: CancelFormValues) => {
    if (!order) return;

    await dispatch(
      cancelOrder({
        order_id: order.id,
        cancel_reason: data.reason,
      })
    );
  };

  const handleCancelForm = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md transition-all duration-100 ease-in-out">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleConfirmCancelOrder)}
            className="space-y-4"
          >
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
              <DialogDescription>
                Please provide a reason for cancelling order{" "}
                <span className="font-bold">MG{order?.order_id}</span>
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Reason for cancellation"
                      className="w-full h-24 p-2 border border-input rounded-md resize-none text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelForm}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCancellingOrder}>
                {isCancellingOrder && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirm Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderModal;
