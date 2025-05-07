import { CheckCircle } from "lucide-react";
import Breadcrumbs from "../../components/breadcrumbs";
import { Button } from "../../components/ui/button";
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
import { selectProducts } from "../../store/features/products/productSelectors";
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
const SelectProductsPage = () => {
  const dispatch = useAppDispatch();
  const products: Product[] = useAppSelector(selectProducts);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [addAs, setAddAs] = useState<"raw_material" | "product">(
    "raw_material"
  ); // Dropdown state
  const [rawMaterials, setRawMaterials] = useState<
    (Product & { quantity: string })[]
  >([]);
  const [processedProducts, setProcessedProducts] = useState<
    (Product & { quantity: string })[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddProduct = (product: Product) => {
    setSelectedProduct(product);
    setAddAs("raw_material"); // Default to raw material
    setIsDialogOpen(true);
  };

  const handleConfirmAdd = () => {
    if (selectedProduct) {
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

  const handleProcessProducts = () => {
    console.log("Processing products...", { rawMaterials, processedProducts });
  };

  return (
    <div>
      <div className="sticky top-16 z-20 bg-background flex items-center justify-between py-3">
        <Breadcrumbs
          items={[
            {
              label: "Stock",
              to: "/stock",
            },
            {
              label: "Process Products",
              to: "/stock/process",
            },
            {
              label: "Select Products",
              isPage: false,
            },
          ]}
        />

        <Button onClick={handleProcessProducts} className="px-2">
          <CheckCircle className="size-4" />
          Finish
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-2">
        <div className="space-y-2">
          <Label htmlFor="search" className="font-normal text-base">
            Search Products
          </Label>
          <Input
            id="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="h-[70vh] overflow-y-auto border rounded-md p-2 space-y-2">
            {filteredProducts.map((product) => (
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
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-normal text-base">Raw Materials</Label>
          <div className="h-[70vh] overflow-y-auto border rounded-md p-2 space-y-2">
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
          <Label className="font-normal text-base">Processed Products</Label>
          <div className="h-[70vh] overflow-y-auto border rounded-md p-2 space-y-2">
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
    </div>
  );
};

export default SelectProductsPage;
