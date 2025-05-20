import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateCorporateProduct } from "../../../store/features/products/corporateProductThunks";
import { CorporateProduct } from "../../../store/features/products/corporateProductTypes";
import {
  selectIsUpdatingCorporateProduct,
  selectProductError,
  selectProductSuccessMessage,
} from "../../../store/features/products/productSelectors";
import { clearProductMessages } from "../../../store/features/products/productSlice";
import { formatCurrency, formatWeight } from "../../../utils/formatters";

interface UpdateCorporateProductDialogProps {
  open: boolean;
  onClose: () => void;
  product: CorporateProduct | null;
  organizationId: string;
  onSuccess?: () => void;
}

const UpdateCorporateProductDialog = ({
  open,
  onClose,
  product,
  organizationId,
  onSuccess,
}: UpdateCorporateProductDialogProps) => {
  const dispatch = useAppDispatch();

  // Form state
  const [weight, setWeight] = useState<number>(0);
  const [regularPrice, setRegularPrice] = useState<number>(0);

  // Redux selectors for loading state and messages
  const isLoading = useAppSelector(selectIsUpdatingCorporateProduct);
  const error = useAppSelector(selectProductError);
  const successMessage = useAppSelector(selectProductSuccessMessage);

  // Set initial form values when product changes
  useEffect(() => {
    if (product) {
      setWeight(product.weight);
      setRegularPrice(product.regular_price);
    }
  }, [product]);

  // Handle success and error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearProductMessages());
      // Call onSuccess callback if provided, then close the dialog
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    }
    if (error) {
      toast.error(error);
      dispatch(clearProductMessages());
    }
  }, [successMessage, error, dispatch, onClose, onSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!product || !organizationId) return;

    dispatch(
      updateCorporateProduct({
        user_id: organizationId,
        product_id: product.id,
        weight: weight,
        regular_price: regularPrice,
      })
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Corporate Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {product && (
            <div className="flex items-center gap-3 mb-4">
              <img
                src={product.image || "https://via.placeholder.com/40"}
                alt={product.name}
                className="h-12 w-12 rounded object-cover border border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/40";
                }}
              />
              <div>
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-xs text-gray-500">
                  {product.org.full_name} • {formatCurrency(product.regular_price)} • {formatWeight(product.weight, product.unit_type)}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="weight">Weight ({product?.unit_type})</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              min="0"
              required
              className="border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="regularPrice">Price (KSH)</Label>
            <Input
              id="regularPrice"
              type="number"
              value={regularPrice}
              onChange={(e) => setRegularPrice(Number(e.target.value))}
              min="0"
              required
              className="border-gray-200"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mt-4"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="mt-4" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCorporateProductDialog;
