import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Stock } from "../../../store/features/stock/stockTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateStockSchema,
  UpdateStockSchema,
} from "../schemas/updateStockSchema";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface UpdateStockDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (newQuantity: number) => void;
  stock: Stock | null;
  isLoading: boolean;
}

const UpdateStockDialog = ({
  open,
  onClose,
  onUpdate,
  stock,
  isLoading,
}: UpdateStockDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateStockSchema>({
    resolver: zodResolver(updateStockSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (stock) {
      reset({
        quantity: stock.quantity,
      });
    }
  }, [stock, reset]);

  const onSubmit = (data: UpdateStockSchema) => {
    onUpdate(data.quantity);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
          <DialogDescription>
            {stock?.product.name} - {stock?.store?.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-center">
                Quantity{" "}
                <span className="text-xs">({stock?.product?.unit_type})</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                {...register("quantity", { valueAsNumber: true })}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStockDialog;
