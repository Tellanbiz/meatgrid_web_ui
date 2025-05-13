import { useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import ImageThumbnail from "../../../components/ImageThumbnail";
import { Loader2 } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox";
import { Category } from "../../../store/features/categories/categoryTypes";
import { Tag } from "../../../store/features/tags/tagTypes";

const unitTypes = {
  grams: "Grams",
  kilograms: "Kilograms",
  litres: "Litres",
  pieces: "Pieces",
};

export interface ProductFormData {
  name: string;
  description?: string;
  regular_price: number;
  unit_type: string;
  package_quantity: number;
  min_stock_quantity: number;
  is_product: boolean;
  is_raw_material: boolean;
  allow_editable_weight: boolean;
  category_id?: string | null;
  tag_id?: string | null;
  images: File[] | string[];
}

interface ProductFormProps {
  initialValues?: ProductFormData;
  tags: Tag[];
  categories: Category[];
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  tags,
  categories,
  onSubmit,
  onCancel,
  isEditMode = false,
  isLoading = false,
}) => {
  const isFormInitialized = useRef<boolean>(false);

  const [form, setForm] = useState<ProductFormData>({
    name: "",
    description: "",
    regular_price: 0,
    unit_type: "",
    package_quantity: 0,
    min_stock_quantity: 0,
    is_product: false,
    is_raw_material: false,
    allow_editable_weight: false,
    category_id: null,
    tag_id: null,
    images: [],
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    if (!isFormInitialized.current && initialValues) {
      setForm(initialValues);
      setPreviewImages(
        initialValues.images.map((image) =>
          typeof image === "string" ? image : URL.createObjectURL(image)
        )
      );
      isFormInitialized.current = true;
    }
  }, [initialValues, isFormInitialized]);

  const handleChange = (field: keyof ProductFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images as File[]), ...files],
    }));
    setPreviewImages((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images:
        Array.isArray(prev.images) && typeof prev.images[0] === "string"
          ? (prev.images as string[]).filter((_, i) => i !== index)
          : (prev.images as File[]).filter((_, i) => i !== index),
    }));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-4 gap-x-10">
        {/* Left Grid (Product Information) */}
        <div className="col-span-3">
          <div className="card">
            <h1 className="text-sm">Product Information</h1>

            <Label className="mt-4" htmlFor="name">
              Media Library
            </Label>
            <div className="space-y-6 mt-3 pb-4">
              {/* Media Library */}
              <div className="flex flex-col gap-4">
                {previewImages.length < 5 && (
                  <label className="w-full h-32 flex flex-col items-center justify-center border border-dashed rounded cursor-pointer hover:bg-gray-50 text-gray-500 text-sm">
                    <span>+ Upload Photo</span>
                    <span className="text-xs font-extralight mt-2">
                      {previewImages.length}/5 images. Max 2MB per Image. PNG,
                      JPG
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                )}
                <div className="grid grid-cols-5 gap-4">
                  {previewImages.map((image, index) => (
                    <ImageThumbnail
                      key={index}
                      src={image}
                      onRemove={() => handleRemoveImage(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Name Field */}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Product Name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  cols={3}
                  id="description"
                  placeholder="Product Description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

              {/* Prices */}
              <div className="flex flex-col gap-y-1">
                <Label>Prices</Label>
                <span className="text-gray-500 text-sm font-light leading-none">
                  Sales price can be used to set discounts. Also optional
                </span>
              </div>
              <div className="grid grid-cols-3 gap-x-4">
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="regular_price">Regular Price</Label>
                  <Input
                    type="tel"
                    id="regular_price"
                    placeholder="0.00"
                    value={form.regular_price}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value))) {
                        handleChange("regular_price", Number(e.target.value));
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="unit_type">Unit Type</Label>
                  <Select
                    onValueChange={(value) => handleChange("unit_type", value)}
                    defaultValue={form.unit_type}
                    value={form.unit_type}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Unit Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(unitTypes).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="package_quantity">
                    Maximum Package Quantity
                  </Label>
                  <Input
                    type="tel"
                    id="package_quantity"
                    placeholder="0.00"
                    value={form.package_quantity}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value))) {
                        handleChange(
                          "package_quantity",
                          Number(e.target.value)
                        );
                      }
                    }}
                  />
                </div>
              </div>

              {/* Inventory */}
              <div className="flex flex-col gap-y-0">
                <Label>Inventory</Label>
                <span className="text-gray-500 text-sm font-light">
                  Set the minimum stock quantity to be notified when stock
                  reaches it
                </span>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="min_stock_quantity">
                  Minimum Stock Quantity
                </Label>
                <Input
                  type="tel"
                  id="min_stock_quantity"
                  placeholder="0.00"
                  value={form.min_stock_quantity}
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) {
                      handleChange(
                        "min_stock_quantity",
                        Number(e.target.value)
                      );
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Grid (Scrollable) */}
        <div className="col-span-1 space-y-4 overflow-y-auto">
          <div className="card flex flex-col space-y-4 w-full">
            <h4 className="text-md font-medium">Product Types</h4>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="is_product"
                checked={form.is_product}
                onCheckedChange={(checked) =>
                  handleChange("is_product", checked)
                }
              />
              <label
                htmlFor="is_product"
                className="text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Is Product
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="is_raw_material"
                checked={form.is_raw_material}
                onCheckedChange={(checked) =>
                  handleChange("is_raw_material", checked)
                }
              />
              <label
                htmlFor="is_raw_material"
                className="text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Is Raw Material
              </label>
            </div>
          </div>

          <div className="card flex flex-col space-y-4 w-full">
            <div className="space-y-1">
              <h4 className="text-md font-medium leading-tight">
                Allow Editable Weight
              </h4>
              <span className="text-gray-500 font-light">
                Allows Point Of Sale staff to adjust product weight when adding
                to the cart
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="allow"
                checked={form.allow_editable_weight}
                onCheckedChange={(checked) =>
                  handleChange("allow_editable_weight", checked)
                }
              />
              <label
                htmlFor="allow"
                className="text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
              >
                Allow
              </label>
            </div>
          </div>

          <div className="card flex flex-col space-y-4 w-full">
            <h4 className="text-md font-medium leading-tight">Category</h4>
            {categories.map((category) => (
              <div className="flex items-center space-x-3" key={category.id}>
                <Checkbox
                  id={category.id.toString()}
                  checked={form.category_id === category.id}
                  onCheckedChange={(checked) =>
                    handleChange("category_id", checked ? category.id : null)
                  }
                />
                <label
                  htmlFor={category.id.toString()}
                  className="text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>

          <div className="card flex flex-col space-y-4 w-full">
            <h4 className="text-md font-medium leading-tight">Tag</h4>
            {tags.map((tag) => (
              <div className="flex items-center space-x-3" key={tag.id}>
                <Checkbox
                  id={tag.id.toString()}
                  checked={form.tag_id === tag.id}
                  onCheckedChange={(checked) =>
                    handleChange("tag_id", checked ? tag.id : null)
                  }
                />
                <label
                  htmlFor={tag.id.toString()}
                  className="text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
                >
                  {tag.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end my-4 col-span-4 gap-x-2">
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
