import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/breadcrumbs";
import WarehouseForm, { WarehouseFormData } from "./components/WareHouseForm";

const ManageWareHousePage = () => {
  const navigate = useNavigate();
  const { warehouseId } = useParams();
  const isEditMode = Boolean(warehouseId);
  const [initialData, setInitialData] = useState<
    WarehouseFormData | undefined
  >();
  const [formLoading, setFormLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        setFormLoading(true);
        const data = await fakeFetchWarehouseById(warehouseId);
        setInitialData(data);
        setFormLoading(false);
      };
      fetchData();
    }
  }, [isEditMode, warehouseId]);

  const handleSubmit = async (formData: WarehouseFormData) => {
    try {
      setFormLoading(true);
      if (isEditMode) {
        await fakeUpdateWarehouse(warehouseId!, formData);
      } else {
        await fakeCreateWarehouse(formData);
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

  return (
    <div className="h-full">
      <Breadcrumbs
        items={[
          { label: "Warehouses", to: "/warehouses" },
          { label: isEditMode ? "Edit Store" : "Add Store", isPage: true },
        ]}
      />

      <div className="mt-4">
        <WarehouseForm
          initialValues={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditMode={isEditMode}
          isLoading={formLoading}
        />
      </div>
    </div>
  );
};

export default ManageWareHousePage;

// Temporary mock functions
const fakeFetchWarehouseById = async (
  id: string | undefined
): Promise<WarehouseFormData> => ({
  name: "Kajiado Central",
  description: "Main warehouse in Kajiado",
  address: "Kajiado",
  building: "Block A",
  latitude: "-1.2921",
  longitude: "36.8219",
  isWarehouse: true,
  isStore: false,
  status: "active",
});

const fakeCreateWarehouse = async (data: WarehouseFormData) => {
  console.log("Creating", data);
  await new Promise((resolve) => setTimeout(resolve, 5000));
};

const fakeUpdateWarehouse = async (id: string, data: WarehouseFormData) => {
  console.log("Updating", id, data);
  await new Promise((resolve) => setTimeout(resolve, 5000));
};
