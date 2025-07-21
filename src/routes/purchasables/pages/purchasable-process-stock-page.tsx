import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Package, RefreshCw, Store } from "lucide-react";
import { usePurchasables } from "../hooks/usePurchasables";
import { processPurchasable } from "../domain/purchasable-post";
import type { PurchasableProcessParams, PurchasableInventoryItemParams } from "../domain/process-models";
import { toast } from "sonner";

const PurchasableProcessStockPage = () => {
  const navigate = useNavigate();
  const { stores, storageTypes, purchasables, fetchStores, fetchStorageTypes, fetchPurchasables } = usePurchasables();
  
  // Selection states
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [selectedStorageType, setSelectedStorageType] = useState<string>("");
  
  // Materials and finished products
  const [materials, setMaterials] = useState<PurchasableInventoryItemParams[]>([]);
  const [finishedProducts, setFinishedProducts] = useState<PurchasableInventoryItemParams[]>([]);
  
  // Search states
  const [materialsSearch, setMaterialsSearch] = useState("");
  const [productsSearch, setProductsSearch] = useState("");
  
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

  const handleUpdateMaterial = (index: number, field: keyof PurchasableInventoryItemParams, value: number) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    setMaterials(updatedMaterials);
  };

  const handleAddFinishedProduct = () => {
    setFinishedProducts([...finishedProducts, { product_id: 0, unit_of_issue: 0 }]);
  };

  const handleRemoveFinishedProduct = (index: number) => {
    setFinishedProducts(finishedProducts.filter((_, i) => i !== index));
  };

  const handleUpdateFinishedProduct = (index: number, field: keyof PurchasableInventoryItemParams, value: number) => {
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
    const invalidMaterials = materials.some(m => m.product_id === 0 || m.unit_of_issue <= 0);
    const invalidProducts = finishedProducts.some(p => p.product_id === 0 || p.unit_of_issue <= 0);

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
        store_id: selectedStore,
        storage_type_id: selectedStorageType,
        materials: materials.filter(m => m.product_id > 0 && m.unit_of_issue > 0),
        finished_products: finishedProducts.filter(p => p.product_id > 0 && p.unit_of_issue > 0)
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
    const purchasable = purchasables.find(p => p.id === id);
    return purchasable?.name || "Unknown";
  };

  const getPurchasableUnitType = (id: number) => {
    const purchasable = purchasables.find(p => p.id === id);
    return purchasable?.unit_type || "";
  };

  // Filter purchasables based on search
  const getFilteredPurchasables = (searchTerm: string) => {
    if (!searchTerm.trim()) return purchasables;
    
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return purchasables.filter(purchasable =>
      purchasable.name.toLowerCase().includes(normalizedSearch) ||
      purchasable.description.toLowerCase().includes(normalizedSearch)
    );
  };

  const formatQuantity = (quantity: number, unitType: string) => {
    if ((unitType === "kilograms" || unitType === "kilogram") && quantity >= 1000) {
      const kgQuantity = quantity / 1000;
      return `${kgQuantity.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg`;
    }
    return `${quantity.toLocaleString()} ${unitType}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Process Purchasable Stock</h1>
          <p className="text-gray-600 mt-2">
            Convert raw materials into finished products
          </p>
        </div>

        {/* Store and Storage Type Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Processing Location
            </CardTitle>
            <CardDescription>
              Select the store and storage type for processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="store">Store</Label>
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger>
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
              <div>
                <Label htmlFor="storageType">Storage Type</Label>
                <Select value={selectedStorageType} onValueChange={setSelectedStorageType}>
                  <SelectTrigger>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Materials Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Materials (Input)
              </CardTitle>
              <CardDescription>
                Select materials to be processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Materials Search */}
              <div className="mb-4">
                <Label htmlFor="materials-search">Search Materials</Label>
                <Input
                  id="materials-search"
                  placeholder="Search by name or description..."
                  value={materialsSearch}
                  onChange={(e) => setMaterialsSearch(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="space-y-4">
                {materials.map((material, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Material {index + 1}</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMaterial(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Purchasable</Label>
                        <Select
                          value={material.product_id.toString()}
                          onValueChange={(value) => handleUpdateMaterial(index, 'product_id', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select purchasable" />
                          </SelectTrigger>
                          <SelectContent>
                            {getFilteredPurchasables(materialsSearch).length > 0 ? (
                              getFilteredPurchasables(materialsSearch).map((purchasable) => (
                                <SelectItem key={purchasable.id} value={purchasable.id.toString()}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{purchasable.name}</span>
                                    {purchasable.description && (
                                      <span className="text-xs text-gray-500">{purchasable.description}</span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-2 py-1 text-sm text-gray-500">
                                No purchasables found matching "{materialsSearch}"
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={material.unit_of_issue}
                          onChange={(e) => handleUpdateMaterial(index, 'unit_of_issue', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    {material.product_id > 0 && (
                      <div className="text-sm text-gray-600">
                        Unit: {getPurchasableUnitType(material.product_id)}
                      </div>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={handleAddMaterial}
                  className="w-full"
                >
                  Add Material
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Finished Products Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Finished Products (Output)
              </CardTitle>
              <CardDescription>
                Select finished products to be created
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Products Search */}
              <div className="mb-4">
                <Label htmlFor="products-search">Search Products</Label>
                <Input
                  id="products-search"
                  placeholder="Search by name or description..."
                  value={productsSearch}
                  onChange={(e) => setProductsSearch(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="space-y-4">
                {finishedProducts.map((product, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Product {index + 1}</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFinishedProduct(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Purchasable</Label>
                        <Select
                          value={product.product_id.toString()}
                          onValueChange={(value) => handleUpdateFinishedProduct(index, 'product_id', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select purchasable" />
                          </SelectTrigger>
                          <SelectContent>
                            {getFilteredPurchasables(productsSearch).length > 0 ? (
                              getFilteredPurchasables(productsSearch).map((purchasable) => (
                                <SelectItem key={purchasable.id} value={purchasable.id.toString()}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{purchasable.name}</span>
                                    {purchasable.description && (
                                      <span className="text-xs text-gray-500">{purchasable.description}</span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-2 py-1 text-sm text-gray-500">
                                No purchasables found matching "{productsSearch}"
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={product.unit_of_issue}
                          onChange={(e) => handleUpdateFinishedProduct(index, 'unit_of_issue', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    {product.product_id > 0 && (
                      <div className="text-sm text-gray-600">
                        Unit: {getPurchasableUnitType(product.product_id)}
                      </div>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={handleAddFinishedProduct}
                  className="w-full"
                >
                  Add Finished Product
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        {(materials.length > 0 || finishedProducts.length > 0) && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Processing Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Materials to Process:</h4>
                  <div className="space-y-2">
                    {materials.map((material, index) => (
                      material.product_id > 0 && (
                        <div key={index} className="flex justify-between items-center">
                          <span>{getPurchasableName(material.product_id)}</span>
                          <Badge variant="secondary">
                            {formatQuantity(material.unit_of_issue, getPurchasableUnitType(material.product_id))}
                          </Badge>
                        </div>
                      )
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Finished Products:</h4>
                  <div className="space-y-2">
                    {finishedProducts.map((product, index) => (
                      product.product_id > 0 && (
                        <div key={index} className="flex justify-between items-center">
                          <span>{getPurchasableName(product.product_id)}</span>
                          <Badge variant="default">
                            {formatQuantity(product.unit_of_issue, getPurchasableUnitType(product.product_id))}
                          </Badge>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={() => navigate("/purchasable-stocks")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProcess}
            disabled={isProcessing || !selectedStore || !selectedStorageType || materials.length === 0 || finishedProducts.length === 0}
            className="px-8"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Process Stock
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PurchasableProcessStockPage; 