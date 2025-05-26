import { useEffect, useMemo, useState, useCallback, useRef } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import ImageThumbnail from "@/components/common/ImageThumbnail";
import ProgressIndicator from "@/components/common/ProgressIndicator";
import { Category } from "../../../store/features/categories/categoryTypes";
import { Tag } from "../../../store/features/tags/tagTypes";

export interface BannerFormData {
  image: File | string | null; // Updated to support both File and string
  name: string;
  tag: Tag | null;
  category: Category | null;
  active: boolean;
}

interface BannerFormProps {
  initialValues?: BannerFormData;
  onSubmit: (data: BannerFormData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
  isLoading?: boolean;
  tags: Tag[];
  categories: Category[];
}

const BannerForm: React.FC<BannerFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditMode = false,
  isLoading = false,
  tags,
  categories,
}) => {
  const [image, setImage] = useState<File | string | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [name, setName] = useState("");
  const [tag, setTag] = useState<Tag | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [active, setActive] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "loading" | "uploaded"
  >("idle");

  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (!isInitialized.current && initialValues) {
      setImage(initialValues.image || null);
      setPreviewImage(
        typeof initialValues.image === "string"
          ? initialValues.image // Use the URL directly if it's a string
          : initialValues.image
          ? URL.createObjectURL(initialValues.image) // Generate preview if it's a File
          : ""
      );
      setName(initialValues.name || "");
      setTag(initialValues.tag || null);
      setCategory(initialValues.category || null);
      setActive(initialValues.active ?? true);
      isInitialized.current = true;
    }
  }, [initialValues]);

  const memoizedTagOptions = useMemo(() => {
    return tags.map((tag) => (
      <SelectItem key={tag.id} value={tag.id}>
        {tag.name}
      </SelectItem>
    ));
  }, [tags]);

  const memoizedCategoryOptions = useMemo(() => {
    return categories.map((category) => (
      <SelectItem key={category.id} value={category.id}>
        {category.name}
      </SelectItem>
    ));
  }, [categories]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      const selectedFile = files[0];
      setImage(selectedFile); // Store the File object
      setPreviewImage(URL.createObjectURL(selectedFile)); // Generate preview URL
    },
    []
  );

  const handleRemoveImage = useCallback(() => {
    setImage(null);
    setPreviewImage("");
    setUploadStatus("idle");
  }, []);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    []
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      setCategory(categories.find((c) => c.id === value) || null);
    },
    [categories]
  );

  const handleTagChange = useCallback(
    (value: string) => {
      setTag(tags.find((t) => t.id === value) || null);
    },
    [tags]
  );

  const handleActiveChange = useCallback((checked: boolean) => {
    setActive(checked);
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit({
      image,
      name,
      tag,
      category,
      active,
    });
  }, [image, name, tag, category, active, onSubmit]);

  return (
    <div className="card">
      <div className="grid grid-cols-2 gap-x-10">
        <div className="space-y-6">
          {/* Image Picker */}
          <div className="flex items-center gap-4 flex-wrap">
            {uploadStatus === "loading" ? (
              <div className="w-full h-32 flex items-center justify-center border rounded">
                <ProgressIndicator />
              </div>
            ) : previewImage ? (
              <ImageThumbnail src={previewImage} onRemove={handleRemoveImage} />
            ) : (
              <label className="w-full h-32 flex items-center justify-center border border-dashed rounded cursor-pointer hover:bg-gray-50 text-gray-500 text-sm">
                <span>+ Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {/* Name Field */}
          <div className="flex flex-col gap-y-2">
            <Label>Banner Name</Label>
            <Input
              placeholder="Enter banner name"
              value={name}
              onChange={handleNameChange}
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Category Selector */}
          <div className="flex flex-col gap-y-2">
            <Label>Category</Label>
            <Select
              value={category?.id || ""}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>{memoizedCategoryOptions}</SelectContent>
            </Select>
          </div>

          {/* Tag Selector */}
          <div className="flex flex-col gap-y-2">
            <Label>Tag</Label>
            <Select value={tag?.id || ""} onValueChange={handleTagChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>{memoizedTagOptions}</SelectContent>
            </Select>
          </div>

          {/* Active Switch */}
          <div className="flex items-center gap-2">
            <Switch
              id="active"
              checked={active}
              onCheckedChange={handleActiveChange}
            />
            <Label htmlFor="active">Active</Label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end mt-4">
        <Button variant="outline" className="mr-2" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin mr-2 size-4" /> : null}
          {isEditMode ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default BannerForm;
