import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/features/categories/categoryThunks";
import { resetUploadState } from "@/store/features/uploads/uploadSlice";
import { updateCategory } from "@/store/features/categories/categoryThunks";
import ImageThumbnail from "@/components/common/ImageThumbnail";
import ProgressIndicator from "@/components/common/ProgressIndicator";
import { toast } from "sonner";
import { ApiError } from "@/types/ApiError";
import { Category } from "@/store/features/categories/categoryTypes";
import { UpdateCategoryRequest } from "@/store/features/categories/request/UpdateCategoryRequest";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { uploadImages } from "../../../store/features/uploads/uploadThunks";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  tag: z.string().optional(),
  parent_id: z.string().optional(),
  image: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditCategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { categories, status } = useAppSelector((state) => state.categories);
  const { status: uploadStatus, error: uploadError } = useAppSelector(
    (state) => state.uploads
  );

  const category = categories.find((cat) => cat.id === categoryId) as Category;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      tag: "",
      parent_id: "",
      image: "",
    },
  });

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const imageUrl = watch("image");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("description", category.description || "");
      setValue("tag", category.tag || "");
      setValue("parent_id", category.parent_id || "");
      setValue("image", category.image || "");
    }
  }, [category, setValue]);

  useEffect(() => {
    if (uploadError) {
      toast.error(uploadError);
    }
  }, [uploadError]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      const res = await dispatch(uploadImages([files[0]])).unwrap();
      if (res && res.length > 0) {
        setValue("image", res[0]);
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error?.response?.data?.error ?? "Upload failed");
    }
  };

  const handleRemoveImage = () => {
    setValue("image", "");
    dispatch(resetUploadState());
  };

  const onSubmit = async (values: FormValues) => {
    if (!categoryId) return;

    const updatedCategory: UpdateCategoryRequest = {
      id: categoryId,
      name: values.name,
      description: values.description || "",
      parent_id: values.parent_id || undefined,
      image: values.image,
    };

    try {
      await dispatch(updateCategory(updatedCategory)).unwrap();
      toast.success("Category updated successfully");
      navigate(-1);
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error?.response?.data?.error ?? "Update failed");
    }
  };

  if (!categoryId || !category) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-xl w-full h-screen flex flex-col">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl w-full mx-auto space-y-6 p-10"
        >
          <div className="grid grid-cols-2 gap-x-10">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 flex-wrap">
                {uploadStatus === "loading" ? (
                  <div className="w-full h-32 flex items-center justify-center border rounded">
                    <ProgressIndicator />
                  </div>
                ) : imageUrl ? (
                  <ImageThumbnail src={imageUrl} onRemove={handleRemoveImage} />
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

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag</FormLabel>
                    <FormControl>
                      <Input disabled placeholder="Optional tag" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? "" : value)
                      }
                      value={field.value || "none"}
                      disabled={status === "loading"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {categories
                          .filter((cat) => cat.id !== categoryId)
                          .map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-white border-t pt-6 flex justify-end space-x-4">
            <Button variant="ghost" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || status === "loading"}
            >
              {(isSubmitting || status === "loading") && (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
