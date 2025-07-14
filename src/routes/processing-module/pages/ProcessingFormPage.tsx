import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import { usePurchasables } from "@/routes/purchasables/hooks/usePurchasables";
import {
  getAvailableProductItems,
  getStorageTypes,
  getWarehouses,
} from "../domain/processing-get";
import { createBatch } from "../domain/processing-post";
import type { ProcessingParams, AvailableProductItem } from "../domain/data";
import type { StorageType } from "@/store/features/storages/storageTypes";
import type { Store } from "@/store/features/stores/storeTypes";

import { ChevronDownIcon, XIcon } from "lucide-react";
import ProductSelectionDialog from "@/components/dialogs/ProductSelectionDialog";

interface ProcessingFormPageProps {
  storeId?: string;
  storageTypeId?: string;
}

const ProcessingFormPage: React.FC<ProcessingFormPageProps> = ({
  storeId,
  storageTypeId,
}) => {
  const navigate = useNavigate();
  const { purchasables, fetchPurchasables } = usePurchasables();
  const [availableProducts, setAvailableProducts] = useState<
    AvailableProductItem[]
  >([]);
  const [storageTypes, setStorageTypes] = useState<StorageType[]>([]);
  const [warehouses, setWarehouses] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [purchasedProductDialogOpen, setPurchasedProductDialogOpen] =
    useState(false);
  const [processedProductDialogOpen, setProcessedProductDialogOpen] =
    useState(false);

  // Form data
  const [formData, setFormData] = useState<ProcessingParams>({
    store_id: storeId || "",
    storage_type_id: storageTypeId || "",
    manufactured_at: "",
    chilled_at: "",
    frozen_at: "",
    purchasable_product_items: [],
    processed_products: [],
  });

  // Selected items for display
  const [selectedWarehouse, setSelectedWarehouse] = useState<Store | null>(
    null
  );
  const [selectedStorageType, setSelectedStorageType] =
    useState<StorageType | null>(null);

  // Search states
  const [warehouseSearch, setWarehouseSearch] = useState("");
  const [storageTypeSearch, setStorageTypeSearch] = useState("");

  // Helper function to convert ISO date to date input value
  const getDateInputValue = (isoDate: string) => {
    if (!isoDate) return "";
    try {
      return new Date(isoDate).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  useEffect(() => {
    fetchPurchasables();
    fetchAvailableProducts();
    fetchStorageTypes();
    fetchWarehouses();
  }, [fetchPurchasables]);

  const fetchAvailableProducts = async () => {
    try {
      const products = await getAvailableProductItems();
      setAvailableProducts(products);
    } catch {
      toast.error("Failed to fetch available products");
    }
  };

  const fetchStorageTypes = async () => {
    try {
      const types = await getStorageTypes();
      setStorageTypes(types);
    } catch {
      toast.error("Failed to fetch storage types");
    }
  };

  const fetchWarehouses = async () => {
    try {
      const stores = await getWarehouses();
      setWarehouses(stores);
    } catch {
      toast.error("Failed to fetch warehouses");
    }
  };

  const handleInputChange = (
    field: keyof ProcessingParams,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const removePurchasedProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      purchasable_product_items: prev.purchasable_product_items.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const removeProcessedProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      processed_products: prev.processed_products.filter((_, i) => i !== index),
    }));
  };

  const getSelectedPurchasedProductName = (productId: number) => {
    const product = purchasables.find((p) => p.id === productId);
    return product
      ? `${product.name} (${product.unit_type})`
      : "Unknown Product";
  };

  const getSelectedProcessedProductName = (productId: string) => {
    const product = availableProducts.find((p) => p.id === productId);
    return product
      ? `${product.name} (${product.unit_type})`
      : "Unknown Product";
  };

  const getQuantityDisplayValue = (quantity: number, unitType: string) => {
    if (unitType.toLowerCase() === "kilograms") {
      // Format to remove unnecessary decimals
      const formatted =
        quantity % 1 === 0
          ? quantity.toString()
          : quantity.toFixed(2).replace(/\.?0+$/, "");
      return `${formatted} kg`;
    } else if (unitType.toLowerCase() === "grams") {
      if (quantity >= 1000) {
        const kgQuantity = quantity / 1000;
        const formatted =
          kgQuantity % 1 === 0
            ? kgQuantity.toString()
            : kgQuantity.toFixed(2).replace(/\.?0+$/, "");
        return `${formatted} kg`;
      } else {
        const formatted =
          quantity % 1 === 0
            ? quantity.toString()
            : quantity.toFixed(2).replace(/\.?0+$/, "");
        return `${formatted} g`;
      }
    }
    // For other unit types, format to remove unnecessary decimals
    const formatted =
      quantity % 1 === 0
        ? quantity.toString()
        : quantity.toFixed(2).replace(/\.?0+$/, "");
    return `${formatted} ${unitType}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.store_id ||
      !formData.storage_type_id ||
      !formData.manufactured_at
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.purchasable_product_items.length === 0) {
      toast.error("Please add at least one purchased product");
      return;
    }

    if (formData.processed_products.length === 0) {
      toast.error("Please add at least one processed product");
      return;
    }

    setLoading(true);
    try {
      const error = await createBatch(formData);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Batch created successfully");
        navigate("/batches");
      }
    } catch {
      toast.error("Failed to create batch");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
            Create New Batch
          </h1>
          <Button
            variant="outline"
            onClick={() => navigate("/batches")}
            className="text-sm"
          >
            Back to Batches
          </Button>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="h-full">
          {/* 3-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Column 1: Basic Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-700">Warehouse</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between mt-1 text-xs"
                      >
                        {selectedWarehouse ? (
                          <span className="truncate">
                            {selectedWarehouse.name.length > 30
                              ? `${selectedWarehouse.name.substring(0, 30)}...`
                              : selectedWarehouse.name}
                          </span>
                        ) : (
                          "Select warehouse..."
                        )}
                        <ChevronDownIcon className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <div className="flex items-center border-b px-3">
                          <SearchIcon className="mr-2 h-3 w-3 shrink-0 opacity-50" />
                          <CommandInput
                            placeholder="Search warehouses..."
                            value={warehouseSearch}
                            onValueChange={setWarehouseSearch}
                            className="border-0 focus:ring-0 text-xs"
                          />
                        </div>
                        <CommandList>
                          <CommandEmpty>No warehouse found.</CommandEmpty>
                          <CommandGroup>
                            {warehouses
                              .filter((w) =>
                                w.name
                                  .toLowerCase()
                                  .includes(warehouseSearch.toLowerCase())
                              )
                              .map((warehouse) => (
                                <CommandItem
                                  key={warehouse.id}
                                  value={warehouse.id.toString()}
                                  onSelect={() => {
                                    setSelectedWarehouse(warehouse);
                                    handleInputChange("store_id", warehouse.id);
                                  }}
                                  className="text-xs"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {warehouse.name}
                                    </span>
                                    {warehouse.address && (
                                      <span className="text-gray-500 text-xs truncate">
                                        {warehouse.address}
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
                  <Label className="text-xs text-gray-700">Storage Type</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between mt-1 text-xs"
                      >
                        {selectedStorageType
                          ? `${selectedStorageType.name} (${selectedStorageType.duration_type})`
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
                                    setSelectedStorageType(storageType);
                                    handleInputChange(
                                      "storage_type_id",
                                      storageType.id
                                    );
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
                    Manufactured Date
                  </Label>
                  <Input
                    type="date"
                    className="mt-1 text-xs"
                    value={getDateInputValue(formData.manufactured_at)}
                    onChange={(e) => {
                      // Convert date to ISO 8601 format with time
                      const date = new Date(e.target.value);
                      const isoString = date.toISOString();
                      handleInputChange("manufactured_at", isoString);
                    }}
                    required
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-700">Chilled At</Label>
                  <Input
                    type="date"
                    className="mt-1 text-xs"
                    value={getDateInputValue(formData.chilled_at)}
                    onChange={(e) => {
                      // Convert date to ISO 8601 format with time
                      const date = new Date(e.target.value);
                      const isoString = date.toISOString();
                      handleInputChange("chilled_at", isoString);
                    }}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-700">Frozen At</Label>
                  <Input
                    type="date"
                    className="mt-1 text-xs"
                    value={getDateInputValue(formData.frozen_at)}
                    onChange={(e) => {
                      // Convert date to ISO 8601 format with time
                      const date = new Date(e.target.value);
                      const isoString = date.toISOString();
                      handleInputChange("frozen_at", isoString);
                    }}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </div>

            {/* Column 2: Purchased Products */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                Purchased Products
              </h2>

              <div className="mb-4">
                <Label className="text-xs text-gray-700">
                  Add Purchased Product
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between mt-1 text-xs"
                  onClick={() => setPurchasedProductDialogOpen(true)}
                >
                  Select purchased product...
                  <ChevronDownIcon className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                </Button>

                <ProductSelectionDialog
                  open={purchasedProductDialogOpen}
                  onOpenChange={setPurchasedProductDialogOpen}
                  title="Select Purchased Product"
                  products={purchasables.map((p) => ({
                    id: p.id.toString(),
                    name: p.name,
                    unit_type: p.unit_type,
                    description: p.description,
                  }))}
                  onProductSelect={(product) => {
                    setFormData((prev) => ({
                      ...prev,
                      purchasable_product_items: [
                        ...prev.purchasable_product_items,
                        parseInt(product.id),
                      ],
                    }));
                  }}
                  showQuantityInput={false}
                  allowUnitConversion={false}
                  primaryButtonText="Add Product"
                  searchPlaceholder="Search purchased products..."
                />
              </div>

              {formData.purchasable_product_items.length > 0 && (
                <div className="space-y-3">
                  {formData.purchasable_product_items.map(
                    (productId, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="text-xs font-medium text-gray-900">
                            {getSelectedPurchasedProductName(productId)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePurchasedProduct(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Column 3: Processed Products */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                Processed Products
              </h2>

              <div className="mb-4">
                <Label className="text-xs text-gray-700">
                  Add Processed Product
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between mt-1 text-xs"
                  onClick={() => setProcessedProductDialogOpen(true)}
                >
                  Select processed product...
                  <ChevronDownIcon className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                </Button>

                <ProductSelectionDialog
                  open={processedProductDialogOpen}
                  onOpenChange={setProcessedProductDialogOpen}
                  title="Select Processed Product"
                  products={availableProducts}
                  onProductSelect={(product, quantity, unit) => {
                    // Convert quantity based on unit selection
                    let finalQuantity = quantity;
                    if (
                      unit === "kg" &&
                      product.unit_type.toLowerCase() === "grams"
                    ) {
                      finalQuantity = quantity * 1000;
                    }

                    setFormData((prev) => ({
                      ...prev,
                      processed_products: [
                        ...prev.processed_products,
                        {
                          product_id: product.id,
                          quantity: finalQuantity,
                        },
                      ],
                    }));
                  }}
                  showQuantityInput={true}
                  allowUnitConversion={true}
                  primaryButtonText="Add Product"
                  searchPlaceholder="Search processed products..."
                  quantityPlaceholder="Enter quantity"
                />
              </div>

              {formData.processed_products.length > 0 && (
                <div className="space-y-3">
                  {formData.processed_products.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900">
                          {getSelectedProcessedProductName(product.product_id)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getQuantityDisplayValue(
                            product.quantity,
                            availableProducts.find(
                              (p) => p.id === product.product_id
                            )?.unit_type || ""
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeProcessedProduct(index)}
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
              Create Batch
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcessingFormPage;
