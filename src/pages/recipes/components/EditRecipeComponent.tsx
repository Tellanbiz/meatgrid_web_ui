import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { resetUploadState } from "../../../store/features/uploads/uploadSlice";
import TextField from "../../../components/TextField";
import MarkdownEditor from "@uiw/react-md-editor";
import ImageThumbnail from "../../../components/ImageThumbnail";
import ProgressIndicator from "../../../components/ProgressIndicator";
import { Button } from "../../../components/ui/button";
import IngredientItem from "./IngredientItem";
import { fetchProducts } from "../../../store/features/products/productThunks";
import { ApiError } from "../../../types/ApiError";
import { uploadImages } from "../../../store/features/uploads/uploadThunks";
import { selectProducts } from "../../../store/features/products/productSelectors";
import {
  fetchRecipeById,
  updateRecipe,
} from "../../../store/features/recipe/recipeThunks";
import { EditRecipeRequest } from "../../../store/features/recipe/requests/EditRecipeReqest";
import { clearSelectedRecipe } from "../../../store/features/recipe/recipeSlice";

const EditRecipeComponent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const recipe = useAppSelector((state) => state.recipes.selectedRecipe);
  const { status: recipeStatus, error } = useAppSelector(
    (state) => state.recipes
  );
  const products = useAppSelector(selectProducts);

  const {
    images,
    status: uploadStatus,
    error: uploadError,
  } = useAppSelector((state) => state.uploads);

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [productIds, setProductIds] = useState<string[]>([]);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchRecipeById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setShortDescription(recipe.short_description);
      setDescription(recipe.description);
      setProductIds(recipe.product_ids);
      setIsImageRemoved(false); // Reset image removed flag when loading a recipe
    }
  }, [recipe]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (uploadError) toast.error(uploadError);
  }, [uploadError]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      await dispatch(uploadImages([files[0]])).unwrap();
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error.response?.data.error ?? "Upload failed");
    }
  };

  const handleRemoveImage = () => {
    // Reset the upload state to clear any newly uploaded images
    dispatch(resetUploadState());
    
    // Set the flag to indicate image removal
    setIsImageRemoved(true);
  };

  const handleUpdate = async () => {
    if (!id) return;

    // Determine which image to use:
    // 1. Use newly uploaded image if available
    // 2. If image was removed, use empty string
    // 3. Use existing image if it hasn't been removed
    let imageToUse = "";
    if (images.length > 0) {
      // New image was uploaded
      imageToUse = images[0];
      // Reset the removed flag as we're using a new image
      setIsImageRemoved(false);
    } else if (!isImageRemoved && recipe?.image) {
      // Use existing image only if it wasn't removed
      imageToUse = recipe.image;
    }
    // Otherwise, imageToUse remains an empty string (no image)

    const updateData: EditRecipeRequest = {
      id,
      name,
      image: imageToUse,
      short_description: shortDescription,
      description,
      product_ids: productIds,
    };

    try {
      await dispatch(updateRecipe({ id, data: updateData })).unwrap();
      navigate(-1);
      setTimeout(() => {
        dispatch(fetchRecipeById(id));
      }, 0);
    } catch (err) {
      toast.error("Update failed");
      console.error("Failed to update recipe:", err);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearSelectedRecipe());
      dispatch(resetUploadState());
    };
  }, [dispatch]);

  const handleCancel = () => navigate(-1);

  const handleToggleProduct = (id: string) => {
    setProductIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  if (recipeStatus == "loading" && !recipe) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ProgressIndicator />
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl w-full h-screen flex flex-col">
      <div className="rounded-xl w-full mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-x-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
              {uploadStatus === "loading" ? (
                <div className="w-full h-32 flex items-center justify-center border rounded">
                  <ProgressIndicator />
                </div>
              ) : images.length > 0 ? (
                <ImageThumbnail src={images[0]} onRemove={handleRemoveImage} />
              ) : recipe?.image && !isImageRemoved ? (
                <ImageThumbnail
                  src={recipe.image}
                  onRemove={handleRemoveImage}
                />
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
          <Button variant="outline" onClick={handleCancel} className="px-6">
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleUpdate}
            disabled={recipeStatus === "loading"}
            className="px-10"
          >
            {recipeStatus === "loading" ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditRecipeComponent;
