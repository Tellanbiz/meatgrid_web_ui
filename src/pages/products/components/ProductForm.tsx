import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageThumbnail from "@/components/common/ImageThumbnail";
import { Loader2, X, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Category } from "../../../store/features/categories/categoryTypes";
import { Tag } from "../../../store/features/tags/tagTypes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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
  isEditMode?: boolean;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  tags,
  categories,
  onSubmit,
  isEditMode = false,
  isLoading = false,
}) => {
  const isFormInitialized = useRef<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

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

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories([categoryId]);
    handleChange("category_id", categoryId);
    setIsCategoriesOpen(false);
  };

  const handleTagSelect = (tagId: string) => {
    setSelectedTags([tagId]);
    handleChange("tag_id", tagId);
    setIsTagsOpen(false);
  };

  const removeCategory = (categoryId: string) => {
    setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
    handleChange("category_id", null);
  };

  const removeTag = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((id) => id !== tagId));
    handleChange("tag_id", null);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Top Navbar */}
      <div className="w-full sticky top-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold">
            {isEditMode ? form.name || "Edit Product" : "New Product"}
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              disabled={isLoading}
              onClick={handleSubmit}
              className="px-6"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-4 gap-x-10">
          {/* Left Grid (Product Information) */}
          <div className="col-span-3 space-y-6">
            {/* Media Library Container */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Media Library</h2>
              <div className="space-y-4">
                {previewImages.length < 5 && (
                  <label className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg
                        className="w-12 h-12 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <span className="text-sm font-medium">
                        Click to upload images
                      </span>
                      <span className="text-xs mt-1">
                        {previewImages.length}/5 images. Max 2MB per Image. PNG,
                        JPG
                      </span>
                    </div>
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
            </div>

            {/* Basic Information Container */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-6">
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    cols={3}
                    id="description"
                    placeholder="Product Description"
                    value={form.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className="w-full min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Container */}
            <div className="card p-6">
              <div className="flex flex-col gap-y-1 mb-4">
                <h2 className="text-lg font-semibold">Pricing</h2>
                <span className="text-gray-500 text-sm">
                  Sales price can be used to set discounts. Also optional
                </span>
              </div>
              <div className="grid grid-cols-3 gap-x-4">
                <div className="flex flex-col gap-y-2">
                  <Label
                    htmlFor="regular_price"
                    className="text-sm font-medium"
                  >
                    Regular Price
                  </Label>
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
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="unit_type" className="text-sm font-medium">
                    Unit Type
                  </Label>
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
                  <Label
                    htmlFor="package_quantity"
                    className="text-sm font-medium"
                  >
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
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Inventory Container */}
            <div className="card p-6">
              <div className="flex flex-col gap-y-1 mb-4">
                <h2 className="text-lg font-semibold">Inventory</h2>
                <span className="text-gray-500 text-sm">
                  Set the minimum stock quantity to be notified when stock
                  reaches it
                </span>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label
                  htmlFor="min_stock_quantity"
                  className="text-sm font-medium"
                >
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
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Right Grid (Scrollable) */}
          <div className="col-span-1 space-y-4">
            {/* Product Types Container */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Product Types</h2>
              <div className="space-y-4">
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
                    className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                    className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Is Raw Material
                  </label>
                </div>
              </div>
            </div>

            {/* Weight Settings Container */}
            <div className="card p-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Weight Settings</h2>
                  <span className="text-sm text-gray-500">
                    Allows Point Of Sale staff to adjust product weight when
                    adding to the cart
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
                    className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
                  >
                    Allow Editable Weight
                  </label>
                </div>
              </div>
            </div>

            {/* Category Container */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Category</h2>
                <Dialog
                  open={isCategoriesOpen}
                  onOpenChange={setIsCategoriesOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Select Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Select Category</DialogTitle>
                    </DialogHeader>
                    <div className="relative mt-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 max-h-[400px] overflow-y-auto">
                      {filteredCategories.map((category) => (
                        <div
                          key={category.id}
                          className={`p-3 border cursor-pointer hover:bg-gray-50 ${
                            selectedCategories.includes(category.id)
                              ? "border-primary bg-primary/5"
                              : "border-gray-200"
                          }`}
                          onClick={() => handleCategorySelect(category.id)}
                        >
                          <span className="text-sm text-gray-600">
                            {category.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((categoryId) => {
                  const category = categories.find((c) => c.id === categoryId);
                  return category ? (
                    <Badge
                      key={categoryId}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {category.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeCategory(categoryId)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            {/* Tags Container */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Tag</h2>
                <Dialog open={isTagsOpen} onOpenChange={setIsTagsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Select Tag
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Select Tag</DialogTitle>
                    </DialogHeader>
                    <div className="relative mt-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search tags..."
                        value={tagSearch}
                        onChange={(e) => setTagSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 max-h-[400px] overflow-y-auto">
                      {filteredTags.map((tag) => (
                        <div
                          key={tag.id}
                          className={`p-3 border cursor-pointer hover:bg-gray-50 ${
                            selectedTags.includes(tag.id)
                              ? "border-primary bg-primary/5"
                              : "border-gray-200"
                          }`}
                          onClick={() => handleTagSelect(tag.id)}
                        >
                          <span className="text-sm text-gray-600">
                            {tag.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tagId) => {
                  const tag = tags.find((t) => t.id === tagId);
                  return tag ? (
                    <Badge
                      key={tagId}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tagId)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
