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
import { selectSuppliers } from "@/store/features/suppliers/supplierSelectors";
import { fetchSuppliers } from "@/store/features/suppliers/supplierThunks";
import { restockInventory } from "@/store/features/stock/stockThunks";
import {
  selectIsRestockingInventory,
  selectStocksError,
} from "@/store/features/stock/stockSelectors";
import { clearStockMessages } from "@/store/features/stock/stockSlice";
import ProductSelectionDialog from "@/components/dialogs/ProductSelectionDialog";

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Search states
  const [storeSearch, setStoreSearch] = useState("");
  const [storageTypeSearch, setStorageTypeSearch] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");

  // Selected items for display
  const [selectedStoreDisplay, setSelectedStoreDisplay] = useState<any>(null);
  const [selectedStorageTypeDisplay, setSelectedStorageTypeDisplay] =
    useState<any>(null);
  const [selectedSupplierDisplay, setSelectedSupplierDisplay] =
    useState<any>(null);

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

  const handleAddProduct = (
    product: { id: string; name: string; unit_type: string },
    quantity: number
  ) => {
    const existingProductIndex = productsToRestock.findIndex(
      (p) => p.id === product.id
    );

    if (existingProductIndex !== -1) {
      // Update quantity of existing product
      const updatedProducts = [...productsToRestock];
      updatedProducts[existingProductIndex].quantity += quantity;
      setProductsToRestock(updatedProducts);
    } else {
      // Add new product
      const newProduct: ProductToRestock = {
        id: product.id,
        name: product.name,
        quantity: quantity,
        unit_type: product.unit_type,
      };
      setProductsToRestock([...productsToRestock, newProduct]);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProductsToRestock(productsToRestock.filter((p) => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStore || !selectedStorageType) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (productsToRestock.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

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

  // Helper function to format quantity with unit conversion
  const formatQuantity = (quantity: number, unitType: string) => {
    // Convert grams to kilograms if quantity is >= 1000 and unit type is kilograms
    if (
      (unitType === "kilograms" || unitType === "kilogram") &&
      quantity >= 1000
    ) {
      const kgQuantity = quantity / 1000;
      return `${kgQuantity.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })} kg`;
    }
    return `${quantity.toLocaleString()} ${unitType}`;
  };

  if (isRestockingInventory) {
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
          <h1 className="text-lg font-medium text-gray-900">
            Restock Inventory
          </h1>
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
            {/* Column 1: Basic Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-700">Store *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between mt-1 text-xs"
                      >
                        {selectedStoreDisplay ? (
                          <span className="truncate">
                            {selectedStoreDisplay.name.length > 30
                              ? `${selectedStoreDisplay.name.substring(
                                  0,
                                  30
                                )}...`
                              : selectedStoreDisplay.name}
                          </span>
                        ) : (
                          "Select store..."
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
                            value={storeSearch}
                            onValueChange={setStoreSearch}
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
                                  .includes(storeSearch.toLowerCase())
                              )
                              .map((store) => (
                                <CommandItem
                                  key={store.id}
                                  value={store.id.toString()}
                                  onSelect={() => {
                                    setSelectedStore(store.id);
                                    setSelectedStoreDisplay(store);
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
                                    setSelectedStorageType(storageType.id);
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

                <div>
                  <Label className="text-xs text-gray-700">
                    Supplier (Optional)
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between mt-1 text-xs"
                      >
                        {selectedSupplierDisplay ? (
                          <span className="truncate">
                            {selectedSupplierDisplay.full_name.length > 30
                              ? `${selectedSupplierDisplay.full_name.substring(
                                  0,
                                  30
                                )}...`
                              : selectedSupplierDisplay.full_name}
                          </span>
                        ) : (
                          "Select supplier..."
                        )}
                        <ChevronDownIcon className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <div className="flex items-center border-b px-3">
                          <SearchIcon className="mr-2 h-3 w-3 shrink-0 opacity-50" />
                          <CommandInput
                            placeholder="Search suppliers..."
                            value={supplierSearch}
                            onValueChange={setSupplierSearch}
                            className="border-0 focus:ring-0 text-xs"
                          />
                        </div>
                        <CommandList>
                          <CommandEmpty>No supplier found.</CommandEmpty>
                          <CommandGroup>
                            {suppliers
                              .filter((s) =>
                                s.full_name
                                  .toLowerCase()
                                  .includes(supplierSearch.toLowerCase())
                              )
                              .map((supplier) => (
                                <CommandItem
                                  key={supplier.id}
                                  value={supplier.id.toString()}
                                  onSelect={() => {
                                    setSelectedSupplier(supplier.id);
                                    setSelectedSupplierDisplay(supplier);
                                  }}
                                  className="text-xs"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {supplier.full_name}
                                    </span>
                                    {supplier.email && (
                                      <span className="text-gray-500 text-xs truncate">
                                        {supplier.email}
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
              </div>
            </div>

            {/* Column 2: Products */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                Products to Restock
              </h2>

              <div className="mb-4">
                <Label className="text-xs text-gray-700">Add Product</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between mt-1 text-xs"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Select product to restock...
                  <ChevronDownIcon className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                </Button>

                <ProductSelectionDialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                  title="Select Product to Restock"
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

              {productsToRestock.length > 0 && (
                <div className="space-y-3">
                  {productsToRestock.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatQuantity(product.quantity, product.unit_type)}
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
              Restock Inventory
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockPage;
