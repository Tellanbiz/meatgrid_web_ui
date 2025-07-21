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
  Package,
  RefreshCw,
  Store,
  ChevronDown,
  Factory,
} from "lucide-react";
import { usePurchasables } from "../hooks/usePurchasables";
import { processPurchasable } from "../domain/purchasable-post";
import type {
  PurchasableProcessParams,
  PurchasableInventoryItemParams,
} from "../domain/process-models";
import { toast } from "sonner";

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

const PurchasableProcessStockPage = () => {
  const navigate = useNavigate();
  const {
    stores,
    storageTypes,
    purchasables,
    fetchStores,
    fetchStorageTypes,
    fetchPurchasables,
  } = usePurchasables();

  // Selection states
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedStorageType, setSelectedStorageType] =
    useState<StorageType | null>(null);

  // Materials and finished products
  const [materials, setMaterials] = useState<PurchasableInventoryItemParams[]>(
    []
  );
  const [finishedProducts, setFinishedProducts] = useState<
    PurchasableInventoryItemParams[]
  >([]);

  // Search states
  const [storeSearch, setStoreSearch] = useState("");
  const [storageTypeSearch, setStorageTypeSearch] = useState("");

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
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchStores();
    fetchStorageTypes();
    fetchPurchasables();
  }, [fetchStores, fetchStorageTypes, fetchPurchasables]);

  const handleAddMaterial = () => {
    setMaterials([...materials, { product_id: 0, unit_of_issue: 0 }]);
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleUpdateMaterial = (
    index: number,
    field: keyof PurchasableInventoryItemParams,
    value: number
  ) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    setMaterials(updatedMaterials);
  };

  const handleAddFinishedProduct = () => {
    setFinishedProducts([
      ...finishedProducts,
      { product_id: 0, unit_of_issue: 0 },
    ]);
  };

  const handleRemoveFinishedProduct = (index: number) => {
    setFinishedProducts(finishedProducts.filter((_, i) => i !== index));
  };

  const handleUpdateFinishedProduct = (
    index: number,
    field: keyof PurchasableInventoryItemParams,
    value: number
  ) => {
    const updatedProducts = [...finishedProducts];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setFinishedProducts(updatedProducts);
  };

  const handleProcess = async () => {
    if (!selectedStore || !selectedStorageType) {
      toast.error("Please select a store and storage type");
      return;
    }

    if (materials.length === 0) {
      toast.error("Please add at least one material");
      return;
    }

    if (finishedProducts.length === 0) {
      toast.error("Please add at least one finished product");
      return;
    }

    // Validate materials and products
    const invalidMaterials = materials.some(
      (m) => m.product_id === 0 || m.unit_of_issue <= 0
    );
    const invalidProducts = finishedProducts.some(
      (p) => p.product_id === 0 || p.unit_of_issue <= 0
    );

    if (invalidMaterials) {
      toast.error("Please select valid materials with quantities");
      return;
    }

    if (invalidProducts) {
      toast.error("Please select valid finished products with quantities");
      return;
    }

    setIsProcessing(true);
    try {
      const params: PurchasableProcessParams = {
        store_id: selectedStore.id,
        storage_type_id: selectedStorageType.id,
        materials: materials.filter(
          (m) => m.product_id > 0 && m.unit_of_issue > 0
        ),
        finished_products: finishedProducts.filter(
          (p) => p.product_id > 0 && p.unit_of_issue > 0
        ),
      };

      const error = await processPurchasable(params);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Purchasable processing completed successfully!");
        navigate("/purchasable-stocks");
      }
    } catch (error) {
      toast.error("Failed to process purchasable");
      console.error("Processing error:", error);
    } finally {
      setIsProcessing(false);
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

  const getFilteredStores = () => {
    if (!storeSearch.trim()) return stores;

    const normalizedSearch = storeSearch.toLowerCase().trim();
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(normalizedSearch) ||
        (store.address &&
          store.address.toLowerCase().includes(normalizedSearch))
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-4 px-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Process Stock Center
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Convert raw materials into finished products through our
                  processing workflow
                </p>
              </div>
            </div>
            <Button
              onClick={handleProcess}
              disabled={
                isProcessing ||
                !selectedStore ||
                !selectedStorageType ||
                materials.length === 0 ||
                finishedProducts.length === 0
              }
              className="px-8 py-2 bg-[#F10027] hover:bg-[#F10027]/90 text-white font-semibold"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Factory className="mr-2 h-4 w-4" />
                  Process Stock
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
                Processing Store
              </CardTitle>
              <CardDescription>
                Select the store where processing will take place
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
                              Select processing store...
                            </div>
                            <div className="text-sm text-gray-400">
                              Choose where to conduct processing
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
                      Select Processing Store
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Choose the store where processing activities will take
                      place
                    </DialogDescription>
                  </DialogHeader>
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4">
                      <div className="flex items-center">
                        <input
                          type="text"
                          placeholder="Search stores by name or location..."
                          value={storeSearch}
                          onChange={(e) => setStoreSearch(e.target.value)}
                          className="border-0 focus:ring-0 text-base w-full"
                        />
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {getFilteredStores().length === 0 && (
                        <div className="py-8 text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Store className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">
                            No stores found
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Try adjusting your search terms
                          </p>
                        </div>
                      )}
                      {getFilteredStores().map((store) => (
                        <div
                          key={store.id}
                          className="px-4 py-3 hover:bg-[#F10027]/5 cursor-pointer"
                          onClick={() => {
                            setSelectedStore(store);
                            setStoreDialogOpen(false);
                            setStoreSearch("");
                          }}
                        >
                          <div className="flex items-center w-full">
                            <div className="w-10 h-10 bg-[#F10027]/10 rounded-full flex items-center justify-center mr-3">
                              <span className="text-[#F10027] font-semibold text-sm">
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
                          </div>
                        </div>
                      ))}
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
                Select the storage type for the processed output
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
                              Choose storage method for processed items
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
                      Choose how the processed items will be stored
                    </DialogDescription>
                  </DialogHeader>
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4">
                      <div className="flex items-center">
                        <input
                          type="text"
                          placeholder="Search storage types..."
                          value={storageTypeSearch}
                          onChange={(e) => setStorageTypeSearch(e.target.value)}
                          className="border-0 focus:ring-0 text-base w-full"
                        />
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {getFilteredStorageTypes().length === 0 && (
                        <div className="py-8 text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">
                            No storage types found
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Try adjusting your search terms
                          </p>
                        </div>
                      )}
                      {getFilteredStorageTypes().map((storageType) => (
                        <div
                          key={storageType.id}
                          className="px-4 py-3 hover:bg-[#F10027]/5 cursor-pointer"
                          onClick={() => {
                            setSelectedStorageType(storageType);
                            setStorageTypeDialogOpen(false);
                            setStorageTypeSearch("");
                          }}
                        >
                          <div className="flex items-center w-full">
                            <div className="w-10 h-10 bg-[#F10027]/10 rounded-full flex items-center justify-center mr-3">
                              <span className="text-[#F10027] font-semibold text-sm">
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Processing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Materials Section */}
          <Card className="border-2 border-orange-200 bg-orange-50/30">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-orange-600" />
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
                <div className="text-center py-12 border-2 border-dashed border-orange-300 rounded-xl bg-orange-50">
                  <Package className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                  <p className="text-orange-600 font-medium mb-2">
                    No materials added yet
                  </p>
                  <p className="text-sm text-orange-500 mb-4">
                    Add materials to start processing
                  </p>
                  <Button
                    onClick={handleAddMaterial}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Add First Material
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {materials.map((material, index) => (
                    <Card
                      key={index}
                      className="border border-orange-200 bg-white"
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
                            Remove
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Material
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
                                  className="w-full justify-between h-12 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-300 transition-colors duration-200"
                                >
                                  <div className="flex items-center">
                                    {material.product_id > 0 ? (
                                      <>
                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                          <span className="text-orange-600 font-semibold text-xs">
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
                                    Choose a material for processing
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="bg-white rounded-lg border border-gray-200">
                                  <div className="p-4">
                                    <div className="flex items-center">
                                      <input
                                        type="text"
                                        placeholder="Search materials by name..."
                                        className="border-0 focus:ring-0 text-base w-full"
                                      />
                                    </div>
                                  </div>
                                  <div className="max-h-80 overflow-y-auto">
                                    {purchasables.length === 0 && (
                                      <div className="py-8 text-center">
                                        <Package className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500 font-medium">
                                          No materials found
                                        </p>
                                      </div>
                                    )}
                                    {purchasables.map((purchasable) => (
                                      <div
                                        key={purchasable.id}
                                        className="px-4 py-3 hover:bg-orange-50 cursor-pointer"
                                        onClick={() => {
                                          handleUpdateMaterial(
                                            index,
                                            "product_id",
                                            purchasable.id
                                          );
                                          setMaterialDialogOpen((prev) => ({
                                            ...prev,
                                            [index]: false,
                                          }));
                                        }}
                                      >
                                        <div className="flex items-center w-full">
                                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-orange-600 font-semibold text-sm">
                                              {purchasable.name
                                                .charAt(0)
                                                .toUpperCase()}
                                            </span>
                                          </div>
                                          <div className="flex-1">
                                            <div className="font-medium text-gray-900">
                                              {purchasable.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              {purchasable.unit_type}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
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
                    className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    Add Another Material
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Finished Products Section */}
          <Card className="border-2 border-green-200 bg-green-50/30">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div>Finished Products</div>
                  <div className="text-sm font-normal text-gray-600">
                    Products to be created
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {finishedProducts.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-green-300 rounded-xl bg-green-50">
                  <Package className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-green-600 font-medium mb-2">
                    No products added yet
                  </p>
                  <p className="text-sm text-green-500 mb-4">
                    Add finished products to be created
                  </p>
                  <Button
                    onClick={handleAddFinishedProduct}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Add First Product
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {finishedProducts.map((product, index) => (
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
                            onClick={() => handleRemoveFinishedProduct(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
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
                                    {product.product_id > 0 ? (
                                      <>
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                          <span className="text-green-600 font-semibold text-xs">
                                            {getPurchasableName(
                                              product.product_id
                                            )
                                              ?.charAt(0)
                                              .toUpperCase()}
                                          </span>
                                        </div>
                                        <div className="text-left">
                                          <div className="font-medium text-gray-900 text-sm">
                                            {getPurchasableName(
                                              product.product_id
                                            )}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {getPurchasableUnitType(
                                              product.product_id
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
                                    Select Finished Product
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-600">
                                    Choose a finished product to be created
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="bg-white rounded-lg border border-gray-200">
                                  <div className="p-4">
                                    <div className="flex items-center">
                                      <input
                                        type="text"
                                        placeholder="Search products by name..."
                                        className="border-0 focus:ring-0 text-base w-full"
                                      />
                                    </div>
                                  </div>
                                  <div className="max-h-80 overflow-y-auto">
                                    {purchasables.length === 0 && (
                                      <div className="py-8 text-center">
                                        <Package className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500 font-medium">
                                          No products found
                                        </p>
                                      </div>
                                    )}
                                    {purchasables.map((purchasable) => (
                                      <div
                                        key={purchasable.id}
                                        className="px-4 py-3 hover:bg-green-50 cursor-pointer"
                                        onClick={() => {
                                          handleUpdateFinishedProduct(
                                            index,
                                            "product_id",
                                            purchasable.id
                                          );
                                          setProductDialogOpen((prev) => ({
                                            ...prev,
                                            [index]: false,
                                          }));
                                        }}
                                      >
                                        <div className="flex items-center w-full">
                                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-green-600 font-semibold text-sm">
                                              {purchasable.name
                                                .charAt(0)
                                                .toUpperCase()}
                                            </span>
                                          </div>
                                          <div className="flex-1">
                                            <div className="font-medium text-gray-900">
                                              {purchasable.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              Unit: {purchasable.unit_type}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
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
                                handleUpdateFinishedProduct(
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
                    onClick={handleAddFinishedProduct}
                    className="w-full border-green-300 text-green-600 hover:bg-green-50"
                  >
                    Add Another Product
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Processing Summary */}
        {(materials.length > 0 || finishedProducts.length > 0) && (
          <Card className="border-2 border-[#F10027]/20 bg-[#F10027]/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-12 h-12 bg-[#F10027]/10 rounded-xl flex items-center justify-center">
                  <Factory className="h-6 w-6 text-[#F10027]" />
                </div>
                Processing Summary
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
                    {finishedProducts.length}
                  </div>
                  <div className="text-sm text-gray-600">Finished Products</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PurchasableProcessStockPage;
