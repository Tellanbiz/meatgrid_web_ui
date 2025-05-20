import { ArrowRight, CheckCircle, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "../../components/ui/button";
import BackButton from "../../components/BackButton";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectIsFetchingProducts,
  selectProducts,
} from "../../store/features/products/productSelectors";
import { fetchProducts } from "../../store/features/products/productThunks";
import { useEffect, useState } from "react";
import { Product } from "../../store/features/products/productTypes";
import ProductItem from "./components/ProductItem";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  selectStore,
  selectStorageType,
  selectSuppliers,
  selectIsProcesssingProducts,
  selectProcessProductSuccessMessage,
  selectProcessProductError,
} from "../../store/features/process-products/processProductSelectors";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProcessProductRequest } from "../../store/features/process-products/requests/ProcessProductRequest";
import { processProducts } from "../../store/features/process-products/processProductThunks";
import { resetProcessProductState } from "../../store/features/process-products/processProductSlice";
import LoadingPage from "../../components/LoadingPage";
import { clearProductMessages } from "../../store/features/products/productSlice";

const SelectProductsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const products: Product[] = useAppSelector(selectProducts);

  const selectedStore = useAppSelector(selectStore);
  const selectedStorageType = useAppSelector(selectStorageType);
  const selectedSuppliers = useAppSelector(selectSuppliers);
  const isProcessingProducts = useAppSelector(selectIsProcesssingProducts);
  const processingProductsError = useAppSelector(selectProcessProductError);
  const processingProductsSuccessMessage = useAppSelector(
    selectProcessProductSuccessMessage
  );
  const isFetchingProducts = useAppSelector(selectIsFetchingProducts);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [addAs, setAddAs] = useState<"raw_material" | "product">(
    "raw_material"
  );
  const [rawMaterials, setRawMaterials] = useState<
    (Product & { quantity: string })[]
  >([]);
  const [processedProducts, setProcessedProducts] = useState<
    (Product & { quantity: string })[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState<boolean>(false);
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().split(":").slice(0, 2).join(":");
    return { date, time };
  };

  const [processedDate, setProcessedDate] = useState<string>(
    getCurrentDateTime().date
  );
  const [processedTime, setProcessedTime] = useState<string>(
    getCurrentDateTime().time
  );
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [expiryTime, setExpiryTime] = useState<string>("");

  useEffect(() => {
    if (
      !selectedStore ||
      !selectedStorageType ||
      selectedSuppliers.length === 0
    ) {
      navigate("/stock");
    }
  }, [selectedStore, selectedStorageType, selectedSuppliers, navigate]);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (processingProductsError) {
      toast.error(processingProductsError);
      dispatch(clearProductMessages());
    }
  }, [processingProductsError, dispatch]);

  useEffect(() => {
    if (processingProductsSuccessMessage) {
      setIsQrDialogOpen(false);
      toast.success("Products processed successfully");
      dispatch(clearProductMessages());
      dispatch(resetProcessProductState());

      navigate("/stock");
    }
  }, [processingProductsSuccessMessage, dispatch, navigate]);

  const handleAddProduct = (product: Product) => {
    setSelectedProduct(product);

    if (product.is_raw_material && !product.is_product) {
      setAddAs("raw_material");
    } else if (product.is_product && !product.is_raw_material) {
      setAddAs("product");
    } else {
      setAddAs("raw_material");
    }

    setQuantity("");
    setIsDialogOpen(true);
  };

  const handleRefreshProducts = () => {
    dispatch(fetchProducts());
  };

  const handleConfirmAdd = () => {
    if (!selectedProduct) return;

    // Check if trying to add as product when one already exists
    if (addAs === "product" && processedProducts.length > 0) {
      toast.error("You can only process one product at a time.");
      return;
    }

    if (addAs === "raw_material") {
      setRawMaterials((prev) => {
        const existingProduct = prev.find(
          (item) => item.id === selectedProduct.id
        );
        if (existingProduct) {
          return prev.map((item) =>
            item.id === selectedProduct.id
              ? {
                  ...item,
                  quantity: (
                    parseFloat(item.quantity) + parseFloat(quantity)
                  ).toString(),
                }
              : item
          );
        }
        return [...prev, { ...selectedProduct, quantity }];
      });
    } else if (addAs === "product") {
      setProcessedProducts((prev) => {
        const existingProduct = prev.find(
          (item) => item.id === selectedProduct.id
        );
        if (existingProduct) {
          return prev.map((item) =>
            item.id === selectedProduct.id
              ? {
                  ...item,
                  quantity: (
                    parseFloat(item.quantity) + parseFloat(quantity)
                  ).toString(),
                }
              : item
          );
        }
        return [...prev, { ...selectedProduct, quantity }];
      });
    }
    setIsDialogOpen(false);
    setQuantity("");
  };

  const handleQuantityChange = (
    id: string,
    newQuantity: string,
    isRawMaterial: boolean
  ) => {
    if (isRawMaterial) {
      setRawMaterials((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } else {
      setProcessedProducts((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleDeleteProduct = (id: string, isRawMaterial: boolean) => {
    if (isRawMaterial) {
      setRawMaterials((prev) => prev.filter((item) => item.id !== id));
    } else {
      setProcessedProducts((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenQrDialog = () => {
    const { date, time } = getCurrentDateTime();
    setProcessedDate(date);
    setProcessedTime(time);
    setExpiryDate("");
    setExpiryTime("");
    setIsQrDialogOpen(true);
  };

  const formatDateTime = (date: string, time: string) => {
    if (!date || !time) return "";
    const [hours, minutes] = time.split(":");
    return `${date}T${hours}:${minutes}:00Z`;
  };

  const handleProcessProducts = () => {
    const request: ProcessProductRequest = {
      store_id: selectedStore || "",
      storage_type_id: selectedStorageType || "",
      suppliers: selectedSuppliers,
      expiry_at: formatDateTime(expiryDate, expiryTime),
      raw_materials: rawMaterials.map((item) => ({
        quantity: parseFloat(item.quantity),
        product_id: item.id,
      })),
      processed_products: {
        quantity: parseFloat(processedProducts[0].quantity),
        product_id: processedProducts[0].id,
      },
    };

    dispatch(processProducts(request));
  };

  const isFinishDisabled =
    rawMaterials.length === 0 || processedProducts.length !== 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-semibold">
            Select Product Raw Materials
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="px-2"
            onClick={handleRefreshProducts}
            disabled={isFetchingProducts}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetchingProducts ? "animate-spin" : ""}`}
            />
            <span className="ml-2">Refresh</span>
          </Button>

          <Button
            onClick={handleOpenQrDialog}
            className="px-2"
            disabled={isFinishDisabled}
          >
            <ArrowRight className="size-4" />
            Continue
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-4 h-table">
          <Input
            id="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="h-full overflow-y-auto border rounded-md p-2 space-y-2">
            {isFetchingProducts ? (
              <LoadingPage />
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100"
                >
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      {product.is_raw_material && product.is_product
                        ? "Raw Material | Product"
                        : product.is_raw_material
                        ? "Raw Material"
                        : "Product"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddProduct(product)}
                  >
                    Add
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-normal text-base">Raw Materials</Label>
          <div className="h-table overflow-y-auto border rounded-md p-2 space-y-2">
            {rawMaterials.length > 0 ? (
              rawMaterials.map((material) => (
                <ProductItem
                  key={material.id}
                  product={material}
                  isRawMaterial={true}
                  onQuantityChange={handleQuantityChange}
                  onDelete={handleDeleteProduct}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No raw materials added.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-normal text-base">Processed Product</Label>
          <div className="h-table overflow-y-auto border rounded-md p-2 space-y-2">
            {processedProducts.length > 0 ? (
              processedProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  isRawMaterial={false}
                  onQuantityChange={handleQuantityChange}
                  onDelete={handleDeleteProduct}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No processed products added.
              </p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirmAdd();
            }}
          >
            <DialogHeader>
              <DialogTitle>
                Add <strong>{selectedProduct?.name}</strong>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              {selectedProduct?.is_raw_material &&
                selectedProduct?.is_product && (
                  <div className="space-y-1">
                    <Label htmlFor="addAs" className="font-normal text-sm">
                      Add As
                    </Label>
                    <Select
                      value={addAs}
                      onValueChange={(value) =>
                        setAddAs(value as "raw_material" | "product")
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="raw_material">
                          Raw Material
                        </SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

              <div className="space-y-1">
                <p className="text-sm">
                  Quantity{" "}
                  {selectedProduct ? `(${selectedProduct?.unit_type})` : ""}
                </p>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Batch</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label>Date Processed</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={processedDate}
                  onChange={(e) => setProcessedDate(e.target.value)}
                  placeholder="mm/dd/yy"
                  required
                />
                <Input
                  type="time"
                  value={processedTime}
                  onChange={(e) => setProcessedTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Expiry Date</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="mm/dd/yy"
                  required
                />
                <Input
                  type="time"
                  value={expiryTime}
                  onChange={(e) => setExpiryTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsQrDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProcessProducts}
              disabled={
                !processedDate ||
                !processedTime ||
                !expiryDate ||
                !expiryTime ||
                isProcessingProducts
              }
            >
              {isProcessingProducts ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelectProductsPage;
