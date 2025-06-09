import { useState, useEffect } from "react";
import BackButton from "@/components/buttons/BackButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Edit, Trash, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { selectStorageTypes } from "@/store/features/storages/storageSelectors";
import { fetchStorageTypes } from "@/store/features/storages/storageThunks";
import { selectStores } from "@/store/features/stores/storeSelectors";
import { fetchStores } from "@/store/features/stores/storeThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectProducts } from "@/store/features/products/productSelectors";
import { fetchProducts } from "@/store/features/products/productThunks";
import { selectSuppliers } from "@/store/features/suppliers/supplierSelectors";
import { fetchSuppliers } from "@/store/features/suppliers/supplierThunks";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/store/features/products/productTypes";
import { restockInventory } from "@/store/features/stock/stockThunks";
import {
  selectIsRestockingInventory,
  selectStocksError,
} from "@/store/features/stock/stockSelectors";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { clearStockMessages } from "@/store/features/stock/stockSlice";
import { Supplier } from "@/store/features/suppliers/supplierTypes";

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
  const [productQuantity, setProductQuantity] = useState<string>("1");
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
      dispatch(clearStockMessages());
    }
  }, [stocksError, dispatch]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedProductId(product.id);
  };

  const handleAddProduct = () => {
    if (!selectedProduct || !productQuantity) return;

    const quantityValue = parseFloat(productQuantity);
    if (isNaN(quantityValue) || quantityValue <= 0) {
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    const existingProductIndex = productsToRestock.findIndex(
      (p) => p.id === product.id
    );

    if (existingProductIndex !== -1) {
      // Update quantity of existing product
      const updatedProducts = [...productsToRestock];
      updatedProducts[existingProductIndex].quantity +=
        parseFloat(productQuantity);
      setProductsToRestock(updatedProducts);
    } else {
      // Add new product
      const newProduct: ProductToRestock = {
        id: product.id,
        name: product.name,
        quantity: parseFloat(productQuantity),
        unit_type: product.unit_type,
      };
      setProductsToRestock([...productsToRestock, newProduct]);
    }

    setSelectedProduct(null);
    setSelectedProductId("");
    setProductQuantity("1");
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (product: ProductToRestock) => {
    setEditingProduct(product);
    setProductQuantity(product.quantity.toString());
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct || !productQuantity) return;

    const quantityValue = parseFloat(productQuantity);
    if (isNaN(quantityValue) || quantityValue <= 0) {
      toast.error("Please enter a valid quantity greater than zero");
      return;
    }

    const updatedProducts = productsToRestock.map((p) => {
      if (p.id === editingProduct.id) {
        return { ...p, quantity: quantityValue };
      }
      return p;
    });

    setProductsToRestock(updatedProducts);
    setEditingProduct(null);
    setProductQuantity("1");
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-bold">Restock Inventory</h1>
        </div>
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
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Complete Restock
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Restock Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <Label htmlFor="selectedStore">Store</Label>
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger className="bg-gray-50 w-full">
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

              <div className="space-y-2">
                <Label htmlFor="selectedStorageType">Storage Type</Label>
                <Select
                  value={selectedStorageType}
                  onValueChange={setSelectedStorageType}
                  disabled={!selectedStore}
                >
                  <SelectTrigger className="bg-gray-50 w-full">
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

              <div className="space-y-2">
                <Label htmlFor="selectedSupplier">Supplier (Optional)</Label>
                <Select
                  value={selectedSupplier}
                  onValueChange={setSelectedSupplier}
                >
                  <SelectTrigger className="bg-gray-50 w-full">
                    <SelectValue placeholder="Select a supplier (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier: Supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Products to Restock</CardTitle>
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

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddProduct();
                  }}
                >
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
                        step="any"
                        value={productQuantity}
                        onChange={(e) => {
                          const value = e.target.value;
                          setProductQuantity(value === "" ? "" : value);
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        !selectedProduct ||
                        !productQuantity ||
                        isNaN(parseFloat(productQuantity)) ||
                        parseFloat(productQuantity) <= 0
                      }
                    >
                      Add to Restock
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product Quantity</DialogTitle>
              <DialogDescription>
                Update the quantity for {editingProduct?.name}
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateProduct();
              }}
            >
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
                    onChange={(e) => {
                      const value = e.target.value;
                      setProductQuantity(value === "" ? "" : value);
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !productQuantity ||
                    isNaN(parseFloat(productQuantity)) ||
                    parseFloat(productQuantity) <= 0
                  }
                >
                  Update Quantity
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RestockPage;
