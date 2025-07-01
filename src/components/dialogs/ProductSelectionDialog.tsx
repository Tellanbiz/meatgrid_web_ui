import React, { useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  description: string;
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
  description,
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedProduct ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                  Available Products ({products.length})
                </Label>
                <div className="text-xs text-gray-500">
                  Showing all products
                </div>
              </div>

              <Command className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center border-b border-gray-100 px-4 py-3">
                  <SearchIcon className="mr-3 h-4 w-4 text-gray-400" />
                  <CommandInput
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    className="border-0 focus:ring-0 text-sm placeholder:text-gray-400"
                  />
                </div>

                <CommandList className="max-h-96 overflow-y-auto">
                  <CommandEmpty className="py-8 text-center">
                    <div className="text-gray-500">
                      <SearchIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No products found</p>
                      <p className="text-xs">Try adjusting your search terms</p>
                    </div>
                  </CommandEmpty>

                  <CommandGroup>
                    {filteredProducts.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.id.toString()}
                        onSelect={() => handleProductSelect(product)}
                        className="px-4 py-3 hover:bg-red-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Unit: {product.unit_type}
                              {product.description && (
                                <span className="ml-2">
                                  • {product.description}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center ml-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected Product Display */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {selectedProduct.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      Unit Type: {selectedProduct.unit_type}
                      {selectedProduct.description && (
                        <span className="ml-2">
                          • {selectedProduct.description}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProduct(null)}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quantity Input */}
              {showQuantityInput && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Quantity *
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      placeholder={quantityPlaceholder}
                      className="text-sm"
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
                        <SelectTrigger className="w-32 text-sm">
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
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handleClose}
            className="text-sm px-6"
          >
            {cancelButtonText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="text-sm px-6 bg-red-600 hover:bg-red-700"
          >
            {primaryButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductSelectionDialog;
