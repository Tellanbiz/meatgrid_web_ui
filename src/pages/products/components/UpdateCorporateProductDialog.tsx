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
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateCorporateProduct } from "../../../store/features/products/corporateProductThunks";
import { CorporateProduct } from "../../../store/features/products/corporateProductTypes";
import {
  selectIsUpdatingCorporateProduct,
  selectIsUpdatingStoreProduct,
  selectProductSuccessMessage,
} from "../../../store/features/products/productSelectors";
import { formatCurrency, formatWeight } from "../../../utils/formatters";
import { updateStoreProduct } from "../../../store/features/products/storeProductThunks";
import { StoreProduct } from "../../../store/features/products/storeProductTypes";

interface UpdateCorporateProductDialogProps {
  context: "organization" | "store";
  open: boolean;
  onClose: () => void;
  product: CorporateProduct | StoreProduct | null;
  contextId: string;
  onSuccess?: () => void;
}

const UpdateCorporateProductDialog = ({
  context = "organization",
  open,
  onClose,
  product,
  contextId,
  onSuccess,
}: UpdateCorporateProductDialogProps) => {
  const dispatch = useAppDispatch();

  // Form state
  const [weight, setWeight] = useState<string>("0");
  const [regularPrice, setRegularPrice] = useState<string>("0");

  // Redux selectors for loading state and messages
  const isUpdatingCorporateProduct = useAppSelector(
    selectIsUpdatingCorporateProduct
  );
  const isUpdatingStoreProduct = useAppSelector(selectIsUpdatingStoreProduct);
  const isLoading = isUpdatingCorporateProduct || isUpdatingStoreProduct;

  const successMessage = useAppSelector(selectProductSuccessMessage);

  // Set initial form values when product changes
  useEffect(() => {
    if (product) {
      setWeight(product.weight.toString());
      setRegularPrice(product.regular_price.toString());
    }
  }, [product]);

  // Handle success and error messages
  useEffect(() => {
    if (successMessage) {
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    }
  }, [successMessage, dispatch, onClose, onSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!product || !contextId || !weight || !regularPrice) return;

    const weightValue = parseFloat(weight);
    const priceValue = parseFloat(regularPrice);

    if (context === "organization") {
      dispatch(
        updateCorporateProduct({
          user_id: contextId,
          product_id: product.id,
          weight: weightValue,
          regular_price: priceValue,
        })
      );
    } else if (context === "store") {
      dispatch(
        updateStoreProduct({
          store_id: contextId,
          product_id: product.id,
          weight: weightValue,
          regular_price: priceValue,
        })
      );
    }
  };

  const getOrganizationName = (product: CorporateProduct | StoreProduct) => {
    if ("org" in product) {
      return product.org.full_name;
    }
    return product.store.name;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Update {context === "organization" ? "Corporate" : "Store"} Product
          </DialogTitle>
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
                  {getOrganizationName(product)} •{" "}
                  {formatCurrency(product.regular_price)} •{" "}
                  {formatWeight(product.weight, product.unit_type)}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="weight">Weight ({product?.unit_type})</Label>
            <Input
              id="weight"
              type="number"
              step="any"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              className="border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="regularPrice">Price (KSH)</Label>
            <Input
              id="regularPrice"
              type="number"
              step="any"
              value={regularPrice}
              onChange={(e) => setRegularPrice(e.target.value)}
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
