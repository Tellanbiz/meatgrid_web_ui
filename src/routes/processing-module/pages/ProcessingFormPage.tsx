/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {  SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePurchasables } from '@/routes/purchasables/hooks/usePurchasables';
import { getAvailableProductItems, getStorageTypes, getWarehouses } from '../domain/processing-get';
import { createBatch } from '../domain/processing-post';
import { ProcessingParams, AvailableProductItem } from '../domain/data';
import { StorageType } from '@/store/features/storages/storageTypes';
import { Store } from '@/store/features/stores/storeTypes';
import {  ChevronDownIcon, XIcon } from 'lucide-react';

interface ProcessingFormPageProps {
  storeId?: string;
  storageTypeId?: string;
}

const ProcessingFormPage: React.FC<ProcessingFormPageProps> = ({
  storeId,
  storageTypeId,
}) => {
  const navigate = useNavigate();
  const { purchasables, loading: purchasablesLoading, fetchPurchasables } = usePurchasables();
  const [availableProducts, setAvailableProducts] = useState<AvailableProductItem[]>([]);
  const [storageTypes, setStorageTypes] = useState<StorageType[]>([]);
  const [warehouses, setWarehouses] = useState<Store[]>([]);
  const [availableProductsLoading, setAvailableProductsLoading] = useState(false);
  const [storageTypesLoading, setStorageTypesLoading] = useState(false);
  const [warehousesLoading, setWarehousesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Dialog states
  const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false);
  const [storageTypeDialogOpen, setStorageTypeDialogOpen] = useState(false);
  const [purchasedProductDialogOpen, setPurchasedProductDialogOpen] = useState(false);
  const [processedProductDialogOpen, setProcessedProductDialogOpen] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<ProcessingParams>({
    store_id: storeId || "",
    storage_type_id: storageTypeId || "",
    expiry_at: "",
    purchasable_product_items: [],
    processed_products: [],
  });

  // Selected items for display
  const [selectedWarehouse, setSelectedWarehouse] = useState<Store | null>(null);
  const [selectedStorageType, setSelectedStorageType] = useState<StorageType | null>(null);
  const [selectedPurchasedProduct, setSelectedPurchasedProduct] = useState<any>(null);
  const [selectedProcessedProduct, setSelectedProcessedProduct] = useState<AvailableProductItem | null>(null);
  const [processedProductQuantity, setProcessedProductQuantity] = useState(0);
  const [quantityUnit, setQuantityUnit] = useState<string>("base");

  // Search states
  const [warehouseSearch, setWarehouseSearch] = useState('');
  const [storageTypeSearch, setStorageTypeSearch] = useState('');
  const [purchasableSearch, setPurchasableSearch] = useState('');
  const [processedProductSearch, setProcessedProductSearch] = useState('');

  // Helper function to convert ISO date to date input value
  const getDateInputValue = (isoDate: string) => {
    if (!isoDate) return "";
    try {
      return new Date(isoDate).toISOString().split('T')[0];
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
      setAvailableProductsLoading(true);
      const products = await getAvailableProductItems();
      setAvailableProducts(products);
    } catch (error) {
      toast.error("Failed to fetch available products");
    } finally {
      setAvailableProductsLoading(false);
    }
  };

  const fetchStorageTypes = async () => {
    try {
      setStorageTypesLoading(true);
      const types = await getStorageTypes();
      setStorageTypes(types);
    } catch (error) {
      toast.error("Failed to fetch storage types");
    } finally {
      setStorageTypesLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      setWarehousesLoading(true);
      const stores = await getWarehouses();
      setWarehouses(stores);
    } catch (error) {
      toast.error("Failed to fetch warehouses");
    } finally {
      setWarehousesLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProcessingParams, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addPurchasedProduct = () => {
    if (selectedPurchasedProduct) {
      setFormData(prev => ({
        ...prev,
        purchasable_product_items: [...prev.purchasable_product_items, selectedPurchasedProduct.id]
      }));
      setSelectedPurchasedProduct(null);
      setPurchasedProductDialogOpen(false);
    }
  };

  const removePurchasedProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      purchasable_product_items: prev.purchasable_product_items.filter((_, i) => i !== index)
    }));
  };

  const addProcessedProduct = () => {
    if (selectedProcessedProduct && processedProductQuantity > 0) {
      // Convert quantity based on unit selection
      let finalQuantity = processedProductQuantity;
      if (quantityUnit === "kg" && selectedProcessedProduct.unit_type.toLowerCase() === "grams") {
        finalQuantity = processedProductQuantity * 1000;
      } else if (quantityUnit === "kg" && selectedProcessedProduct.unit_type.toLowerCase() === "kilograms") {
        finalQuantity = processedProductQuantity * 1000;
      }

      setFormData(prev => ({
        ...prev,
        processed_products: [...prev.processed_products, { 
          product_id: selectedProcessedProduct.id, 
          quantity: finalQuantity 
        }]
      }));
      setSelectedProcessedProduct(null);
      setProcessedProductQuantity(0);
      setQuantityUnit("base");
      setProcessedProductDialogOpen(false);
    }
  };

  const removeProcessedProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      processed_products: prev.processed_products.filter((_, i) => i !== index)
    }));
  };

  const getSelectedPurchasedProductName = (productId: number) => {
    const product = purchasables.find(p => p.id === productId);
    return product ? `${product.name} (${product.unit_type})` : "Unknown Product";
  };

  const getSelectedProcessedProductName = (productId: string) => {
    const product = availableProducts.find(p => p.id === productId);
    return product ? `${product.name} (${product.unit_type})` : "Unknown Product";
  };

  const getQuantityDisplayValue = (quantity: number, unitType: string) => {
    if (unitType.toLowerCase() === "grams" || unitType.toLowerCase() === "kilograms") {
      return quantity >= 1000 ? `${quantity / 1000} kg` : `${quantity} g`;
    }
    return `${quantity} ${unitType}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.store_id || !formData.storage_type_id || !formData.expiry_at) {
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

    // Validate expiry date is in the future
    const expiryDate = new Date(formData.expiry_at);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expiryDate <= today) {
      toast.error("Expiry date must be in the future");
      return;
    }

    setLoading(true);
    try {
      const error = await createBatch(formData);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Batch created successfully!");
        navigate("/batches");
      }
    } catch (error) {
      toast.error("Failed to create batch");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium text-gray-900">Create New Batch</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/batches')}
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
              <h2 className="text-sm font-medium text-gray-900 mb-4">Basic Information</h2>
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
                              .filter(w => w.name.toLowerCase().includes(warehouseSearch.toLowerCase()))
                              .map((warehouse) => (
                                <CommandItem
                                  key={warehouse.id}
                                  value={warehouse.id}
                                  onSelect={() => {
                                    setSelectedWarehouse(warehouse);
                                    handleInputChange("store_id", warehouse.id);
                                    setWarehouseDialogOpen(false);
                                  }}
                                  className="text-xs"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">{warehouse.name}</span>
                                    {warehouse.address && (
                                      <span className="text-gray-500 text-xs truncate">{warehouse.address}</span>
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
                        {selectedStorageType ? `${selectedStorageType.name} (${selectedStorageType.duration_type})` : "Select storage type..."}
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
                              .filter(s => s.name.toLowerCase().includes(storageTypeSearch.toLowerCase()))
                              .map((storageType) => (
                                <CommandItem
                                  key={storageType.id}
                                  value={storageType.id}
                                  onSelect={() => {
                                    setSelectedStorageType(storageType);
                                    handleInputChange("storage_type_id", storageType.id);
                                    setStorageTypeDialogOpen(false);
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
                  <Label className="text-xs text-gray-700">Expiry Date</Label>
                  <Input
                    type="date"
                    className="mt-1 text-xs"
                    value={getDateInputValue(formData.expiry_at)}
                    onChange={(e) => {
                      // Convert date to ISO 8601 format with time
                      const date = new Date(e.target.value);
                      const isoString = date.toISOString();
                      handleInputChange("expiry_at", isoString);
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Column 2: Purchased Products */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Purchased Products</h2>
              
              <div className="mb-4">
                <Label className="text-xs text-gray-700">Add Purchased Product</Label>
                <Dialog open={purchasedProductDialogOpen} onOpenChange={setPurchasedProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between mt-1 text-xs"
                    >
                      Select purchased product...
                      <ChevronDownIcon className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-sm">Select Purchased Product</DialogTitle>
                      <DialogDescription className="text-xs">
                        Choose a product to add to the batch
                      </DialogDescription>
                    </DialogHeader>
                    <Command className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center border-b px-3">
                        <SearchIcon className="mr-2 h-3 w-3 shrink-0 opacity-50" />
                        <CommandInput
                          placeholder="Search purchased products..."
                          value={purchasableSearch}
                          onValueChange={setPurchasableSearch}
                          className="border-0 focus:ring-0 text-xs"
                        />
                      </div>
                      <CommandList className="max-h-80 overflow-y-auto">
                        <CommandEmpty>No product found.</CommandEmpty>
                        <CommandGroup>
                          {purchasables
                            .filter(p => p.name.toLowerCase().includes(purchasableSearch.toLowerCase()))
                            .map((purchasable) => (
                              <CommandItem
                                key={purchasable.id}
                                value={purchasable.id}
                                onSelect={() => {
                                  setSelectedPurchasedProduct(purchasable);
                                }}
                                className="text-xs"
                              >
                                <div className="flex justify-between w-full">
                                  <span>{purchasable.name}</span>
                                  <span className="text-gray-500 text-xs">
                                    {purchasable.unit_type}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                    <div className="flex justify-end gap-2 mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setPurchasedProductDialogOpen(false);
                          setSelectedPurchasedProduct(null);
                        }}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={addPurchasedProduct} 
                        disabled={!selectedPurchasedProduct}
                        className="text-xs"
                      >
                        Add Product
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {formData.purchasable_product_items.length > 0 && (
                <div className="space-y-3">
                  {formData.purchasable_product_items.map((productId, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900">{getSelectedPurchasedProductName(productId)}</div>
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
                  ))}
                </div>
              )}
            </div>

            {/* Column 3: Processed Products */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Processed Products</h2>
              
              <div className="mb-4">
                <Label className="text-xs text-gray-700">Add Processed Product</Label>
                <Dialog open={processedProductDialogOpen} onOpenChange={setProcessedProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between mt-1 text-xs"
                    >
                      Select processed product...
                      <ChevronDownIcon className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-sm">Select Processed Product</DialogTitle>
                      <DialogDescription className="text-xs">
                        Choose a product and set its quantity
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {!selectedProcessedProduct ? (
                        <Command className="bg-gray-50 rounded-lg p-2">
                          <div className="flex items-center border-b px-3">
                            <SearchIcon className="mr-2 h-3 w-3 shrink-0 opacity-50" />
                            <CommandInput
                              placeholder="Search processed products..."
                              value={processedProductSearch}
                              onValueChange={setProcessedProductSearch}
                              className="border-0 focus:ring-0 text-xs"
                            />
                          </div>
                          <CommandList className="max-h-80 overflow-y-auto">
                            <CommandEmpty>No product found.</CommandEmpty>
                            <CommandGroup>
                              {availableProducts
                                .filter(p => p.name.toLowerCase().includes(processedProductSearch.toLowerCase()))
                                .map((product) => (
                                  <CommandItem
                                    key={product.id}
                                    value={product.id}
                                    onSelect={() => {
                                      setSelectedProcessedProduct(product);
                                    }}
                                    className="text-xs"
                                  >
                                    <div className="flex justify-between w-full">
                                      <span className="truncate">{product.name}</span>
                                      <span className="text-gray-500 text-xs ml-2 flex-shrink-0">
                                        {product.unit_type}
                                      </span>
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      ) : (
                        <div className="space-y-4">
                          {/* Selected Product Display */}
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-900">{selectedProcessedProduct.name}</div>
                              <div className="text-xs text-gray-500">{selectedProcessedProduct.unit_type}</div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProcessedProduct(null);
                                setProcessedProductQuantity(0);
                                setQuantityUnit("base");
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XIcon className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {/* Quantity Input */}
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Quantity *</Label>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                placeholder="0"
                                className="text-xs"
                                value={processedProductQuantity}
                                onChange={(e) => setProcessedProductQuantity(parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.01"
                                required
                              />
                              <Select value={quantityUnit} onValueChange={setQuantityUnit}>
                                <SelectTrigger className="w-28 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="base">{selectedProcessedProduct.unit_type}</SelectItem>
                                  {selectedProcessedProduct.unit_type.toLowerCase() === "grams" && (
                                    <SelectItem value="kg">kg</SelectItem>
                                  )}
                                  {selectedProcessedProduct.unit_type.toLowerCase() === "kilograms" && (
                                    <SelectItem value="kg">kg</SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setProcessedProductDialogOpen(false);
                          setSelectedProcessedProduct(null);
                          setProcessedProductQuantity(0);
                          setQuantityUnit("base");
                        }}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={addProcessedProduct} 
                        disabled={!selectedProcessedProduct || processedProductQuantity <= 0}
                        className="text-xs"
                      >
                        Add Product
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {formData.processed_products.length > 0 && (
                <div className="space-y-3">
                  {formData.processed_products.map((product, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900">{getSelectedProcessedProductName(product.product_id)}</div>
                        <div className="text-xs text-gray-500">
                          {getQuantityDisplayValue(product.quantity, availableProducts.find(p => p.id === product.product_id)?.unit_type || "")}
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