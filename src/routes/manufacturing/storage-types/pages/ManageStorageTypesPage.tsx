import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectStorageTypeById } from "@/store/features/storages/storageSelectors";
import Breadcrumbs from "@/components/common/breadcrumbs";
import StorageTypeForm, {
  StorageTypeFormData,
} from "../components/StorageTypeForm";
import {
  createStorageType,
  fetchStorageTypes,
  updateStorageType,
} from "@/store/features/storages/storageThunks";
import { toast } from "sonner";
import { CreateStorageRequest } from "@/store/features/storages/request/CreateStorageRequest";
import { UpdateStorageRequest } from "@/store/features/storages/request/UpdateStorageRequest";

const ManageStorageTypesPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { storageTypeId } = useParams();
  const isEditMode = Boolean(storageTypeId);

  const selectedStorageType = useAppSelector((state) =>
    storageTypeId ? selectStorageTypeById(state, storageTypeId) : undefined
  );

  const [formLoading, setFormLoading] = useState<boolean>(false);

  const initialValues: StorageTypeFormData = {
    name: selectedStorageType?.name || "",
    description: selectedStorageType?.description || "",
    duration_type: selectedStorageType?.duration_type || "short",
    expected_duration: selectedStorageType?.expected_duration || 0,
    min_temp: selectedStorageType?.min_temp || 0,
    max_temp: selectedStorageType?.max_temp || 0,
  };

  const handleSubmit = async (formData: StorageTypeFormData) => {
    try {
      setFormLoading(true);
      if (isEditMode) {
        await handleUpdateStorageType(storageTypeId!, formData);
      } else {
        await createNewStorageType(formData);
      }
      dispatch(fetchStorageTypes());
      navigate(-1);
      toast.success(
        `Storage type ${isEditMode ? "updated" : "created"} successfully`
      );
    } catch (err: unknown) {
      console.log("ManageStorageTypesPage -> handleSubmit -> err", err);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} storage type`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const createNewStorageType = async (data: StorageTypeFormData) => {
    const request: CreateStorageRequest = {
      name: data.name,
      description: data.description,
      duration_type: data.duration_type,
      expected_duration: data.expected_duration,
      min_temp: data.min_temp,
      max_temp: data.max_temp,
    };

    await dispatch(createStorageType(request)).unwrap();
  };

  const handleUpdateStorageType = async (
    id: string,
    data: StorageTypeFormData
  ) => {
    const request: UpdateStorageRequest = {
      id,
      name: data.name,
      description: data.description,
      duration_type: data.duration_type,
      expected_duration: data.expected_duration,
      min_temp: data.min_temp,
      max_temp: data.max_temp,
    };

    await dispatch(updateStorageType(request)).unwrap();
  };

  return (
    <div className="h-full p-6">
      <Breadcrumbs
        items={[
          { label: "Storage Types", to: "/storage-types" },
          {
            label: isEditMode ? "Edit Storage Type" : "Add Storage Type",
            isPage: true,
          },
        ]}
      />

      <div className="mt-4">
        <StorageTypeForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditMode={isEditMode}
          isLoading={formLoading}
        />
      </div>
    </div>
  );
};

export default ManageStorageTypesPage;
