import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCategories,
  createCategory,
  updateCategory,
} from "@/store/features/categories/categoryThunks";
import { CategoryFormData } from "./components/CategoryForm";
import CategoryForm from "./components/CategoryForm";
import { toast } from "sonner";
import { UpdateCategoryRequest } from "../../store/features/categories/request/UpdateCategoryRequest";
import { CreateCategoryRequest } from "../../store/features/categories/request/CreateCategoryRequest";

const ManageCategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isEditMode = Boolean(categoryId);

  const { categories } = useAppSelector((state) => state.categories);
  const [formLoading, setFormLoading] = useState(false);

  const selectedCategory = categories.find((cat) => cat.id === categoryId);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const initialValues: CategoryFormData = {
    name: selectedCategory?.name || "",
    description: selectedCategory?.description || "",
    parentCategory: selectedCategory || null,
    image: selectedCategory?.image || "",
  };

  const handleSubmit = async (formData: CategoryFormData) => {
    try {
      setFormLoading(true);
      if (isEditMode) {
        const updateRequest: UpdateCategoryRequest = {
          id: categoryId!,
          image: formData.image,
          name: formData.name,
          description: formData.description,
          parent_id: formData.parentCategory?.id || "",
        };

        await dispatch(updateCategory(updateRequest)).unwrap();
        toast.success("Category updated successfully");
      } else {
        const createRequest: CreateCategoryRequest = {
          image: formData.image || "",
          name: formData.name,
          description: formData.description || "",
          parent_id: formData.parentCategory?.id || "",
        };

        await dispatch(createCategory(createRequest)).unwrap();
        toast.success("Category created successfully");
      }
      navigate(-1);
    } catch (err: unknown) {
      toast.error(`Failed to save category: ${err}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="h-full">
      <CategoryForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditMode={isEditMode}
        isLoading={formLoading}
      />
    </div>
  );
};

export default ManageCategoryPage;
