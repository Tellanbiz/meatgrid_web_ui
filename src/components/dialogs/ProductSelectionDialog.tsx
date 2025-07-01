import React, { useState } from "react";
import { SearchIcon, XIcon, PackageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
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

export interface ProductItem {
  id: string;
  name: string;
  unit_type: string;
  description?: string;
}

interface ProductSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  products: ProductItem[];
  onProductSelect: (
    product: ProductItem,
    quantity: number,
    unit: string
  ) => void;
  showQuantityInput?: boolean;
  allowUnitConversion?: boolean;
  primaryButtonText?: string;
  cancelButtonText?: string;
  searchPlaceholder?: string;
  quantityPlaceholder?: string;
  maxQuantity?: number;
  minQuantity?: number;
  step?: number;
}

const ProductSelectionDialog: React.FC<ProductSelectionDialogProps> = ({
  open,
  onOpenChange,
  title,
  products,
  onProductSelect,
  showQuantityInput = true,
  allowUnitConversion = true,
  primaryButtonText = "Add Product",
  cancelButtonText = "Cancel",
  searchPlaceholder = "Search products by name...",
  quantityPlaceholder = "Enter quantity",
  maxQuantity,
  minQuantity = 0,
  step = 0.01,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(0);
  const [quantityUnit, setQuantityUnit] = useState<string>("base");

  const handleProductSelect = (product: ProductItem) => {
    setSelectedProduct(product);
    setQuantity(0);
    setQuantityUnit("base");
  };

  const handleConfirm = () => {
    if (selectedProduct && (!showQuantityInput || quantity > 0)) {
      onProductSelect(selectedProduct, quantity, quantityUnit);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setQuantity(0);
    setQuantityUnit("base");
    setSearchTerm("");
    onOpenChange(false);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isConfirmDisabled =
    !selectedProduct || (showQuantityInput && quantity <= 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200 bg-white">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedProduct ? (
            <div className="space-y-3">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="text-gray-500">
                      <PackageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">No products found</p>
                      <p className="text-xs">Try adjusting your search terms</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className="px-3 py-2 hover:bg-red-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                              <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                                {product.unit_type}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center ml-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected Product Display */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                        <PackageIcon className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {selectedProduct.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          Unit Type: {selectedProduct.unit_type}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50 h-7 w-7 p-0"
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Quantity Input */}
              {showQuantityInput && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Quantity *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={quantityPlaceholder}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseFloat(e.target.value) || 0)
                      }
                      min={minQuantity}
                      max={maxQuantity}
                      step={step}
                      required
                    />
                    {allowUnitConversion && (
                      <Select
                        value={quantityUnit}
                        onValueChange={setQuantityUnit}
                      >
                        <SelectTrigger className="w-28 text-sm border-gray-200 focus:border-red-500 focus:ring-red-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="base">
                            {selectedProduct.unit_type}
                          </SelectItem>
                          {selectedProduct.unit_type.toLowerCase() ===
                            "grams" && (
                            <SelectItem value="kg">kilograms</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  {quantityUnit === "kg" &&
                    selectedProduct.unit_type === "grams" && (
                      <div className="text-xs text-gray-500 bg-red-50 px-2 py-1 rounded-md">
                        {quantity} kg = {(quantity * 1000).toLocaleString()}{" "}
                        grams
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handleClose}
            className="text-sm px-6 border-gray-200 hover:bg-gray-50"
          >
            {cancelButtonText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="text-sm px-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500"
          >
            {primaryButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductSelectionDialog;
