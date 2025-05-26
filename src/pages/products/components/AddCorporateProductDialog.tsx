import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateCorporateProduct } from "../../../store/features/products/corporateProductThunks";
import { Product } from "../../../store/features/products/productTypes";
import {
  selectIsUpdatingCorporateProduct,
  selectProductSuccessMessage,
  selectProducts,
  selectIsFetchingProducts,
  selectIsUpdatingStoreProduct,
} from "../../../store/features/products/productSelectors";
import { formatCurrency, formatWeight } from "../../../utils/formatters";
import { updateStoreProduct } from "../../../store/features/products/storeProductThunks";
import { fetchProducts } from "../../../store/features/products/productThunks";

interface AddCorporateProductDialogProps {
  context: "organization" | "store";
  contextId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddCorporateProductDialog = ({
  context = "organization",
  contextId,
  open,
  onClose,
  onSuccess,
}: AddCorporateProductDialogProps) => {
  const dispatch = useAppDispatch();

  // Form state
  const [weight, setWeight] = useState<string>("1");
  const [regularPrice, setRegularPrice] = useState<string>("0");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Redux selectors
  const products = useAppSelector(selectProducts);
  const isUpdatingCorporateProduct = useAppSelector(
    selectIsUpdatingCorporateProduct
  );
  const isUpdatingStoreProduct = useAppSelector(selectIsUpdatingStoreProduct);
  const isFetchingProducts = useAppSelector(selectIsFetchingProducts);
  const successMessage = useAppSelector(selectProductSuccessMessage);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setWeight("1");
      setRegularPrice("0");
      setSelectedProduct(null);
      setSearchQuery("");
    }
  }, [open]);

  // Handle success and error messages
  useEffect(() => {
    if (successMessage) {
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    }
  }, [successMessage, dispatch, onClose, onSuccess, selectedProduct, context]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !contextId) {
      toast.error("Please select a product");
      return;
    }

    const weightValue = parseFloat(weight);
    const priceValue = parseFloat(regularPrice);

    if (isNaN(weightValue) || weightValue <= 0) {
      toast.error("Weight must be a valid number greater than zero");
      return;
    }

    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error("Price must be a valid number greater than zero");
      return;
    }

    if (context === "organization") {
      dispatch(
        updateCorporateProduct({
          user_id: contextId,
          product_id: selectedProduct.id,
          weight: weightValue,
          regular_price: priceValue,
        })
      );
    } else if (context === "store") {
      dispatch(
        updateStoreProduct({
          store_id: contextId,
          product_id: selectedProduct.id,
          weight: weightValue,
          regular_price: priceValue,
        })
      );
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    // Initialize price and weight based on the selected product
    setRegularPrice(product.regular_price.toString());
    setWeight(product.weight.toString());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Add {context === "organization" ? "Organization" : "Store"} Product
          </DialogTitle>
          <DialogDescription>
            Select a product to add to this {context} products
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 pt-4 flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex-0">
            {selectedProduct ? (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                  {selectedProduct.images &&
                  selectedProduct.images.length > 0 ? (
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="h-12 w-12 rounded object-cover border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/40";
                      }}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                      No img
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(selectedProduct.regular_price)} •{" "}
                    {formatWeight(
                      selectedProduct.weight,
                      selectedProduct.unit_type
                    )}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => setSelectedProduct(null)}
                >
                  Change
                </Button>
              </div>
            ) : (
              <div className="pb-2">
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 border-gray-200"
                  />
                </div>
                <div className="h-[200px] overflow-y-auto pr-4">
                  {isFetchingProducts ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <p className="mt-2 text-sm text-gray-500">
                        Loading products...
                      </p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-sm text-gray-500">
                      No products found
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                          onClick={() => handleProductSelect(product)}
                        >
                          <div className="flex-shrink-0">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-10 w-10 rounded object-cover border border-gray-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://via.placeholder.com/40";
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatCurrency(product.regular_price)} •{" "}
                              {formatWeight(product.weight, product.unit_type)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {selectedProduct && (
            <div className="space-y-4 flex-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">
                    Weight ({selectedProduct.unit_type})
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="0.01"
                    step="any"
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
                    onChange={(e) => setRegularPrice(e.target.value)}
                    min="0"
                    step="any"
                    required
                    className="border-gray-200"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-auto pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mt-4"
              disabled={isUpdatingCorporateProduct}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="mt-4"
              disabled={
                isUpdatingCorporateProduct ||
                isUpdatingStoreProduct ||
                !selectedProduct
              }
            >
              {isUpdatingCorporateProduct || isUpdatingStoreProduct ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding
                  Product...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCorporateProductDialog;
