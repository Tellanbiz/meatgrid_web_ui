import { useEffect, useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import Breadcrumbs from "../../components/breadcrumbs";
import { Button } from "../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  deleteStorageType,
  fetchStorageTypes,
} from "../../store/features/storages/storageThunks";
import {
  selectStorageTypes,
  selectStorageError,
  selectIsFetchingStorageTypes,
} from "../../store/features/storages/storageSelectors";
import { toast } from "sonner";
import { resetStorageState } from "../../store/features/storages/storageSlice";
import StorageTypeTable from "./components/StorageTypeTable";
import { useNavigate } from "react-router-dom";

const StorageTypesPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const storageTypes = useAppSelector(selectStorageTypes);
  const isLoading = useAppSelector(selectIsFetchingStorageTypes);
  const error = useAppSelector(selectStorageError);

  const [isFormLoading, setIsFormLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchStorageTypes());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetStorageState());
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchStorageTypes());
  };

  const handleAddStorageType = () => {
    navigate("/storage-types/new");
  };

  const handleEditStorageType = (storageTypeId: string) => {
    navigate(`/storage-types/${storageTypeId}/edit`);
  };

  const handleDeleteStorageType = async (storageTypeId: string) => {
    try {
      await dispatch(deleteStorageType(storageTypeId)).unwrap();
      toast.success("Storage type deleted successfully");
      dispatch(fetchStorageTypes());
    } catch (err: unknown) {
      console.error("Error deleting storage type:", err);
    }
  };

  return (
    <div className="bg-background">
      <div className="flex justify-between items-center bg-background py-3 sticky top-16 z-20">
        <Breadcrumbs items={[{ label: "Storage Types", isPage: true }]} />

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Refresh"
          >
            <RefreshCcw
              className={`size-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button onClick={handleAddStorageType}>
            <Plus className="size-4" />
            Add Storage Type
          </Button>
        </div>
      </div>

      <StorageTypeTable
        storageTypes={storageTypes}
        isLoading={isLoading || isFormLoading}
        onEdit={handleEditStorageType}
        onDelete={handleDeleteStorageType}
      />
    </div>
  );
};

export default StorageTypesPage;
