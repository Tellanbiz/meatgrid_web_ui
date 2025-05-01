import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectProductById } from "../../store/features/products/productSelectors";
import {
  fetchProducts,
  createProduct,
  updateProduct,
} from "../../store/features/products/productThunks";
import { toast } from "sonner";
import ProductForm, { ProductFormData } from "./components/ProductForm";
import { selectTags } from "../../store/features/tags/tagSelectors";
import { selectCategories } from "../../store/features/categories/categorySelectors";
import { fetchTags } from "../../store/features/tags/tagThunks";
import { fetchCategories } from "../../store/features/categories/categoryThunks";
import { CreateProductRequest } from "../../store/features/products/requests/CreateProductRequest";
import { UpdateProductRequest } from "../../store/features/products/requests/UpdateProductRequest";
import { uploadImages } from "../../store/features/uploads/uploadThunks";
import Breadcrumbs from "../../components/breadcrumbs";

const ManageProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);

  const selectedProduct = useAppSelector((state) =>
    productId ? selectProductById(state, productId) : undefined
  );
  const tags = useAppSelector(selectTags);
  const categories = useAppSelector(selectCategories);

  const [formLoading, setFormLoading] = useState(false);

  const initialValues: ProductFormData = {
    name: selectedProduct?.name || "",
    description: selectedProduct?.description || "",
    regular_price: selectedProduct?.regular_price || 0,
    unit_type: selectedProduct?.unit_type || "",
    package_quantity: selectedProduct?.weight || 0,
    min_stock_quantity: selectedProduct?.minimum_stock_quantity || 0,
    is_product: selectedProduct?.is_product || false,
    is_raw_material: selectedProduct?.is_raw_material || false,
    allow_editable_weight: selectedProduct?.allow_cart_weight || false,
    category_id: selectedProduct?.category_id || null,
    tag_id: selectedProduct?.tag_id || null,
    images: selectedProduct?.images || [],
  };

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      setFormLoading(true);

      const filesToUpload = formData.images.filter(
        (image) => image instanceof File
      ) as File[];
      const existingUrls = formData.images.filter(
        (image) => typeof image === "string"
      ) as string[];

      // Upload all files at once if there are any
      let uploadedUrls: string[] = [];
      if (filesToUpload.length > 0) {
        uploadedUrls = await dispatch(uploadImages(filesToUpload)).unwrap();
      }

      // Combine uploaded URLs with existing URLs
      const allImageUrls = [...existingUrls, ...uploadedUrls];

      if (isEditMode) {
        const updateRequest: UpdateProductRequest = {
          id: productId!,
          name: formData.name,
          description: formData.description || "",
          regular_price: formData.regular_price,
          unit_type: formData.unit_type,
          weight: formData.package_quantity,
          allow_cart_weight: formData.allow_editable_weight,
          category_id: formData.category_id!,
          tag_id: formData.tag_id!,
          images: allImageUrls,
          is_product: formData.is_product,
          is_raw_material: formData.is_raw_material,
          minimum_stock_quantity: formData.min_stock_quantity,
        };

        await dispatch(updateProduct(updateRequest)).unwrap();
        toast.success("Product updated successfully");
      } else {
        const createRequest: CreateProductRequest = {
          name: formData.name,
          description: formData.description || "",
          regular_price: formData.regular_price,
          unit_type: formData.unit_type,
          weight: formData.package_quantity,
          allow_cart_weight: formData.allow_editable_weight,
          category_id: formData.category_id!,
          tag_id: formData.tag_id!,
          images: allImageUrls,
          is_product: formData.is_product,
          is_raw_material: formData.is_raw_material,
          minimum_stock_quantity: formData.min_stock_quantity,
        };

        await dispatch(createProduct(createRequest)).unwrap();
        toast.success("Product created successfully");
      }

      navigate(-1);
    } catch (err: unknown) {
      console.error("Error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(fetchTags());
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);
  
  return (
    <div className="">
      <div className="sticky top-16 z-10 bg-background py-3">
        <Breadcrumbs
          items={[
            { label: "Products", to: "/products" },
            { label: isEditMode ? "Edit Product" : "Add Product" },
          ]}
        />
      </div>

      <div className="mt-2">
        <ProductForm
          initialValues={initialValues}
          tags={tags}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditMode={isEditMode}
          isLoading={formLoading}
        />
      </div>
    </div>
  );
};

export default ManageProductPage;
