import { useState, useEffect } from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Edit, Trash, Plus, Loader2 } from "lucide-react";
import { selectStorageTypes } from "../../store/features/storages/storageSelectors";
import { fetchStorageTypes } from "../../store/features/storages/storageThunks";
import { selectStores } from "../../store/features/stores/storeSelectors";
import { fetchStores } from "../../store/features/stores/storeThunks";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectProducts } from "../../store/features/products/productSelectors";
import { fetchProducts } from "../../store/features/products/productThunks";
import { selectSuppliers } from "../../store/features/suppliers/supplierSelectors";
import { fetchSuppliers } from "../../store/features/suppliers/supplierThunks";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Product } from "../../store/features/products/productTypes";
import { restockInventory } from "../../store/features/stock/stockThunks";
import {
  selectIsRestockingInventory,
  selectStocksError,
} from "../../store/features/stock/stockSelectors";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProductToRestock {
  id: string;
  name: string;
  quantity: number;
  unit_type: string;
}

const RestockPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const storageTypes = useAppSelector(selectStorageTypes);
  const stores = useAppSelector(selectStores);
  const products = useAppSelector(selectProducts);
  const suppliers = useAppSelector(selectSuppliers);
  const isRestockingInventory = useAppSelector(selectIsRestockingInventory);
  const stocksError = useAppSelector(selectStocksError);

  const [selectedStore, setSelectedStore] = useState<string>("");
  const [selectedStorageType, setSelectedStorageType] = useState<string>("");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [productsToRestock, setProductsToRestock] = useState<
    ProductToRestock[]
  >([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductToRestock | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchStorageTypes());
    dispatch(fetchStores());
    dispatch(fetchProducts());
    dispatch(fetchSuppliers());
  }, [dispatch]);

  useEffect(() => {
    if (stocksError) {
      toast.error(stocksError);
    }
  }, [stocksError]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedProductId(product.id);
    setProductQuantity(1);
  };

  const handleAddProduct = () => {
    if (!selectedProduct || productQuantity <= 0) return;

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    const newProduct: ProductToRestock = {
      id: product.id,
      name: product.name,
      quantity: productQuantity,
      unit_type: product.unit_type,
    };

    setProductsToRestock([...productsToRestock, newProduct]);
    setSelectedProduct(null);
    setSelectedProductId("");
    setProductQuantity(1);
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (product: ProductToRestock) => {
    setEditingProduct(product);
    setProductQuantity(product.quantity);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct || productQuantity <= 0) return;

    const updatedProducts = productsToRestock.map((p) => {
      if (p.id === editingProduct.id) {
        return { ...p, quantity: productQuantity };
      }
      return p;
    });

    setProductsToRestock(updatedProducts);
    setEditingProduct(null);
    setProductQuantity(1);
    setIsEditDialogOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProductsToRestock(productsToRestock.filter((p) => p.id !== id));
  };

  const handleSubmit = async () => {
    try {
      const restockRequest = {
        store_id: selectedStore,
        storage_type_id: selectedStorageType,
        supplier_id: selectedSupplier || undefined,
        products: productsToRestock.map((product) => ({
          product_id: product.id,
          quantity: product.quantity,
        })),
      };

      await dispatch(restockInventory(restockRequest)).unwrap();
      navigate("/stock");
      toast.success("Inventory restocked successfully!");
    } catch (error) {
      console.error("Failed to restock inventory:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center py-3 sticky top-16 z-20 bg-background">
        <Breadcrumbs
          items={[
            {
              label: "Stock",
              to: "/stock",
            },
            {
              label: "Restock Inventory",
              isPage: true,
            },
          ]}
        />

        {/* Moved Complete Restock button to the top */}
        <Button
          onClick={handleSubmit}
          disabled={
            !selectedStore ||
            !selectedStorageType ||
            productsToRestock.length === 0 ||
            isRestockingInventory
          }
          variant="default"
        >
          {isRestockingInventory ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Restocking...
            </>
          ) : (
            "Complete Restock"
          )}
        </Button>
      </div>

      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Store Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="selectedStore">Store</Label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Storage Type Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="selectedStorageType">Storage Type</Label>
              <Select
                value={selectedStorageType}
                onValueChange={setSelectedStorageType}
                disabled={!selectedStore}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select storage type" />
                </SelectTrigger>
                <SelectContent>
                  {storageTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {!selectedStore && (
                <p className="text-sm text-muted-foreground mt-2">
                  Please select a store first
                </p>
              )}
            </div>
          </div>

          {/* Supplier Selection (Optional) */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="selectedSupplier">Supplier (Optional)</Label>
              <Select
                value={selectedSupplier}
                onValueChange={setSelectedSupplier}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a supplier (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products to Restock Section */}
        {selectedStore && selectedStorageType && (
          <div className="mt-10 border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-md">Products to Restock</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2" variant="default">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Product for Restocking</DialogTitle>
                    <DialogDescription>
                      Select a product and specify quantity
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="product">Product</Label>
                      <Select
                        value={selectedProductId}
                        onValueChange={(value) => {
                          const product = products.find((p) => p.id === value);
                          if (product) {
                            handleSelectProduct(product);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} ({product.unit_type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">
                        Quantity{" "}
                        {selectedProduct
                          ? `(${selectedProduct.unit_type})`
                          : ""}
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={productQuantity}
                        onChange={(e) =>
                          setProductQuantity(Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddProduct}
                      disabled={!selectedProduct || productQuantity <= 0}
                    >
                      Add to Restock
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {productsToRestock.length === 0 ? (
              <div className="text-center py-12 border rounded-md bg-gray-50">
                <p className="text-muted-foreground">
                  No products added for restocking yet.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[400px]">Product Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productsToRestock.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          {product.quantity} {product.unit_type}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product Quantity</DialogTitle>
              <DialogDescription>
                Update the quantity for {editingProduct?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">
                  Quantity
                  {editingProduct ? ` (${editingProduct.unit_type})` : ""}
                </Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  min="1"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateProduct}
                disabled={productQuantity <= 0}
              >
                Update Quantity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RestockPage;
