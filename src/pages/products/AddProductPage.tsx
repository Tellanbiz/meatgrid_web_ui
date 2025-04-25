import { useState } from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import ImageThumbnail from "../../components/ImageThumbnail";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";

const categories = [
  {
    id: 1,
    name: "Category 1",
  },
  {
    id: 2,
    name: "Category 2",
  },
  {
    id: 3,
    name: "Category 3",
  },
  {
    id: 4,
    name: "Category 4",
  },
];

const unitTypes = [
  {
    id: 1,
    name: "grams",
    label: "Grams",
  },
  {
    id: 2,
    name: "kilograms",
    label: "Kilograms",
  },
  {
    id: 3,
    name: "liters",
    label: "Liters",
  },
  {
    id: 4,
    name: "pieces",
    label: "Pieces",
  },
];

const AddProductPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedUnitType, setSelectedUnitType] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles).slice(0, 5 - files.length);
      const newFileUrls = newFiles.map((file) => URL.createObjectURL(file));

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setImageUrls((prevUrls) => [...prevUrls, ...newFileUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file to upload.");
      return;
    }
    setUploadStatus("loading");
    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setUploadStatus("idle");
    } catch (err) {
      setError("File upload failed.");
      setUploadStatus("idle");
    }
  };

  const handleSave = () => {
    if (imageUrls.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    // Save product logic here
    console.log("Product saved with image URLs:", imageUrls);
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          {
            label: "Products",
            to: "/products",
          },
          {
            label: "Add Product",
            isPage: true,
          },
        ]}
      />

      <div className="mt-4">
        <div className="grid grid-cols-4 gap-x-10">
          <div className="col-span-3">
            <div className="card">
              <h1 className="text-sm font-medium">Product Information</h1>

              <Label className="mt-4" htmlFor="name">
                Media Library
              </Label>
              <div className="space-y-6 mt-3">
                <div className="flex flex-col gap-4">
                  {imageUrls.length < 5 && (
                    <label className="w-full h-32 flex items-center justify-center border border-dashed rounded cursor-pointer hover:bg-gray-50 text-gray-500 text-sm flex flex-col items-center">
                      <span>+ Upload Photo</span>
                      <span className="text-xs font-extralight mt-2">
                        {imageUrls.length}/5 images. Max 2MB per Image. PNG, JPG
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
                    {imageUrls.map((url, index) => (
                      <ImageThumbnail
                        key={index}
                        src={url}
                        onRemove={() => handleRemoveImage(index)}
                      />
                    ))}
                  </div>
                </div>
                {/* I want now ShadCn Inputs */}
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input type="text" id="name" placeholder="Product Name" />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    cols={3}
                    id="description"
                    placeholder="Product Description"
                  />
                </div>
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
                      type="number"
                      id="regular_price"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <Label htmlFor="unit_type">Unit Type</Label>
                    <Select
                      onValueChange={(value) => setSelectedUnitType(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            selectedUnitType
                              ? unitTypes.find(
                                  (unit) => unit.name === selectedUnitType
                                )?.label
                              : "Select Unit Type"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {unitTypes.map((unit) => (
                          <SelectItem key={unit.id} value={unit.name}>
                            {unit.label}
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
                      type="number"
                      id="package_quantity"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-y-1">
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
                    type="number"
                    id="min_stock_quantity"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-y-4">
            <div className="card flex flex-col space-y-4 w-full">
              <h4 className="text-md font-medium">Product Types</h4>
              <div className="flex items-center space-x-3">
                <Checkbox id="is_product" />
                <label
                  htmlFor="is_product"
                  className="text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Is Product
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="is_raw_material" />
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
                  Allows Point Of Sale staff to adjust product weight when
                  adding to the cart
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="allow" />
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
                  <Checkbox id={category.id.toString()} />
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
              <h4 className="text-md font-medium leading-tight">Tags</h4>
              <div className="flex items-center space-x-3">
                <Checkbox id="tag1" />
                <label
                  htmlFor="tag1"
                  className="text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
                >
                  Tag 1
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="tag2" />
                <label
                  htmlFor="tag2"
                  className="text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
                >
                  Tag 2
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            variant="ghost"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2"
            onClick={() => console.log("Cancel")}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
