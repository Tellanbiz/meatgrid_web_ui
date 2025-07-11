import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
import { Plus, Trash2, Search, ArrowLeft } from "lucide-react";
import { createPurchaseOrder } from "@/routes/purchasables/domain/purchasable-post";
import { usePurchasables } from "../hooks/usePurchasables";
import type { CreateOrderPurchaseParams } from "@/routes/purchasables/domain/models";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSuppliers } from "@/store/features/suppliers/supplierThunks";
import { selectSuppliers } from "@/store/features/suppliers/supplierSelectors";

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
  
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState<OrderItem[]>([
    { product_id: 0, unit_of_issue: 0, unit_cost: 0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState<{
    [key: number]: string;
  }>({});
  const [supplierSearch, setSupplierSearch] = useState("");
  const [debouncedSupplierSearch, setDebouncedSupplierSearch] = useState("");
  const [debouncedProductSearch, setDebouncedProductSearch] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    fetchPurchasables();
    dispatch(fetchSuppliers());
  }, [fetchPurchasables, dispatch]);

  // Debounce supplier search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSupplierSearch(supplierSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [supplierSearch]);

  // Debounce product search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductSearch(productSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [productSearch]);

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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search suppliers by name, email, phone, or address..."
                  value={supplierSearch}
                  onChange={(e) => setSupplierSearch(e.target.value)}
                  className="pl-10"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{supplier.full_name}</span>
                          <span className="text-sm text-gray-500">
                            {supplier.email} • {supplier.phone_number}
                          </span>
                          {supplier.address && (
                            <span className="text-sm text-gray-500 truncate">
                              {supplier.address}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No suppliers found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {supplierId && getSelectedSupplier(supplierId) && (
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                  Selected: {getSelectedSupplier(supplierId)?.full_name}
                </div>
              )}
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
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search products by name, description, or unit type..."
                        value={productSearch[index] || ""}
                        onChange={(e) =>
                          setProductSearch((prev) => ({
                            ...prev,
                            [index]: e.target.value,
                          }))
                        }
                        className="pl-10"
                        autoComplete="off"
                        spellCheck="false"
                      />
                    </div>
                    <Select
                      value={item.product_id.toString()}
                      onValueChange={(value) => {
                        updateItem(index, "product_id", parseInt(value));
                        // Clear search when product is selected
                        setProductSearch((prev) => ({
                          ...prev,
                          [index]: "",
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {getFilteredProducts(debouncedProductSearch[index] || "").length > 0 ? (
                          getFilteredProducts(debouncedProductSearch[index] || "").map((product) => (
                            <SelectItem
                              key={product.id}
                              value={product.id.toString()}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {product.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {product.description} ({product.unit_type})
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No products found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {item.product_id > 0 &&
                      getSelectedProduct(item.product_id) && (
                        <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                          Selected: {getSelectedProduct(item.product_id)?.name}
                        </div>
                      )}
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
