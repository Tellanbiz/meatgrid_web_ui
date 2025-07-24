import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ImageThumbnail from "@/components/common/ImageThumbnail";
import ProgressIndicator from "@/components/common/ProgressIndicator";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { uploadImages } from "@/store/features/uploads/uploadThunks";
import { resetUploadState } from "@/store/features/uploads/uploadSlice";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Category } from "../../../store/features/categories/categoryTypes";
import { Switch } from "@/components/ui/switch";

export interface CategoryFormData {
  name: string;
  image?: string;
  description?: string;
  parentCategory?: Category | null;
  active: boolean;
}

interface CategoryFormProps {
  initialValues?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
  isLoading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditMode = false,
  isLoading = false,
}) => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);
  const { status: uploadStatus, error: uploadError } = useAppSelector(
    (state) => state.uploads
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [active, setActive] = useState(true);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current && initialValues) {
      setName(initialValues.name || "");
      setDescription(initialValues.description || "");
      setParentCategory(initialValues.parentCategory || null);
      setImage(initialValues.image || null);
      setPreviewImage(initialValues.image || "");
      setActive(initialValues.active ?? true);
      isInitialized.current = true;
    }
  }, [initialValues]);

  useEffect(() => {
    if (uploadError) {
      toast.error(uploadError);
    }
  }, [uploadError]);

  const memoizedCategoryOptions = useMemo(() => {
    return categories.map((cat) => (
      <SelectItem key={cat.id} value={cat.id}>
        {cat.name}
      </SelectItem>
    ));
  }, [categories]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      try {
        const res = await dispatch(uploadImages([files[0]])).unwrap();
        if (res && res.length > 0) {
          setImage(res[0]);
          setPreviewImage(res[0]);
        }
      } catch {
        toast.error("Failed to upload image");
      }
    },
    [dispatch]
  );

  const handleRemoveImage = useCallback(() => {
    setImage(null);
    setPreviewImage("");
    dispatch(resetUploadState());
  }, [dispatch]);

  const handleSubmit = useCallback(() => {
    onSubmit({
      name,
      image: image || "",
      description,
      parentCategory,
      active,
    });
  }, [name, description, parentCategory, image, active, onSubmit]);

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
            <Label>Name</Label>
            <Input
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Brief description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Parent Category Selector */}
          <div className="flex flex-col gap-y-2">
            <Label>Parent Category</Label>
            <Select
              value={parentCategory?.id || "none"}
              onValueChange={(value) =>
                setParentCategory(
                  value === "none"
                    ? null
                    : categories.find((cat) => cat.id === value) || null
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {memoizedCategoryOptions}
              </SelectContent>
            </Select>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Active Status</Label>
              <div className="text-sm text-gray-500">
                Enable or disable this category
              </div>
            </div>
            <Switch checked={active} onCheckedChange={setActive} />
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

export default CategoryForm;
