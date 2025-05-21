import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectStoreById } from "../../store/features/stores/storeSelectors";
import WarehouseForm, { WarehouseFormData } from "./components/WareHouseForm";
import { CreateStoreRequest } from "../../store/features/stores/requests/CreateStoreRequest";
import {
  createStore,
  updateStore,
} from "../../store/features/stores/storeThunks";
import { UpdateStoreRequest } from "../../store/features/stores/requests/UpdateStoreRequest";

const ManageWareHousePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { warehouseId } = useParams();
  const isEditMode = Boolean(warehouseId);

  const selectedStore = useAppSelector((state) =>
    warehouseId ? selectStoreById(state, warehouseId) : undefined
  );

  const [formLoading, setFormLoading] = useState<boolean>(false);

  const initialValues: WarehouseFormData = {
    id: selectedStore?.id || "",
    name: selectedStore?.name || "",
    description: selectedStore?.description || "",
    address: selectedStore?.address || "",
    building: selectedStore?.building_name || "",
    latitude: selectedStore?.points[0].toString() || "",
    longitude: selectedStore?.points[1].toString() || "",
    isStore: selectedStore?.is_store || false,
    isWarehouse: selectedStore?.is_warehouse || false,
    status: selectedStore?.is_active ? "active" : "inactive",
  };

  const handleSubmit = async (formData: WarehouseFormData) => {
    try {
      setFormLoading(true);
      if (isEditMode) {
        await updateWareHouse(warehouseId!, formData);
      } else {
        await createWareHouse(formData);
      }
      navigate(-1);
      setFormLoading(false);
    } catch (err) {
      console.error("Failed to save warehouse:", err);
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const createWareHouse = async (data: WarehouseFormData) => {
    const request: CreateStoreRequest = {
      name: data.name,
      description: data.description || "",
      address: data.address,
      building_name: data.building || "",
      points: [Number(data.latitude), Number(data.longitude)],
      is_store: data.isStore,
      is_warehouse: data.isWarehouse,
      is_active: data.status === "active",
    };

    dispatch(createStore(request));
  };

  const updateWareHouse = async (id: string, data: WarehouseFormData) => {
    const updateRequest: UpdateStoreRequest = {
      id: id,
      name: data.name,
      description: data.description || "",
      address: data.address,
      building_name: data.building || "",
      points: [Number(data.latitude), Number(data.longitude)],
      is_store: data.isStore,
      is_warehouse: data.isWarehouse,
      is_active: data.status === "active",
    };

    dispatch(updateStore(updateRequest));
  };

  return (
    <div className="h-full p-6">
      <WarehouseForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditMode={isEditMode}
        isLoading={formLoading}
      />
    </div>
  );
};

export default ManageWareHousePage;
