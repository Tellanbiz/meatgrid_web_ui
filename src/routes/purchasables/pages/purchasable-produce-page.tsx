import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Factory,
  RefreshCw,
  Store,
  Plus,
  X,
  ChevronDown,
  Search,
  Package,
  Truck,
  ShoppingCart,
} from "lucide-react";
import { usePurchasables } from "../hooks/usePurchasables";
import { produceProducts } from "../domain/purchasable-post";
import type { PurchasableProductionParams } from "../domain/process-models";
import { toast } from "sonner";
// Import product-related modules
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/features/products/productThunks";
import { selectProducts } from "@/store/features/products/productSelectors";

interface Store {
  id: string;
  name: string;
  address: string;
  description?: string;
}

interface StorageType {
  id: string;
  name: string;
  description?: string;
}

const PurchasableProducePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    stores,
    storageTypes,
    purchasables,
    fetchStores,
    fetchStorageTypes,
    fetchPurchasables,
  } = usePurchasables();

  // Get products from the products store
  const products = useAppSelector(selectProducts);

  // Selection states
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedStorageType, setSelectedStorageType] =
    useState<StorageType | null>(null);

  // Materials (purchasables) and products (actual products)
  const [materials, setMaterials] = useState<
    { product_id: number; unit_of_issue: number }[]
  >([]);
  const [outputProducts, setOutputProducts] = useState<
    { product_id: string; unit_of_issue: number }[]
  >([]);

  // Search states
  const [storeSearch, setStoreSearch] = useState("");
  const [storageTypeSearch, setStorageTypeSearch] = useState("");
  const [materialSearch, setMaterialSearch] = useState<{
    [key: number]: string;
  }>({});
  const [productSearch, setProductSearch] = useState<{ [key: number]: string }>(
    {}
  );

  // Dialog states
  const [storeDialogOpen, setStoreDialogOpen] = useState(false);
  const [storageTypeDialogOpen, setStorageTypeDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState<{
    [key: number]: boolean;
  }>({});
  const [productDialogOpen, setProductDialogOpen] = useState<{
    [key: number]: boolean;
  }>({});

  // Loading states
  const [isProducing, setIsProducing] = useState(false);

  // Date states
  const [frozenAt, setFrozenAt] = useState("");
  const [chilledAt, setChilledAt] = useState("");
  const [manufacturedAt, setManufacturedAt] = useState("");

  // Fetch data on mount
  useEffect(() => {
    fetchStores();
    fetchStorageTypes();
    fetchPurchasables();
    dispatch(fetchProducts());
  }, [fetchStores, fetchStorageTypes, fetchPurchasables, dispatch]);

  const handleAddMaterial = () => {
    setMaterials([...materials, { product_id: 0, unit_of_issue: 0 }]);
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleUpdateMaterial = (
    index: number,
    field: "product_id" | "unit_of_issue",
    value: number
  ) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    setMaterials(updatedMaterials);
  };

  const handleAddProduct = () => {
    setOutputProducts([
      ...outputProducts,
      { product_id: "", unit_of_issue: 0 },
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    setOutputProducts(outputProducts.filter((_, i) => i !== index));
  };

  const handleUpdateProduct = (
    index: number,
    field: "product_id" | "unit_of_issue",
    value: string | number
  ) => {
    const updatedProducts = [...outputProducts];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setOutputProducts(updatedProducts);
  };

  const handleProduce = async () => {
    if (!selectedStore || !selectedStorageType) {
      toast.error("Please select a store and storage type");
      return;
    }

    if (materials.length === 0) {
      toast.error("Please add at least one material");
      return;
    }

    if (outputProducts.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    // Validate materials and products
    const invalidMaterials = materials.some(
      (m) => m.product_id === 0 || m.unit_of_issue <= 0
    );
    const invalidProducts = outputProducts.some(
      (p) => !p.product_id || p.unit_of_issue <= 0
    );

    if (invalidMaterials) {
      toast.error("Please select valid materials with quantities");
      return;
    }

    if (invalidProducts) {
      toast.error("Please select valid products with quantities");
      return;
    }

    setIsProducing(true);
    try {
      const params: PurchasableProductionParams = {
        store_id: selectedStore.id,
        storage_type_id: selectedStorageType.id,
        materials: materials.filter(
          (m) => m.product_id > 0 && m.unit_of_issue > 0
        ),
        products: outputProducts.filter(
          (p) => p.product_id && p.unit_of_issue > 0
        ),
        ...(frozenAt && { frozen_at: toUtcIsoString(frozenAt) }),
        ...(chilledAt && { chilled_at: toUtcIsoString(chilledAt) }),
        ...(manufacturedAt && {
          manufactured_at: toUtcIsoString(manufacturedAt),
        }),
      };

      const error = await produceProducts(params);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Products produced successfully!");
        navigate("/purchasable-stocks");
      }
    } catch (error) {
      toast.error("Failed to produce products");
      console.error("Production error:", error);
    } finally {
      setIsProducing(false);
    }
  };

  const getPurchasableName = (id: number) => {
    const purchasable = purchasables.find((p) => p.id === id);
    return purchasable?.name || "Unknown";
  };

  const getPurchasableUnitType = (id: number) => {
    const purchasable = purchasables.find((p) => p.id === id);
    return purchasable?.unit_type || "";
  };

  const getProductName = (id: string) => {
    const product = products.find((p) => p.id === id);
    return product?.name || "Unknown";
  };

  const getProductUnitType = (id: string) => {
    const product = products.find((p) => p.id === id);
    return product?.unit_type || "";
  };

  // Helper function to convert datetime-local to UTC ISO string
  const toUtcIsoString = (local: string): string | undefined => {
    if (!local) return undefined;
    // Add ':00' seconds if missing (datetime-local doesn't include seconds)
    const withSeconds = local.length === 16 ? local + ":00" : local;
    const date = new Date(withSeconds);
    return isNaN(date.getTime()) ? undefined : date.toISOString();
  };

  // Filter functions
  const getFilteredStores = () => {
    if (!storeSearch.trim()) return stores;

    const normalizedSearch = storeSearch.toLowerCase().trim();
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(normalizedSearch) ||
        (store.address &&
          store.address.toLowerCase().includes(normalizedSearch)) ||
        (store.description &&
          store.description.toLowerCase().includes(normalizedSearch))
    );
  };

  const getFilteredStorageTypes = () => {
    if (!storageTypeSearch.trim()) return storageTypes;

    const normalizedSearch = storageTypeSearch.toLowerCase().trim();
    return storageTypes.filter(
      (type) =>
        type.name.toLowerCase().includes(normalizedSearch) ||
        (type.description &&
          type.description.toLowerCase().includes(normalizedSearch))
    );
  };

  const getFilteredMaterials = (index: number) => {
    const searchTerm = materialSearch[index] || "";
    if (!searchTerm.trim()) return purchasables;

    const normalizedSearch = searchTerm.toLowerCase().trim();
    return purchasables.filter(
      (material) =>
        material.name.toLowerCase().includes(normalizedSearch) ||
        (material.unit_type &&
          material.unit_type.toLowerCase().includes(normalizedSearch))
    );
  };

  const getFilteredProducts = (index: number) => {
    const searchTerm = productSearch[index] || "";
    if (!searchTerm.trim()) return products;

    const normalizedSearch = searchTerm.toLowerCase().trim();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalizedSearch) ||
        (product.unit_type &&
          product.unit_type.toLowerCase().includes(normalizedSearch))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-4 px-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Production Center
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Transform purchasable materials into finished products with
                  our streamlined production workflow
                </p>
              </div>
            </div>
            <Button
              onClick={handleProduce}
              disabled={
                isProducing ||
                !selectedStore ||
                !selectedStorageType ||
                materials.length === 0 ||
                outputProducts.length === 0
              }
              className="px-8 py-2 bg-[#F10027] hover:bg-[#F10027]/90 text-white font-semibold"
            >
              {isProducing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Factory className="mr-2 h-4 w-4" />
                  Start Production
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Configuration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Store Selection Card */}
          <Card className="border-2 hover:border-[#F10027]/20 transition-all duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-[#F10027]/10 rounded-lg flex items-center justify-center">
                  <Store className="h-5 w-5 text-[#F10027]" />
                </div>
                Production Store
              </CardTitle>
              <CardDescription>
                Select the store where production will take place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={storeDialogOpen} onOpenChange={setStoreDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-16 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#F10027]/30 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      {selectedStore ? (
                        <>
                          <div className="w-12 h-12 bg-[#F10027]/10 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-[#F10027] font-bold text-lg">
                              {selectedStore.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">
                              {selectedStore.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {selectedStore.address}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                            <Store className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-500">
                              Select production store...
                            </div>
                            <div className="text-sm text-gray-400">
                              Choose where to conduct production
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      Select Production Store
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Choose the store where production activities will take
                      place
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
                      {getFilteredStores().length === 0 ? (
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
                          {getFilteredStores().map((store) => (
                            <button
                              key={store.id}
                              className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-[#F10027]/5 border-l-4 border-transparent hover:border-[#F10027] transition-all duration-200 cursor-pointer text-left"
                              onClick={() => {
                                setSelectedStore(store);
                                setStoreDialogOpen(false);
                                setStoreSearch("");
                              }}
                            >
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-[#F10027]/10 rounded-full flex items-center justify-center">
                                  <Store className="w-6 h-6 text-[#F10027]" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 text-base mb-1">
                                  {store.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {store.address || "No address specified"}
                                </div>
                              </div>
                              <ChevronDown className="w-5 h-5 text-gray-400 transform rotate-[-90deg]" />
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
          <Card className="border-2 hover:border-[#F10027]/20 transition-all duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-[#F10027]/10 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-[#F10027]" />
                </div>
                Storage Type
              </CardTitle>
              <CardDescription>
                Select the storage type for the production output
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
                    className="w-full justify-between h-16 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#F10027]/30 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      {selectedStorageType ? (
                        <>
                          <div className="w-12 h-12 bg-[#F10027]/10 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-[#F10027] font-bold text-lg">
                              {selectedStorageType.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">
                              {selectedStorageType.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {selectedStorageType.description}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-500">
                              Select storage type...
                            </div>
                            <div className="text-sm text-gray-400">
                              Choose storage method for products
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      Select Storage Type
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Choose how the produced items will be stored
                    </DialogDescription>
                  </DialogHeader>
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center border-b border-gray-200 px-4 py-3 bg-gray-50/50">
                      <Search className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                      <Input
                        placeholder="Search storage types..."
                        value={storageTypeSearch}
                        onChange={(e) => setStorageTypeSearch(e.target.value)}
                        className="border-0 focus:ring-0 text-base shadow-none bg-transparent"
                      />
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {getFilteredStorageTypes().length === 0 ? (
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
                          {getFilteredStorageTypes().map((storageType) => (
                            <button
                              key={storageType.id}
                              className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-[#F10027]/5 border-l-4 border-transparent hover:border-[#F10027] transition-all duration-200 cursor-pointer text-left"
                              onClick={() => {
                                setSelectedStorageType(storageType);
                                setStorageTypeDialogOpen(false);
                                setStorageTypeSearch("");
                              }}
                            >
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-[#F10027]/10 rounded-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-[#F10027]" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 text-base mb-1">
                                  {storageType.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {storageType.description || "No description"}
                                </div>
                              </div>
                              <ChevronDown className="w-5 h-5 text-gray-400 transform rotate-[-90deg]" />
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

        {/* Date Information Card */}
        <Card className="border-2 hover:border-[#F10027]/20 transition-all duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-10 h-10 bg-[#F10027]/10 rounded-lg flex items-center justify-center">
                <Factory className="h-5 w-5 text-[#F10027]" />
              </div>
              Production Dates
            </CardTitle>
            <CardDescription>
              Set the dates for different production stages (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Manufactured Date
                </Label>
                <Input
                  type="datetime-local"
                  value={manufacturedAt}
                  onChange={(e) => setManufacturedAt(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  When the products were manufactured
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Chilled Date
                </Label>
                <Input
                  type="datetime-local"
                  value={chilledAt}
                  onChange={(e) => setChilledAt(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  When the products were chilled
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Frozen Date
                </Label>
                <Input
                  type="datetime-local"
                  value={frozenAt}
                  onChange={(e) => setFrozenAt(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  When the products were frozen
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Production Process Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Materials Section */}
          <Card className="border-2 border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div>Input Materials</div>
                  <div className="text-sm font-normal text-gray-600">
                    Raw materials to be processed
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {materials.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50">
                  <Truck className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-blue-600 font-medium mb-2">
                    No materials added yet
                  </p>
                  <p className="text-sm text-blue-500 mb-4">
                    Add purchasable materials to start production
                  </p>
                  <Button
                    onClick={handleAddMaterial}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Material
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {materials.map((material, index) => (
                    <Card
                      key={index}
                      className="border border-blue-200 bg-white"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <Label className="font-semibold text-gray-900">
                            Material {index + 1}
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMaterial(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Purchasable
                            </Label>
                            <Dialog
                              open={materialDialogOpen[index] || false}
                              onOpenChange={(open) =>
                                setMaterialDialogOpen((prev) => ({
                                  ...prev,
                                  [index]: open,
                                }))
                              }
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between h-12 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-colors duration-200"
                                >
                                  <div className="flex items-center">
                                    {material.product_id > 0 ? (
                                      <>
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                          <span className="text-blue-600 font-semibold text-xs">
                                            {getPurchasableName(
                                              material.product_id
                                            )
                                              ?.charAt(0)
                                              .toUpperCase()}
                                          </span>
                                        </div>
                                        <div className="text-left">
                                          <div className="font-medium text-gray-900 text-sm">
                                            {getPurchasableName(
                                              material.product_id
                                            )}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {getPurchasableUnitType(
                                              material.product_id
                                            )}
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                          <Package className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <div className="text-left">
                                          <div className="font-medium text-gray-500 text-sm">
                                            Select material...
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-semibold text-gray-900">
                                    Select Material
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-600">
                                    Choose a purchasable material for production
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                  <div className="flex items-center border-b border-gray-200 px-4 py-3 bg-gray-50/50">
                                    <Search className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                                    <Input
                                      placeholder="Search materials by name..."
                                      value={materialSearch[index] || ""}
                                      onChange={(e) =>
                                        setMaterialSearch((prev) => ({
                                          ...prev,
                                          [index]: e.target.value,
                                        }))
                                      }
                                      className="border-0 focus:ring-0 text-base shadow-none bg-transparent"
                                    />
                                  </div>
                                  <div className="max-h-80 overflow-y-auto">
                                    {getFilteredMaterials(index).length ===
                                    0 ? (
                                      <div className="py-12 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                          <Search className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-900 font-semibold text-lg mb-1">
                                          No materials found
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                          Try adjusting your search terms or
                                          check your spelling
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="py-2">
                                        {getFilteredMaterials(index).map(
                                          (purchasable) => (
                                            <button
                                              key={purchasable.id}
                                              className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-blue-50 border-l-4 border-transparent cursor-pointer text-left"
                                              onClick={() => {
                                                handleUpdateMaterial(
                                                  index,
                                                  "product_id",
                                                  purchasable.id
                                                );
                                                setMaterialDialogOpen(
                                                  (prev) => ({
                                                    ...prev,
                                                    [index]: false,
                                                  })
                                                );
                                                setMaterialSearch((prev) => ({
                                                  ...prev,
                                                  [index]: "",
                                                }));
                                              }}
                                            >
                                              <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                  <span className="text-blue-600 font-semibold text-sm">
                                                    {purchasable.name
                                                      .charAt(0)
                                                      .toUpperCase()}
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900 text-base mb-1">
                                                  {purchasable.name}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                  {purchasable.unit_type}
                                                </div>
                                              </div>
                                              <ChevronDown className="w-5 h-5 text-gray-400 transform rotate-[-90deg]" />
                                            </button>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Quantity
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={material.unit_of_issue || ""}
                              onChange={(e) =>
                                handleUpdateMaterial(
                                  index,
                                  "unit_of_issue",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              placeholder="Enter quantity"
                              className="h-12"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    onClick={handleAddMaterial}
                    className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Material
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products Section */}
          <Card className="border-2 border-green-200 bg-green-50/30">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div>Output Products</div>
                  <div className="text-sm font-normal text-gray-600">
                    Finished products to be created
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {outputProducts.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-green-300 rounded-xl bg-green-50">
                  <ShoppingCart className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-green-600 font-medium mb-2">
                    No products added yet
                  </p>
                  <p className="text-sm text-green-500 mb-4">
                    Add products that will be created from materials
                  </p>
                  <Button
                    onClick={handleAddProduct}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Product
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {outputProducts.map((product, index) => (
                    <Card
                      key={index}
                      className="border border-green-200 bg-white"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <Label className="font-semibold text-gray-900">
                            Product {index + 1}
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProduct(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Product
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
                                  className="w-full justify-between h-12 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300 transition-colors duration-200"
                                >
                                  <div className="flex items-center">
                                    {product.product_id ? (
                                      <>
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                          <span className="text-green-600 font-semibold text-xs">
                                            {getProductName(product.product_id)
                                              ?.charAt(0)
                                              .toUpperCase()}
                                          </span>
                                        </div>
                                        <div className="text-left">
                                          <div className="font-medium text-gray-900 text-sm">
                                            {getProductName(product.product_id)}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {getProductUnitType(
                                              product.product_id
                                            )}
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                          <ShoppingCart className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <div className="text-left">
                                          <div className="font-medium text-gray-500 text-sm">
                                            Select product...
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-semibold text-gray-900">
                                    Select Product
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-600">
                                    Choose a product to be manufactured
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                  <div className="flex items-center border-b border-gray-200 px-4 py-3 bg-gray-50/50">
                                    <Search className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                                    <Input
                                      placeholder="Search products by name..."
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
                                    {getFilteredProducts(index).length === 0 ? (
                                      <div className="py-12 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                          <Search className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-900 font-semibold text-lg mb-1">
                                          No products found
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                          Try adjusting your search terms or
                                          check your spelling
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="py-2">
                                        {getFilteredProducts(index).map(
                                          (productItem) => (
                                            <button
                                              key={productItem.id}
                                              className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-green-50 border-l-4 border-transparent cursor-pointer text-left"
                                              onClick={() => {
                                                handleUpdateProduct(
                                                  index,
                                                  "product_id",
                                                  productItem.id
                                                );
                                                setProductDialogOpen(
                                                  (prev) => ({
                                                    ...prev,
                                                    [index]: false,
                                                  })
                                                );
                                                setProductSearch((prev) => ({
                                                  ...prev,
                                                  [index]: "",
                                                }));
                                              }}
                                            >
                                              <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                  <span className="text-green-600 font-semibold text-sm">
                                                    {productItem.name
                                                      .charAt(0)
                                                      .toUpperCase()}
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900 text-base mb-1">
                                                  {productItem.name}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                  {productItem.unit_type}
                                                </div>
                                              </div>
                                              <ChevronDown className="w-5 h-5 text-gray-400 transform rotate-[-90deg]" />
                                            </button>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Quantity
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={product.unit_of_issue || ""}
                              onChange={(e) =>
                                handleUpdateProduct(
                                  index,
                                  "unit_of_issue",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              placeholder="Enter quantity"
                              className="h-12"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    onClick={handleAddProduct}
                    className="w-full border-green-300 text-green-600 hover:bg-green-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Product
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Production Summary */}
        {(materials.length > 0 || outputProducts.length > 0) && (
          <Card className="border-2 border-[#F10027]/20 bg-[#F10027]/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-12 h-12 bg-[#F10027]/10 rounded-xl flex items-center justify-center">
                  <Factory className="h-6 w-6 text-[#F10027]" />
                </div>
                Production Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F10027] mb-2">
                    {materials.length}
                  </div>
                  <div className="text-sm text-gray-600">Input Materials</div>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-8 w-8 text-[#F10027]" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F10027] mb-2">
                    {outputProducts.length}
                  </div>
                  <div className="text-sm text-gray-600">Output Products</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PurchasableProducePage;
