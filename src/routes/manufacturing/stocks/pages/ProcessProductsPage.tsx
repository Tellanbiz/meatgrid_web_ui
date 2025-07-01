import { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  selectIsFetchingStorageTypes,
  selectStorageTypes,
} from "@/store/features/storages/storageSelectors";
import {
  selectIsFetchingStores,
  selectStores,
} from "@/store/features/stores/storeSelectors";
import {
  selectSuppliers as selectAvailableSuppliers,
  selectIsFetchingSuppliers,
} from "@/store/features/suppliers/supplierSelectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchStorageTypes } from "@/store/features/storages/storageThunks";
import { fetchSuppliers } from "@/store/features/suppliers/supplierThunks";
import { fetchStores } from "@/store/features/stores/storeThunks";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCcw, Store, Warehouse, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  setStorageType,
  setStore,
  setSuppliers,
} from "@/store/features/process-products/processProductSlice";
import {
  selectStore,
  selectStorageType,
  selectSuppliers,
} from "@/store/features/process-products/processProductSelectors";
import LoadingPage from "@/components/navigation/LoadingPage";

const ProcessProductsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Fetch available options
  const storageTypes = useAppSelector(selectStorageTypes);
  const suppliers = useAppSelector(selectAvailableSuppliers);
  const stores = useAppSelector(selectStores);

  // Get selected values from Redux store
  const selectedStoreFromRedux = useAppSelector(selectStore);
  const selectedStorageTypeFromRedux = useAppSelector(selectStorageType);
  const selectedSuppliersFromRedux = useAppSelector(selectSuppliers);

  // Local state for selections
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedStorageType, setSelectedStorageType] = useState<string | null>(
    null
  );
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);

  // Loading states for each section
  const isLoadingStores = useAppSelector(selectIsFetchingStores);
  const isLoadingStorageTypes = useAppSelector(selectIsFetchingStorageTypes);
  const isLoadingSuppliers = useAppSelector(selectIsFetchingSuppliers);

  const handleRefreshStores = useCallback(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  const handleRefreshStorageTypes = useCallback(() => {
    dispatch(fetchStorageTypes());
  }, [dispatch]);

  const handleRefreshSuppliers = useCallback(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  useEffect(() => {
    // Fetch data if not already loaded
    if (!stores?.length) handleRefreshStores();
    if (!storageTypes?.length) handleRefreshStorageTypes();
    if (!suppliers?.length) handleRefreshSuppliers();

    // Sync local state with Redux store
    setSelectedStore(selectedStoreFromRedux || null);
    setSelectedStorageType(selectedStorageTypeFromRedux || null);
    setSelectedSuppliers(selectedSuppliersFromRedux || []);
  }, [
    stores,
    storageTypes,
    suppliers,
    selectedStoreFromRedux,
    selectedStorageTypeFromRedux,
    selectedSuppliersFromRedux,
    handleRefreshStores,
    handleRefreshStorageTypes,
    handleRefreshSuppliers,
  ]);

  const handleContinue = () => {
    if (!selectedStore || !selectedStorageType) {
      alert("Please select a store and a storage type.");
      return;
    }

    dispatch(setStore(selectedStore));
    dispatch(setStorageType(selectedStorageType));
    dispatch(setSuppliers(selectedSuppliers));
    navigate("/stock/process/select-products");
  };

  const isContinueDisabled =
    !selectedStore || !selectedStorageType || selectedSuppliers.length === 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Process Products
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Select store, storage type, and suppliers to continue
                </p>
              </div>
            </div>
            <Button
              onClick={handleContinue}
              disabled={isContinueDisabled}
              variant="default"
              className="px-6"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Store Selection Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-gray-500" />
                <Label
                  htmlFor="stores"
                  className="font-medium text-base text-gray-900"
                >
                  Store
                </Label>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshStores}
                disabled={isLoadingStores}
                className="hover:bg-gray-100"
              >
                <RefreshCcw
                  className={`h-4 w-4 ${isLoadingStores ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
            {isLoadingStores ? (
              <LoadingPage />
            ) : (
              <RadioGroup
                id="stores"
                className="overflow-y-auto max-h-[400px] rounded-md space-y-1"
                value={selectedStore ?? undefined}
                onValueChange={(value) => setSelectedStore(value)}
              >
                {stores?.length > 0 ? (
                  stores.map((store) => (
                    <div
                      key={store.id}
                      className="flex items-center space-x-2 rounded-md hover:bg-gray-50 p-2 transition-colors"
                    >
                      <RadioGroupItem
                        id={`store-${store.id}`}
                        value={store.id}
                      />
                      <Label
                        htmlFor={`store-${store.id}`}
                        className="text-sm w-full cursor-pointer"
                      >
                        {store.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 p-2">
                    No stores available
                  </p>
                )}
              </RadioGroup>
            )}
          </div>

          {/* Storage Type Selection Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-gray-500" />
                <Label
                  htmlFor="storageTypes"
                  className="font-medium text-base text-gray-900"
                >
                  Storage Type
                </Label>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshStorageTypes}
                disabled={isLoadingStorageTypes}
                className="hover:bg-gray-100"
              >
                <RefreshCcw
                  className={`h-4 w-4 ${
                    isLoadingStorageTypes ? "animate-spin" : ""
                  }`}
                />
              </Button>
            </div>
            {isLoadingStorageTypes ? (
              <LoadingPage />
            ) : (
              <RadioGroup
                id="storageTypes"
                className="overflow-y-auto max-h-[400px] rounded-md space-y-1"
                value={selectedStorageType ?? undefined}
                onValueChange={(value) => setSelectedStorageType(value)}
              >
                {storageTypes?.length > 0 ? (
                  storageTypes.map((type) => (
                    <div
                      key={type.id}
                      className="flex items-center space-x-2 rounded-md hover:bg-gray-50 p-2 transition-colors"
                    >
                      <RadioGroupItem
                        id={`storageType-${type.id}`}
                        value={type.id}
                      />
                      <Label
                        htmlFor={`storageType-${type.id}`}
                        className="text-sm w-full cursor-pointer"
                      >
                        {type.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 p-2">
                    No storage types available
                  </p>
                )}
              </RadioGroup>
            )}
          </div>

          {/* Supplier Selection Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <Label
                  htmlFor="suppliers"
                  className="font-medium text-base text-gray-900"
                >
                  Suppliers
                </Label>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshSuppliers}
                disabled={isLoadingSuppliers}
                className="hover:bg-gray-100"
              >
                <RefreshCcw
                  className={`h-4 w-4 ${
                    isLoadingSuppliers ? "animate-spin" : ""
                  }`}
                />
              </Button>
            </div>
            {isLoadingSuppliers ? (
              <LoadingPage />
            ) : (
              <div
                id="suppliers"
                className="overflow-y-auto max-h-[400px] rounded-md space-y-1"
              >
                {suppliers?.length > 0 ? (
                  suppliers.map((supplier) => (
                    <div
                      key={supplier.id}
                      className="flex items-center space-x-2 rounded-md hover:bg-gray-50 p-2 transition-colors"
                    >
                      <Checkbox
                        id={`supplier-${supplier.id}`}
                        checked={selectedSuppliers.includes(supplier.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSuppliers((prev) => [
                              ...prev,
                              supplier.id,
                            ]);
                          } else {
                            setSelectedSuppliers((prev) =>
                              prev.filter((id) => id !== supplier.id)
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={`supplier-${supplier.id}`}
                        className="text-sm w-full cursor-pointer"
                      >
                        {supplier.full_name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 p-2">
                    No suppliers available
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessProductsPage;
