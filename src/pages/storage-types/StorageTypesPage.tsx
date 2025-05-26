import { useEffect } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Storage Types</h1>
        <div className="flex gap-x-2">
          <Button
            variant="outline"
            size="sm"
            className="px-2"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="ml-2">Refresh</span>
          </Button>
          <Button size="sm" onClick={handleAddStorageType}>
            <Plus className="w-4 h-4 mr-2" />
            Add Type
          </Button>
        </div>
      </div>

      <div className="mt-2 card h-table">
        <StorageTypeTable
          storageTypes={storageTypes}
          isLoading={isLoading}
          onEdit={handleEditStorageType}
          onDelete={handleDeleteStorageType}
        />
      </div>
    </div>
  );
};

export default StorageTypesPage;
