import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Plus, Trash2, Search } from "lucide-react";
import { createPurchaseOrder } from "@/routes/purchasables/domain/purchasable-post";
import type {
  CreateOrderPurchaseParams,
  Purchasable,
} from "@/routes/purchasables/domain/models";

interface PurchasableOrderCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchasables: Purchasable[];
  onSuccess: () => void;
}

interface OrderItem {
  product_id: number;
  unit_of_issue: number;
  unit_cost: number;
}

export function PurchasableOrderCreateDialog({
  open,
  onOpenChange,
  purchasables,
  onSuccess,
}: PurchasableOrderCreateDialogProps) {
  const [supplierId, setSupplierId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [storageTypeId, setStorageTypeId] = useState("");
  const [items, setItems] = useState<OrderItem[]>([
    { product_id: 0, unit_of_issue: 0, unit_cost: 0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setError(null);
      setSupplierId("");
      setStoreId("");
      setStorageTypeId("");
      setItems([{ product_id: 0, unit_of_issue: 0, unit_cost: 0 }]);
      setProductSearch("");
    }
  }, [open]);

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
        status: "pending",
        items: items.map((item) => ({
          product_id: item.product_id,
          unit_of_issue: item.unit_of_issue,
          unit_cost: item.unit_cost,
        })),
      };

      const error = await createPurchaseOrder(orderData);

      if (!error) {
        onSuccess();
        onOpenChange(false);
        toast.success("Purchasable order created successfully!");
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
    onOpenChange(false);
    setError(null);
  };

  const getSelectedProduct = (productId: number) => {
    return purchasables.find((p) => p.id === productId);
  };

  // Filter products based on search
  const filteredProducts = purchasables.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.description.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[700px] h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Create New Purchasable Order</DialogTitle>
          <DialogDescription>
            Create a new purchasable order with supplier and items.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* Supplier Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">
              Supplier *
            </Label>
            <Select value={supplierId} onValueChange={setSupplierId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supplier1">Supplier 1</SelectItem>
                <SelectItem value="supplier2">Supplier 2</SelectItem>
                <SelectItem value="supplier3">Supplier 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Items Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Order Items</Label>
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
              <div key={index} className="border rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Item {index + 1}</span>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-sm">Product *</Label>
                    <Select
                      value={item.product_id.toString()}
                      onValueChange={(value) =>
                        updateItem(index, "product_id", parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <div className="p-2">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              placeholder="Search products..."
                              value={productSearch}
                              onChange={(e) => setProductSearch(e.target.value)}
                              className="pl-8 h-8 text-sm"
                            />
                          </div>
                        </div>
                        <div className="max-h-[150px] overflow-y-auto">
                          {filteredProducts.length === 0 ? (
                            <div className="p-2 text-sm text-gray-500 text-center">
                              No products found
                            </div>
                          ) : (
                            filteredProducts.map((product) => (
                              <SelectItem
                                key={product.id}
                                value={product.id.toString()}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {product.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {product.description} • {product.unit_type}
                                  </span>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm">Unit of Issue *</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_of_issue}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "unit_of_issue",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="0.00"
                      className="h-9"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Unit Cost *</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_cost}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "unit_cost",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="0.00"
                      className="h-9"
                    />
                  </div>
                </div>

                {item.product_id > 0 && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <strong>Selected:</strong>{" "}
                    {getSelectedProduct(item.product_id)?.name}(
                    {getSelectedProduct(item.product_id)?.unit_type})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
