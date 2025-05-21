import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectBannerById,
  selectBannerError,
  selectBannerSuccessMessage,
} from "../../store/features/banners/bannerSelectors";
import { selectCategories } from "../../store/features/categories/categorySelectors";
import { selectTags } from "../../store/features/tags/tagSelectors";
import BannerForm, { BannerFormData } from "./components/BannerForm";
import {
  createBanner,
  updateBanner,
} from "../../store/features/banners/bannerThunks";
import { CreateBannerRequest } from "../../store/features/banners/request/CreateBannerRequest";
import { UpdateBannerRequest } from "../../store/features/banners/request/UpdateBannerRequest";
import { fetchCategories } from "../../store/features/categories/categoryThunks";
import { fetchTags } from "../../store/features/tags/tagThunks";
import { uploadImages } from "../../store/features/uploads/uploadThunks";
import { toast } from "sonner";
import { resetBannerState } from "../../store/features/banners/bannerSlice";

const ManageBannerPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { bannerId } = useParams();
  const isEditMode = Boolean(bannerId);

  const selectedBanner = useAppSelector((state) =>
    bannerId ? selectBannerById(state, bannerId) : undefined
  );
  const categories = useAppSelector(selectCategories);
  const tags = useAppSelector(selectTags);
  const successMessage = useAppSelector(selectBannerSuccessMessage);
  const errorMessage = useAppSelector(selectBannerError);

  const [formLoading, setFormLoading] = useState<boolean>(false);

  const initialValues: BannerFormData = {
    image: selectedBanner?.image || "",
    name: selectedBanner?.name || "",
    tag: tags.find((tag) => tag.id === selectedBanner?.tag_id) || null,
    category:
      categories.find(
        (category) => category.id === selectedBanner?.category_id
      ) || null,
    active: selectedBanner?.active || false,
  };

  const handleSubmit = async (formData: BannerFormData) => {
    try {
      setFormLoading(true);

      let imageUrl = typeof formData.image === "string" ? formData.image : null;

      // If the image is a File, upload it first
      if (formData.image instanceof File) {
        const uploadResult = await dispatch(
          uploadImages([formData.image])
        ).unwrap();
        imageUrl = uploadResult[0];
      }

      if (isEditMode) {
        const updateRequest: UpdateBannerRequest = {
          id: bannerId!,
          image: imageUrl || "",
          name: formData.name,
          tag_id: formData.tag?.id || "",
          category_id: formData.category?.id || "",
          active: formData.active,
        };
        await dispatch(updateBanner(updateRequest));
      } else {
        const createRequest: CreateBannerRequest = {
          image: imageUrl || "",
          name: formData.name,
          tag_id: formData.tag?.id || "",
          category_id: formData.category?.id || "",
          active: formData.active,
        };
        await dispatch(createBanner(createRequest));
      }
    } catch (err) {
      console.error("Failed to save banner:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTags());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(resetBannerState());
      navigate(-1);
    }
  }, [successMessage, navigate, dispatch]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(resetBannerState());
    }
  }, [errorMessage, dispatch]);

  return (
    <div className="h-full p-6">
      <div className="mt-4">
        <BannerForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditMode={isEditMode}
          isLoading={formLoading}
          tags={tags}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default ManageBannerPage;
