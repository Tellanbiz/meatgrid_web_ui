import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SearchIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectStorageTypes } from "@/store/features/storages/storageSelectors";
import { fetchStorageTypes } from "@/store/features/storages/storageThunks";
import { selectStores } from "@/store/features/stores/storeSelectors";
import { fetchStores } from "@/store/features/stores/storeThunks";
import { selectProducts } from "@/store/features/products/productSelectors";
import { fetchProducts } from "@/store/features/products/productThunks";
import {
  selectIsTransferringStock,
  selectStocksError,
} from "@/store/features/stock/stockSelectors";
import { TransferStockRequest } from "@/store/features/stock/request/TransferStockRequest";
import { transferStock } from "@/store/features/stock/stockThunks";
import ProductSelectionDialog from "@/components/dialogs/ProductSelectionDialog";

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
  const isTransferringStock = useAppSelector(selectIsTransferringStock);
  const stocksError = useAppSelector(selectStocksError);

  const [originalStore, setOriginalStore] = useState<string>("");
  const [receivingStore, setReceivingStore] = useState<string>("");
  const [storageType, setStorageType] = useState<string>("");
  const [productsToTransfer, setProductsToTransfer] = useState<
    ProductToTransfer[]
  >([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Search states
  const [originalStoreSearch, setOriginalStoreSearch] = useState("");
  const [receivingStoreSearch, setReceivingStoreSearch] = useState("");
  const [storageTypeSearch, setStorageTypeSearch] = useState("");

  // Selected items for display
  const [selectedOriginalStoreDisplay, setSelectedOriginalStoreDisplay] =
    useState<any>(null);
  const [selectedReceivingStoreDisplay, setSelectedReceivingStoreDisplay] =
    useState<any>(null);
  const [selectedStorageTypeDisplay, setSelectedStorageTypeDisplay] =
    useState<any>(null);

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

  const handleOriginalStoreChange = (store: any) => {
    setOriginalStore(store.id);
    setSelectedOriginalStoreDisplay(store);
    if (store.id === receivingStore) {
      setReceivingStore("");
      setSelectedReceivingStoreDisplay(null);
    }
  };

  const handleAddProduct = (
    product: { id: string; name: string; unit_type: string },
    quantity: number
  ) => {
    const newProduct: ProductToTransfer = {
      id: product.id,
      name: product.name,
      quantity: quantity,
      unit_type: product.unit_type,
    };

    setProductsToTransfer([...productsToTransfer, newProduct]);
  };

  const handleDeleteProduct = (id: string) => {
    setProductsToTransfer(productsToTransfer.filter((p) => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!originalStore || !receivingStore || !storageType) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (productsToTransfer.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

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

  if (isTransferringStock) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium text-gray-900">Transfer Stock</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/stock")}
            className="text-sm"
          >
            Back to Stock
          </Button>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="h-full">
          {/* 2-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Column 1: Transfer Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                Transfer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-700">From Store *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between mt-1 text-xs"
                      >
                        {selectedOriginalStoreDisplay ? (
                          <span className="truncate">
                            {selectedOriginalStoreDisplay.name.length > 30
                              ? `${selectedOriginalStoreDisplay.name.substring(
                                  0,
                                  30
                                )}...`
                              : selectedOriginalStoreDisplay.name}
                          </span>
                        ) : (
                          "Select source store..."
                        )}
                        <ChevronDownIcon className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <div className="flex items-center border-b px-3">
                          <SearchIcon className="mr-2 h-3 w-3 shrink-0 opacity-50" />
                          <CommandInput
                            placeholder="Search stores..."
                            value={originalStoreSearch}
                            onValueChange={setOriginalStoreSearch}
                            className="border-0 focus:ring-0 text-xs"
                          />
                        </div>
                        <CommandList>
                          <CommandEmpty>No store found.</CommandEmpty>
                          <CommandGroup>
                            {stores
                              .filter((s) =>
                                s.name
                                  .toLowerCase()
                                  .includes(originalStoreSearch.toLowerCase())
                              )
                              .map((store) => (
                                <CommandItem
                                  key={store.id}
                                  value={store.id.toString()}
                                  onSelect={() =>
                                    handleOriginalStoreChange(store)
                                  }
                                  className="text-xs"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {store.name}
                                    </span>
                                    {store.address && (
                                      <span className="text-gray-500 text-xs truncate">
                                        {store.address}
                                      </span>
                                    )}
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-xs text-gray-700">To Store *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between mt-1 text-xs"
                        disabled={!originalStore}
                      >
                        {selectedReceivingStoreDisplay ? (
                          <span className="truncate">
                            {selectedReceivingStoreDisplay.name.length > 30
                              ? `${selectedReceivingStoreDisplay.name.substring(
                                  0,
                                  30
                                )}...`
                              : selectedReceivingStoreDisplay.name}
                          </span>
                        ) : (
                          "Select destination store..."
                        )}
                        <ChevronDownIcon className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <div className="flex items-center border-b px-3">
                          <SearchIcon className="mr-2 h-3 w-3 shrink-0 opacity-50" />
                          <CommandInput
                            placeholder="Search stores..."
                            value={receivingStoreSearch}
                            onValueChange={setReceivingStoreSearch}
                            className="border-0 focus:ring-0 text-xs"
                          />
                        </div>
                        <CommandList>
                          <CommandEmpty>No store found.</CommandEmpty>
                          <CommandGroup>
                            {stores
                              .filter(
                                (s) =>
                                  s.name
                                    .toLowerCase()
                                    .includes(
                                      receivingStoreSearch.toLowerCase()
                                    ) && s.id !== originalStore
                              )
                              .map((store) => (
                                <CommandItem
                                  key={store.id}
                                  value={store.id.toString()}
                                  onSelect={() => {
                                    setReceivingStore(store.id);
                                    setSelectedReceivingStoreDisplay(store);
                                  }}
                                  className="text-xs"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {store.name}
                                    </span>
                                    {store.address && (
                                      <span className="text-gray-500 text-xs truncate">
                                        {store.address}
                                      </span>
                                    )}
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-xs text-gray-700">
                    Storage Type *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between mt-1 text-xs"
                      >
                        {selectedStorageTypeDisplay
                          ? `${selectedStorageTypeDisplay.name} (${selectedStorageTypeDisplay.duration_type})`
                          : "Select storage type..."}
                        <ChevronDownIcon className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <div className="flex items-center border-b px-3">
                          <SearchIcon className="mr-2 h-3 w-3 shrink-0 opacity-50" />
                          <CommandInput
                            placeholder="Search storage types..."
                            value={storageTypeSearch}
                            onValueChange={setStorageTypeSearch}
                            className="border-0 focus:ring-0 text-xs"
                          />
                        </div>
                        <CommandList>
                          <CommandEmpty>No storage type found.</CommandEmpty>
                          <CommandGroup>
                            {storageTypes
                              .filter((s) =>
                                s.name
                                  .toLowerCase()
                                  .includes(storageTypeSearch.toLowerCase())
                              )
                              .map((storageType) => (
                                <CommandItem
                                  key={storageType.id}
                                  value={storageType.id.toString()}
                                  onSelect={() => {
                                    setStorageType(storageType.id);
                                    setSelectedStorageTypeDisplay(storageType);
                                  }}
                                  className="text-xs"
                                >
                                  {storageType.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Column 2: Products */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                Products to Transfer
              </h2>

              <div className="mb-4">
                <Label className="text-xs text-gray-700">Add Product</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between mt-1 text-xs"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Select product to transfer...
                  <ChevronDownIcon className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                </Button>

                <ProductSelectionDialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                  title="Select Product to Transfer"
                  description="Choose a product and set its quantity"
                  products={products.map((p) => ({
                    id: p.id,
                    name: p.name,
                    unit_type: p.unit_type,
                  }))}
                  onProductSelect={(product, quantity, unit) => {
                    // Convert quantity if unit is kg for grams products
                    let finalQuantity = quantity;
                    if (unit === "kg" && product.unit_type === "grams") {
                      finalQuantity = quantity * 1000; // Convert kg to grams
                    }
                    handleAddProduct(product, finalQuantity);
                  }}
                  showQuantityInput={true}
                  allowUnitConversion={true}
                  primaryButtonText="Add Product"
                  searchPlaceholder="Search products..."
                  quantityPlaceholder="Enter quantity"
                />
              </div>

              {productsToTransfer.length > 0 && (
                <div className="space-y-3">
                  {productsToTransfer.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.quantity} {product.unit_type}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <Button type="submit" className="px-8 py-2 text-xs">
              Transfer Stock
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferStockPage;
