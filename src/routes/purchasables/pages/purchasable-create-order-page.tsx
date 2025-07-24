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
  Plus,
  Trash2,
  Search,
  ChevronDownIcon,
  RefreshCw,
  Truck,
  Store,
  Package,
  ShoppingCart,
} from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [productSearch, setProductSearch] = useState<{ [key: number]: string }>(
    {}
  );
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

    if (items.some((item) => item.unit_cost < 0)) {
      setError("Unit cost cannot be negative");
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
    return term.toLowerCase().trim().replace(/\s+/g, " ");
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
        matchesSearch(product.description || "", searchTerm) ||
        matchesSearch(product.unit_type || "", searchTerm)
    );
  };

  // Filter suppliers based on search (case-insensitive)
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      matchesSearch(supplier.full_name, debouncedSupplierSearch) ||
      matchesSearch(supplier.email || "", debouncedSupplierSearch) ||
      matchesSearch(supplier.phone_number || "", debouncedSupplierSearch) ||
      matchesSearch(supplier.address || "", debouncedSupplierSearch)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-4 px-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Create Purchase Order
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Create a new purchase order with supplier and product details
                </p>
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2 bg-[#F10027] hover:bg-[#F10027]/90 text-white font-semibold"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Order
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Configuration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Supplier Selection Card */}
          <Card className="border-2 hover:border-[#F10027]/20 transition-all duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-[#F10027]/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-[#F10027]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                Supplier
              </CardTitle>
              <CardDescription>
                Select the supplier for this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog
                open={supplierDialogOpen}
                onOpenChange={setSupplierDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-16 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#F10027]/30 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      {supplierId && getSelectedSupplier(supplierId) ? (
                        <>
                          <div className="w-12 h-12 bg-[#F10027]/10 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-[#F10027] font-bold text-lg">
                              {getSelectedSupplier(supplierId)
                                ?.full_name.charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">
                              {getSelectedSupplier(supplierId)?.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {getSelectedSupplier(supplierId)?.email}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                            <svg
                              className="h-6 w-6 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-500">
                              Select supplier...
                            </div>
                            <div className="text-sm text-gray-400">
                              Choose supplier for order
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
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
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center border-b border-gray-200 px-4 py-3 bg-gray-50/50">
                      <Search className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                      <Input
                        placeholder="Search suppliers by name, email, or phone..."
                        value={supplierSearch}
                        onChange={(e) => setSupplierSearch(e.target.value)}
                        className="border-0 focus:ring-0 text-base shadow-none bg-transparent"
                      />
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {filteredSuppliers.length === 0 ? (
                        <div className="py-12 text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-900 font-semibold text-lg mb-1">
                            No suppliers found
                          </p>
                          <p className="text-gray-500 text-sm">
                            Try adjusting your search terms or check your
                            spelling
                          </p>
                        </div>
                      ) : (
                        <div className="py-2">
                          {filteredSuppliers.map((supplier) => (
                            <button
                              key={supplier.id}
                              className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50/50 border-l-4 border-transparent hover:border-red-500 transition-all duration-200 cursor-pointer text-left"
                              onClick={() => {
                                setSupplierId(supplier.id);
                                setSupplierDialogOpen(false);
                                setSupplierSearch("");
                              }}
                            >
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                  <Truck className="w-6 h-6 text-red-600" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 text-base mb-1">
                                  {supplier.full_name}
                                </div>
                                <div className="text-sm text-gray-600 flex items-center space-x-4">
                                  {supplier.email && (
                                    <span className="flex items-center">
                                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                                      {supplier.email}
                                    </span>
                                  )}
                                  {supplier.phone_number && (
                                    <span className="flex items-center">
                                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                                      {supplier.phone_number}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ChevronDownIcon className="w-5 h-5 text-gray-400 transform rotate-[-90deg]" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Store Selection Card */}
          <Card className="border-2 hover:border-blue-200 transition-all duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-blue-600"
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
                Store
              </CardTitle>
              <CardDescription>
                Select the store where the order will be delivered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={storeDialogOpen} onOpenChange={setStoreDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-16 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      {storeId && getSelectedStore(storeId) ? (
                        <>
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-blue-600 font-bold text-lg">
                              {getSelectedStore(storeId)
                                ?.name.charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">
                              {getSelectedStore(storeId)?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {getSelectedStore(storeId)?.address}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                            <svg
                              className="h-6 w-6 text-gray-400"
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
                              Choose store for order
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
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
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center border-b border-gray-200 px-4 py-3 bg-gray-50/50">
                      <Search className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                      <Input
                        placeholder="Search stores by name, address, or description..."
                        value={storeSearch}
                        onChange={(e) => setStoreSearch(e.target.value)}
                        className="border-0 focus:ring-0 text-base shadow-none bg-transparent"
                      />
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {stores.filter(
                        (s) =>
                          matchesSearch(s.name, storeSearch) ||
                          matchesSearch(s.address || "", storeSearch) ||
                          matchesSearch(s.description || "", storeSearch)
                      ).length === 0 ? (
                        <div className="py-12 text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-900 font-semibold text-lg mb-1">
                            No stores found
                          </p>
                          <p className="text-gray-500 text-sm">
                            Try adjusting your search terms or check your
                            spelling
                          </p>
                        </div>
                      ) : (
                        <div className="py-2">
                          {stores
                            .filter(
                              (s) =>
                                matchesSearch(s.name, storeSearch) ||
                                matchesSearch(s.address || "", storeSearch) ||
                                matchesSearch(s.description || "", storeSearch)
                            )
                            .map((store) => (
                              <button
                                key={store.id}
                                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-blue-50/50 border-l-4 border-transparent hover:border-blue-500 transition-all duration-200 cursor-pointer text-left"
                                onClick={() => {
                                  setStoreId(store.id);
                                  setStoreDialogOpen(false);
                                  setStoreSearch("");
                                }}
                              >
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Store className="w-6 h-6 text-blue-600" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-gray-900 text-base mb-1">
                                    {store.name}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {store.address}
                                  </div>
                                </div>
                                <ChevronDownIcon className="w-5 h-5 text-gray-400 transform rotate-[-90deg]" />
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Storage Type Selection Card */}
          <Card className="border-2 hover:border-green-200 transition-all duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-green-600"
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
                Storage Type
              </CardTitle>
              <CardDescription>
                Select the type of storage for the order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog
                open={storageTypeDialogOpen}
                onOpenChange={setStorageTypeDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-16 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      {storageTypeId &&
                      getSelectedStorageType(storageTypeId) ? (
                        <>
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-green-600 font-bold text-lg">
                              {getSelectedStorageType(storageTypeId)
                                ?.name.charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">
                              {getSelectedStorageType(storageTypeId)?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {
                                getSelectedStorageType(storageTypeId)
                                  ?.description
                              }
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                            <svg
                              className="h-6 w-6 text-gray-400"
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
                              Choose storage type for order
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
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
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center border-b border-gray-200 px-4 py-3 bg-gray-50/50">
                      <Search className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                      <Input
                        placeholder="Search storage types by name or description..."
                        value={storageTypeSearch}
                        onChange={(e) => setStorageTypeSearch(e.target.value)}
                        className="border-0 focus:ring-0 text-base shadow-none bg-transparent"
                      />
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {storageTypes.filter(
                        (s) =>
                          matchesSearch(s.name, storageTypeSearch) ||
                          matchesSearch(s.description || "", storageTypeSearch)
                      ).length === 0 ? (
                        <div className="py-12 text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-900 font-semibold text-lg mb-1">
                            No storage types found
                          </p>
                          <p className="text-gray-500 text-sm">
                            Try adjusting your search terms or check your
                            spelling
                          </p>
                        </div>
                      ) : (
                        <div className="py-2">
                          {storageTypes
                            .filter(
                              (s) =>
                                matchesSearch(s.name, storageTypeSearch) ||
                                matchesSearch(
                                  s.description || "",
                                  storageTypeSearch
                                )
                            )
                            .map((storageType) => (
                              <button
                                key={storageType.id}
                                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-green-50/50 border-l-4 border-transparent hover:border-green-500 transition-all duration-200 cursor-pointer text-left"
                                onClick={() => {
                                  setStorageTypeId(storageType.id);
                                  setStorageTypeDialogOpen(false);
                                  setStorageTypeSearch("");
                                }}
                              >
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <Package className="w-6 h-6 text-green-600" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-gray-900 text-base mb-1">
                                    {storageType.name}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {storageType.description}
                                  </div>
                                </div>
                                <ChevronDownIcon className="w-5 h-5 text-gray-400 transform rotate-[-90deg]" />
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Order Items Section */}
        <Card className="border-2 border-[#F10027]/20 bg-[#F10027]/5">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-12 h-12 bg-[#F10027]/10 rounded-xl flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-[#F10027]"
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
              <div>
                <div>Order Items</div>
                <div className="text-sm font-normal text-gray-600">
                  Products and quantities for this order
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-[#F10027]/30 rounded-xl bg-white">
                <svg
                  className="h-12 w-12 text-[#F10027]/40 mx-auto mb-4"
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
                <p className="text-[#F10027] font-medium mb-2">
                  No items added yet
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Add products to create your order
                </p>
                <Button
                  onClick={addItem}
                  className="bg-[#F10027] hover:bg-[#F10027]/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item, index) => (
                  <Card
                    key={index}
                    className="border border-[#F10027]/20 bg-white"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <Label className="font-semibold text-gray-900 text-lg">
                          Item {index + 1}
                        </Label>
                        {items.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Product Selection */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Product *
                          </Label>
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
                                className="w-full justify-between h-12 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#F10027]/30 transition-colors duration-200"
                              >
                                <div className="flex items-center">
                                  {item.product_id > 0 &&
                                  getSelectedProduct(item.product_id) ? (
                                    <>
                                      <div className="w-8 h-8 bg-[#F10027]/10 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-[#F10027] font-semibold text-xs">
                                          {getSelectedProduct(item.product_id)
                                            ?.name.charAt(0)
                                            .toUpperCase()}
                                        </span>
                                      </div>
                                      <div className="text-left">
                                        <div className="font-medium text-gray-900 text-sm">
                                          {
                                            getSelectedProduct(item.product_id)
                                              ?.name
                                          }
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {
                                            getSelectedProduct(item.product_id)
                                              ?.unit_type
                                          }
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
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
                                        <div className="font-medium text-gray-500 text-sm">
                                          Select product...
                                        </div>
                                      </div>
                                    </>
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
                                  Choose a product for this order item
                                </DialogDescription>
                              </DialogHeader>
                              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center border-b border-gray-200 px-4 py-3 bg-gray-50/50">
                                  <Search className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                                  <Input
                                    placeholder="Search products by name or description..."
                                    value={productSearch[index] || ""}
                                    onChange={(e) =>
                                      setProductSearch((prev) => ({
                                        ...prev,
                                        [index]: e.target.value,
                                      }))
                                    }
                                    className="border-0 focus:ring-0 text-base shadow-none bg-transparent"
                                  />
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                  {getFilteredProducts(
                                    productSearch[index] || ""
                                  ).length === 0 ? (
                                    <div className="py-12 text-center">
                                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-gray-400" />
                                      </div>
                                      <p className="text-gray-900 font-semibold text-lg mb-1">
                                        No products found
                                      </p>
                                      <p className="text-gray-500 text-sm">
                                        Try adjusting your search terms or check
                                        your spelling
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="py-2">
                                      {getFilteredProducts(
                                        productSearch[index] || ""
                                      ).map((product) => (
                                        <button
                                          key={product.id}
                                          className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-[#F10027]/5 border-l-4 border-transparent hover:border-[#F10027] transition-all duration-200 cursor-pointer text-left"
                                          onClick={() => {
                                            updateItem(
                                              index,
                                              "product_id",
                                              product.id
                                            );
                                            setProductDialogOpen((prev) => ({
                                              ...prev,
                                              [index]: false,
                                            }));
                                          }}
                                        >
                                          <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-[#F10027]/10 rounded-full flex items-center justify-center">
                                              <ShoppingCart className="w-6 h-6 text-[#F10027]" />
                                            </div>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-gray-900 text-base mb-1">
                                              {product.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                              Unit: {product.unit_type}
                                            </div>
                                          </div>
                                          <ChevronDownIcon className="w-5 h-5 text-gray-400 transform rotate-[-90deg]" />
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        {/* Unit of Issue */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Unit of Issue *
                          </Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={
                              item.unit_of_issue === 0
                                ? "0"
                                : item.unit_of_issue || ""
                            }
                            onChange={(e) =>
                              updateItem(
                                index,
                                "unit_of_issue",
                                e.target.value === ""
                                  ? 0
                                  : parseFloat(e.target.value) || 0
                              )
                            }
                            min="0"
                            step="0.01"
                            className="h-12"
                          />
                        </div>

                        {/* Unit Cost */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Unit Cost *
                          </Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={
                              item.unit_cost === 0 ? "0" : item.unit_cost || ""
                            }
                            onChange={(e) =>
                              updateItem(
                                index,
                                "unit_cost",
                                e.target.value === ""
                                  ? 0
                                  : parseFloat(e.target.value) || 0
                              )
                            }
                            min="0"
                            step="0.01"
                            className="h-12"
                          />
                        </div>
                      </div>

                      {/* Total for this item */}
                      {item.unit_of_issue > 0 && item.unit_cost > 0 && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">
                            Total:{" "}
                            <span className="font-semibold text-gray-900">
                              $
                              {(item.unit_of_issue * item.unit_cost).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={addItem}
                  className="w-full border-[#F10027]/30 text-[#F10027] hover:bg-[#F10027]/5"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Item
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        {items.length > 0 && (
          <Card className="border-2 border-[#F10027]/20 bg-[#F10027]/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-12 h-12 bg-[#F10027]/10 rounded-xl flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-[#F10027]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F10027] mb-2">
                    {items.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Items</div>
                </div>
                <div className="flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-[#F10027]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F10027] mb-2">
                    $
                    {items
                      .reduce(
                        (total, item) =>
                          total + item.unit_of_issue * item.unit_cost,
                        0
                      )
                      .toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Cost</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
