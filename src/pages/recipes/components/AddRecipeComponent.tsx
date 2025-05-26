import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { resetUploadState } from "../../../store/features/uploads/uploadSlice";
import TextField from "@/components/common/TextField";
import { PrimaryButton, SecondaryButton } from "@/components/common/Button";
import MarkdownEditor from "@uiw/react-md-editor";
import { CreateRecipeRequest } from "../../../store/features/recipe/requests/CreateRecipeRequest";
import ImageThumbnail from "@/components/common/ImageThumbnail";
import ProgressIndicator from "@/components/common/ProgressIndicator";
import IngredientItem from "./IngredientItem";
import { fetchProducts } from "../../../store/features/products/productThunks";
import { ApiError } from "../../../types/ApiError";
import { uploadImages } from "../../../store/features/uploads/uploadThunks";
import {
  createRecipe,
  fetchRecipes,
} from "../../../store/features/recipe/recipeThunks";

const AddRecipeComponent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [productIds, setProductIds] = useState<string[]>([]);

  const { status: recipeStatus, error } = useAppSelector(
    (state) => state.recipes
  );
  const { products } = useAppSelector((state) => state.products);

  const {
    images,
    status: uploadStatus,
    error: uploadError,
  } = useAppSelector((state) => state.uploads);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (uploadError) {
      toast.error(uploadError);
    }
  }, [uploadError]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      await dispatch(uploadImages([files[0]])).unwrap();
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error?.response?.data.error ?? "Upload failed");
    }
  };

  const handleRemoveImage = () => {
    dispatch(resetUploadState());
  };

  const handleSave = async () => {
    const recipeData: CreateRecipeRequest = {
      name,
      image: images[0] ?? "",
      short_description: shortDescription,
      description,
      product_ids: productIds,
    };

    try {
      await dispatch(createRecipe(recipeData)).unwrap();
      dispatch(resetUploadState());
      toast.success("Recipe created successfully");
      navigate(-1);
      setTimeout(() => {
        dispatch(fetchRecipes());
      }, 0);
    } catch (err) {
      console.error("Failed to create recipe:", err);
    }
  };

  const handleCancel = () => navigate(-1);

  const handleToggleProduct = (id: string) => {
    setProductIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-xl w-full h-screen flex flex-col">
      <div className="bg-white rounded-xl w-full mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-x-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
              {uploadStatus === "loading" ? (
                <div className="w-full h-32 flex items-center justify-center border rounded">
                  <ProgressIndicator />
                </div>
              ) : images.length > 0 ? (
                <ImageThumbnail src={images[0]} onRemove={handleRemoveImage} />
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

            <TextField
              label="Recipe Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pilau Beef"
              required
            />

            <TextField
              label="Short Description"
              name="short_description"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Short overview of the recipe"
              multiline
              rows={3}
            />
          </div>

          <div>
            <h2 className="text-sm font-medium mb-2">Ingredients</h2>
            <div className="flex flex-col space-y-2 max-h-80 overflow-y-auto pr-2">
              {products.map((product) => {
                return (
                  <IngredientItem
                    key={product.id}
                    checked={productIds.includes(product.id)}
                    image={product.images[0] ?? ""}
                    description={product.name}
                    onToggle={() => handleToggleProduct(product.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Recipe Description (Markdown)
          </label>
          <MarkdownEditor
            value={description}
            onChange={(val) => setDescription(val || "")}
            height="300px"
          />
        </div>

        <div className="bg-white border-t px-6 py-4 flex justify-end space-x-4">
          <SecondaryButton
            text="Cancel"
            onClick={handleCancel}
            className="px-6"
          />
          <PrimaryButton
            text={recipeStatus === "loading" ? "Saving..." : "Save"}
            onClick={handleSave}
            disabled={recipeStatus === "loading"}
            className="px-10"
          />
        </div>
      </div>
    </div>
  );
};

export default AddRecipeComponent;
