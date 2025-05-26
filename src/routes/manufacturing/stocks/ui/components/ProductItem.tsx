import { Product } from "../../../store/features/products/productTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface ProductItemProps {
  product: Product & { quantity: string };
  isRawMaterial: boolean;
  onQuantityChange: (
    id: string,
    newQuantity: string,
    isRawMaterial: boolean
  ) => void;
  onDelete: (id: string, isRawMaterial: boolean) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  isRawMaterial,
  onQuantityChange,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-12 items-center gap-2 p-2 rounded-md hover:bg-gray-100">
      <p className="col-span-5 text-sm font-medium">{product.name}</p>

      <div className="col-span-5 flex items-center space-x-2">
        <Input
          type="number"
          value={product.quantity}
          onChange={(e) =>
            onQuantityChange(product.id, e.target.value, isRawMaterial)
          }
          className="w-full text-center outline-none p-0"
        />
        <span className="text-sm text-gray-500">{product.unit_type}</span>
      </div>

      <div className="col-span-2 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-red-100"
          onClick={() => onDelete(product.id, isRawMaterial)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default ProductItem;
