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
import {
  selectIsTransferringStock,
  selectStocksError,
} from "@/store/features/stock/stockSelectors";
import { TransferStockRequest } from "@/store/features/stock/request/TransferStockRequest";
import { transferStock } from "@/store/features/stock/stockThunks";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProductToTransfer {
  id: string;
  name: string;
  quantity: number;
  unit_type: string;
}

const TransferStockPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const storageTypes = useAppSelector(selectStorageTypes);
  const stores = useAppSelector(selectStores);
  const products = useAppSelector(selectProducts);
  const isTranferringStock = useAppSelector(selectIsTransferringStock);
  const stocksError = useAppSelector(selectStocksError);

  const [originalStore, setOriginalStore] = useState<string>("");
  const [receivingStore, setReceivingStore] = useState<string>("");
  const [storageType, setStorageType] = useState<string>("");
  const [productsToTransfer, setProductsToTransfer] = useState<
    ProductToTransfer[]
  >([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [productQuantity, setProductQuantity] = useState<string>("1");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductToTransfer | null>(null);

  useEffect(() => {
    dispatch(fetchStorageTypes());
    dispatch(fetchStores());
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (stocksError) {
      toast.error(stocksError);
    }
  }, [stocksError]);

  const handleOriginalStoreChange = (value: string) => {
    setOriginalStore(value);
    if (value === receivingStore) {
      setReceivingStore("");
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedProductId(product.id);
  };

  const handleAddProduct = () => {
    if (
      !selectedProduct ||
      !productQuantity ||
      parseFloat(productQuantity) <= 0
    )
      return;

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    const newProduct: ProductToTransfer = {
      id: product.id,
      name: product.name,
      quantity: parseFloat(productQuantity),
      unit_type: product.unit_type,
    };

    setProductsToTransfer([...productsToTransfer, newProduct]);
    setSelectedProduct(null);
    setSelectedProductId("");
    setProductQuantity("1");
    setIsAddDialogOpen(false);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductQuantity(e.target.value);
  };

  const handleEditProduct = (product: ProductToTransfer) => {
    setEditingProduct(product);
    setProductQuantity(product.quantity.toString());
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct || !productQuantity || parseFloat(productQuantity) <= 0)
      return;

    const updatedProducts = productsToTransfer.map((p) => {
      if (p.id === editingProduct.id) {
        return { ...p, quantity: parseFloat(productQuantity) };
      }
      return p;
    });

    setProductsToTransfer(updatedProducts);
    setEditingProduct(null);
    setProductQuantity("1");
    setIsEditDialogOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProductsToTransfer(productsToTransfer.filter((p) => p.id !== id));
  };

  const handleSubmit = async () => {
    try {
      const transferRequest: TransferStockRequest = {
        store_id: originalStore,
        receiving_store_id: receivingStore,
        storage_type: storageType,
        products: productsToTransfer.map((product) => ({
          product_id: product.id,
          quantity: product.quantity,
        })),
      };

      await dispatch(transferStock(transferRequest)).unwrap();
      navigate("/stock");
      toast.success("Stock transfer completed successfully!");
    } catch (error) {
      console.error("Failed to transfer stock:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-bold">Transfer Stock</h1>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={
            !originalStore ||
            !receivingStore ||
            !storageType ||
            productsToTransfer.length === 0 ||
            isTranferringStock
          }
          variant="default"
        >
          {isTranferringStock ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Complete Transfer
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <Label htmlFor="originalStore">Original Store</Label>
                <Select
                  value={originalStore}
                  onValueChange={handleOriginalStoreChange}
                >
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
                <Label htmlFor="receivingStore">Receiving Store</Label>
                <Select
                  value={receivingStore}
                  onValueChange={setReceivingStore}
                  disabled={!originalStore}
                >
                  <SelectTrigger className="bg-gray-50 w-full">
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores
                      .filter((store) => store.id !== originalStore)
                      .map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {!originalStore && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Please select an original store first
                  </p>
                )}

                {originalStore &&
                  stores.filter((store) => store.id !== originalStore)
                    .length === 0 && (
                    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
                      No other stores available. Please select a different
                      original store.
                    </div>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageType">Storage Type</Label>
                <Select value={storageType} onValueChange={setStorageType}>
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
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Products to Transfer</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" variant="default">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Product for Transfer</DialogTitle>
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
                        {products
                          .filter((p) => p.stock_info?.total_instock > 0)
                          .map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - Available:{" "}
                              {product.stock_info?.total_instock}{" "}
                              {product.unit_type}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">
                      Quantity{" "}
                      {selectedProduct ? `(${selectedProduct.unit_type})` : ""}
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="any"
                      value={productQuantity}
                      onChange={handleQuantityChange}
                      className="w-full"
                      min="0"
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
                    disabled={
                      !selectedProduct ||
                      parseFloat(productQuantity) <= 0 ||
                      !productQuantity
                    }
                  >
                    Add to Transfer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {productsToTransfer.length === 0 ? (
              <div className="text-center py-12 border rounded-md bg-gray-50">
                <p className="text-muted-foreground">
                  No products added for transfer yet.
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
                    {productsToTransfer.map((product) => (
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

            <div className="py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">
                  Quantity
                  {editingProduct ? ` (${editingProduct.unit_type})` : ""}
                </Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  step="any"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                  className="w-full"
                  min="0"
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
                disabled={parseFloat(productQuantity) <= 0 || !productQuantity}
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

export default TransferStockPage;
