import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Plus, Trash2, Search, ArrowLeft, ChevronDownIcon } from "lucide-react";
import { createPurchaseOrder } from "@/routes/purchasables/domain/purchasable-post";
import { usePurchasables } from "../hooks/usePurchasables";
import type { CreateOrderPurchaseParams } from "@/routes/purchasables/domain/models";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSuppliers } from "@/store/features/suppliers/supplierThunks";
import { selectSuppliers } from "@/store/features/suppliers/supplierSelectors";
import { fetchStores } from "@/store/features/stores/storeThunks";
import { selectStores } from "@/store/features/stores/storeSelectors";
import { fetchStorageTypes } from "@/store/features/storages/storageThunks";
import { selectStorageTypes } from "@/store/features/storages/storageSelectors";

interface OrderItem {
  product_id: number;
  unit_of_issue: number;
  unit_cost: number;
}

export default function PurchasableCreateOrderPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { purchasables, fetchPurchasables } = usePurchasables();
  const suppliers = useAppSelector(selectSuppliers);
  const stores = useAppSelector(selectStores);
  const storageTypes = useAppSelector(selectStorageTypes);
  
  const [supplierId, setSupplierId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [storageTypeId, setStorageTypeId] = useState("");
  const [items, setItems] = useState<OrderItem[]>([
    { product_id: 0, unit_of_issue: 0, unit_cost: 0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState<{
    [key: number]: string;
  }>({});
  const [supplierSearch, setSupplierSearch] = useState("");
  const [storeSearch, setStoreSearch] = useState("");
  const [storageTypeSearch, setStorageTypeSearch] = useState("");
  const [debouncedSupplierSearch, setDebouncedSupplierSearch] = useState("");

  
  // Dialog states
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [storeDialogOpen, setStoreDialogOpen] = useState(false);
  const [storageTypeDialogOpen, setStorageTypeDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    fetchPurchasables();
    dispatch(fetchSuppliers());
    dispatch(fetchStores());
    dispatch(fetchStorageTypes());
  }, [fetchPurchasables, dispatch]);

  // Debounce supplier search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSupplierSearch(supplierSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [supplierSearch]);



  const addItem = () => {
    setItems([...items, { product_id: 0, unit_of_issue: 0, unit_cost: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof OrderItem, value: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async () => {
    // Validation
    if (!supplierId.trim()) {
      setError("Please select a supplier");
      return;
    }

    if (!storeId.trim()) {
      setError("Please select a store");
      return;
    }

    if (!storageTypeId.trim()) {
      setError("Please select a storage type");
      return;
    }

    if (items.some((item) => item.product_id === 0)) {
      setError("Please select a product for all items");
      return;
    }

    if (items.some((item) => item.unit_of_issue <= 0)) {
      setError("Unit of issue must be greater than 0");
      return;
    }

    if (items.some((item) => item.unit_cost <= 0)) {
      setError("Unit cost must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderData: CreateOrderPurchaseParams = {
        supplier_id: supplierId,
        storage_type_id: storageTypeId,
        store_id: storeId,
        items: items.map((item) => ({
          product_id: item.product_id,
          unit_of_issue: item.unit_of_issue,
          unit_cost: item.unit_cost,
        })),
      };

      const error = await createPurchaseOrder(orderData);

      if (!error) {
        toast.success("Purchasable order created successfully!");
        navigate("/purchasable-orders");
      } else {
        setError(
          error || "Failed to create purchasable order. Please try again."
        );
      }
    } catch (err) {
      console.error("Error creating purchasable order:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/purchasable-orders");
  };

  const getSelectedProduct = (productId: number) => {
    return purchasables.find((p) => p.id === productId);
  };

  const getSelectedSupplier = (supplierId: string) => {
    return suppliers.find((s) => s.id === supplierId);
  };

  const getSelectedStore = (storeId: string) => {
    return stores.find((s) => s.id === storeId);
  };

  const getSelectedStorageType = (storageTypeId: string) => {
    return storageTypes.find((s) => s.id === storageTypeId);
  };

  // Helper function to normalize search terms
  const normalizeSearchTerm = (term: string): string => {
    return term.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  // Helper function to check if text matches search term
  const matchesSearch = (text: string, searchTerm: string): boolean => {
    if (!searchTerm.trim()) return true;
    const normalizedText = normalizeSearchTerm(text);
    const normalizedSearch = normalizeSearchTerm(searchTerm);
    return normalizedText.includes(normalizedSearch);
  };

  // Filter products based on search (case-insensitive) - this will be used per item
  const getFilteredProducts = (searchTerm: string) => {
    if (!searchTerm.trim()) return purchasables;
    
    return purchasables.filter(
    (product) =>
        matchesSearch(product.name, searchTerm) ||
        matchesSearch(product.description || '', searchTerm) ||
        matchesSearch(product.unit_type || '', searchTerm)
    );
  };

  // Filter suppliers based on search (case-insensitive)
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      matchesSearch(supplier.full_name, debouncedSupplierSearch) ||
      matchesSearch(supplier.email || '', debouncedSupplierSearch) ||
      matchesSearch(supplier.phone_number || '', debouncedSupplierSearch) ||
      matchesSearch(supplier.address || '', debouncedSupplierSearch)
  );

  return (
    <div className="p-8 font-lato">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Purchasable Order
            </h1>
            <p className="text-gray-600 mt-1">
              Create a new purchasable order with supplier and items.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Supplier Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Supplier *</Label>
            <div className="space-y-2">
              <Dialog
                open={supplierDialogOpen}
                onOpenChange={setSupplierDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-14 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-red-300 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      {supplierId && getSelectedSupplier(supplierId) ? (
                        <>
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-red-600 font-semibold text-sm">
                              {getSelectedSupplier(supplierId)?.full_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              {getSelectedSupplier(supplierId)?.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {getSelectedSupplier(supplierId)?.email}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-500">
                              Select supplier...
                            </div>
                            <div className="text-sm text-gray-400">
                              Choose a supplier for this order
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <ChevronDownIcon className="ml-2 h-5 w-5 shrink-0 text-gray-400" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      Select Supplier
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Choose a supplier for this order from the list below
                    </DialogDescription>
                  </DialogHeader>
                  <Command className="bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center border-b border-gray-200 px-4 py-3">
                      <Search className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                      <CommandInput
                        placeholder="Search suppliers by name or email..."
                  value={supplierSearch}
                        onValueChange={setSupplierSearch}
                        className="border-0 focus:ring-0 text-base"
                />
              </div>
                    <CommandList className="max-h-80 overflow-y-auto">
                      <CommandEmpty className="py-8 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">
                          No supplier found
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Try adjusting your search terms
                        </p>
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredSuppliers.map((supplier) => (
                          <CommandItem
                            key={supplier.id}
                            value={supplier.id}
                            onSelect={() => {
                              setSupplierId(supplier.id);
                              setSupplierDialogOpen(false);
                              setSupplierSearch("");
                            }}
                            className="px-4 py-3 hover:bg-red-50 cursor-pointer"
                          >
                            <div className="flex items-center w-full">
                              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-red-600 font-semibold text-sm">
                                  {supplier.full_name.charAt(0).toUpperCase()}
                          </span>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {supplier.full_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {supplier.email}
                                </div>
                              </div>
                              <div className="w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Store Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Store *</Label>
            <div className="space-y-2">
              <Dialog
                open={storeDialogOpen}
                onOpenChange={setStoreDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-14 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      {storeId && getSelectedStore(storeId) ? (
                        <>
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">
                              {getSelectedStore(storeId)?.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              {getSelectedStore(storeId)?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {getSelectedStore(storeId)?.address}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-500">
                              Select store...
                            </div>
                            <div className="text-sm text-gray-400">
                              Choose a store for this order
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <ChevronDownIcon className="ml-2 h-5 w-5 shrink-0 text-gray-400" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      Select Store
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Choose a store for this order from the list below
                    </DialogDescription>
                  </DialogHeader>
                  <Command className="bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center border-b border-gray-200 px-4 py-3">
                      <Search className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                      <CommandInput
                        placeholder="Search stores by name or address..."
                        value={storeSearch}
                        onValueChange={setStoreSearch}
                        className="border-0 focus:ring-0 text-base"
                      />
                    </div>
                    <CommandList className="max-h-80 overflow-y-auto">
                      <CommandEmpty className="py-8 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">
                          No store found
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Try adjusting your search terms
                        </p>
                      </CommandEmpty>
                      <CommandGroup>
                        {stores
                          .filter((s) =>
                            matchesSearch(s.name, storeSearch) ||
                            matchesSearch(s.address || '', storeSearch) ||
                            matchesSearch(s.description || '', storeSearch)
                          )
                          .map((store) => (
                            <CommandItem
                              key={store.id}
                              value={store.id}
                              onSelect={() => {
                                setStoreId(store.id);
                                setStoreDialogOpen(false);
                                setStoreSearch("");
                              }}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer"
                            >
                              <div className="flex items-center w-full">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-blue-600 font-semibold text-sm">
                                    {store.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {store.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {store.address}
                                  </div>
                                </div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Storage Type Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Storage Type *</Label>
            <div className="space-y-2">
              <Dialog
                open={storageTypeDialogOpen}
                onOpenChange={setStorageTypeDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-14 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      {storageTypeId && getSelectedStorageType(storageTypeId) ? (
                        <>
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-green-600 font-semibold text-sm">
                              {getSelectedStorageType(storageTypeId)?.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              {getSelectedStorageType(storageTypeId)?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {getSelectedStorageType(storageTypeId)?.description}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-500">
                              Select storage type...
                            </div>
                            <div className="text-sm text-gray-400">
                              Choose a storage type for this order
                            </div>
                          </div>
                </div>
              )}
                    </div>
                    <ChevronDownIcon className="ml-2 h-5 w-5 shrink-0 text-gray-400" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      Select Storage Type
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Choose a storage type for this order from the list below
                    </DialogDescription>
                  </DialogHeader>
                  <Command className="bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center border-b border-gray-200 px-4 py-3">
                      <Search className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                      <CommandInput
                        placeholder="Search storage types by name or description..."
                        value={storageTypeSearch}
                        onValueChange={setStorageTypeSearch}
                        className="border-0 focus:ring-0 text-base"
                      />
                    </div>
                    <CommandList className="max-h-80 overflow-y-auto">
                      <CommandEmpty className="py-8 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">
                          No storage type found
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Try adjusting your search terms
                        </p>
                      </CommandEmpty>
                      <CommandGroup>
                        {storageTypes
                          .filter((s) =>
                            matchesSearch(s.name, storageTypeSearch) ||
                            matchesSearch(s.description || '', storageTypeSearch)
                          )
                          .map((storageType) => (
                            <CommandItem
                              key={storageType.id}
                              value={storageType.id}
                              onSelect={() => {
                                setStorageTypeId(storageType.id);
                                setStorageTypeDialogOpen(false);
                                setStorageTypeSearch("");
                              }}
                              className="px-4 py-3 hover:bg-green-50 cursor-pointer"
                            >
                              <div className="flex items-center w-full">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-green-600 font-semibold text-sm">
                                    {storageType.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {storageType.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {storageType.description}
                                  </div>
                                </div>
                                <div className="w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Order Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    Item {index + 1}
                  </h4>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Product Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Product *</Label>
                    <Dialog
                      open={productDialogOpen[index] || false}
                      onOpenChange={(open) =>
                        setProductDialogOpen((prev) => ({
                          ...prev,
                          [index]: open,
                        }))
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between h-12 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-red-300 transition-colors duration-200"
                        >
                          <div className="flex items-center">
                            {item.product_id > 0 && getSelectedProduct(item.product_id) ? (
                              <>
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-red-600 font-semibold text-xs">
                                    {getSelectedProduct(item.product_id)?.name.charAt(0).toUpperCase()}
                                </span>
                                </div>
                                <div className="text-left">
                                  <div className="font-medium text-gray-900">
                                    {getSelectedProduct(item.product_id)?.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {getSelectedProduct(item.product_id)?.unit_type}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                  <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                  </svg>
                                </div>
                                <div className="text-left">
                                  <div className="font-medium text-gray-500">
                                    Select product...
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    Choose a product for this item
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-semibold text-gray-900">
                            Select Product
                          </DialogTitle>
                          <DialogDescription className="text-gray-600">
                            Choose a product for this order item from the list below
                          </DialogDescription>
                        </DialogHeader>
                        <Command className="bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center border-b border-gray-200 px-4 py-3">
                            <Search className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                            <CommandInput
                              placeholder="Search products by name..."
                              value={productSearch[index] || ""}
                              onValueChange={(value) =>
                                setProductSearch((prev) => ({
                                  ...prev,
                                  [index]: value,
                                }))
                              }
                              className="border-0 focus:ring-0 text-base"
                            />
                          </div>
                          <CommandList className="max-h-80 overflow-y-auto">
                            <CommandEmpty className="py-8 text-center">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                  />
                                </svg>
                              </div>
                              <p className="text-gray-500 font-medium">
                                No product found
                              </p>
                              <p className="text-sm text-gray-400 mt-1">
                                Try adjusting your search terms
                              </p>
                            </CommandEmpty>
                            <CommandGroup>
                              {getFilteredProducts(productSearch[index] || "").map((product) => (
                                <CommandItem
                                  key={product.id}
                                  value={product.id.toString()}
                                  onSelect={() => {
                                    updateItem(index, "product_id", product.id);
                                    setProductDialogOpen((prev) => ({
                                      ...prev,
                                      [index]: false,
                                    }));
                                    setProductSearch((prev) => ({
                                      ...prev,
                                      [index]: "",
                                    }));
                                  }}
                                  className="px-4 py-3 hover:bg-red-50 cursor-pointer"
                                >
                                  <div className="flex items-center w-full">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-red-600 font-semibold text-sm">
                                        {product.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">
                                        {product.name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {product.unit_type}
                                      </div>
                                    </div>
                                    <div className="w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Unit of Issue */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Unit of Issue *
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={item.unit_of_issue || ""}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "unit_of_issue",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Unit Cost */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Unit Cost *</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={item.unit_cost || ""}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "unit_cost",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Total for this item */}
                {item.unit_of_issue > 0 && item.unit_cost > 0 && (
                  <div className="text-sm text-gray-600">
                    Total: ${(item.unit_of_issue * item.unit_cost).toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Order Summary */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Number of Items:</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Cost:</span>
                  <span className="font-medium">
                    $
                    {items
                      .reduce(
                        (total, item) =>
                          total + item.unit_of_issue * item.unit_cost,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? "Creating..." : "Create Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
