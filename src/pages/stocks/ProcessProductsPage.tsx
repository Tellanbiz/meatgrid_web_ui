import { useCallback, useEffect, useState } from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import { Label } from "../../components/ui/label";
import {
  selectIsFetchingStorageTypes,
  selectStorageTypes,
} from "../../store/features/storages/storageSelectors";
import {
  selectIsFetchingStores,
  selectStores,
} from "../../store/features/stores/storeSelectors";
import {
  selectSuppliers as selectAvailableSuppliers,
  selectIsFetchingSuppliers,
} from "../../store/features/suppliers/supplierSelectors";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchStorageTypes } from "../../store/features/storages/storageThunks";
import { fetchSuppliers } from "../../store/features/suppliers/supplierThunks";
import { fetchStores } from "../../store/features/stores/storeThunks";
import { Checkbox } from "../../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Button } from "../../components/ui/button";
import { ArrowRight, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  setStorageType,
  setStore,
  setSuppliers,
} from "../../store/features/process-products/processProductSlice";
import {
  selectStore,
  selectStorageType,
  selectSuppliers,
} from "../../store/features/process-products/processProductSelectors";
import LoadingPage from "../../components/LoadingPage";
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
    <div>
      <div className="sticky top-16 z-20 bg-background flex items-center justify-between py-3">
        <Breadcrumbs
          items={[
            {
              label: "Stock",
              to: "/stock",
            },
            {
              label: "Process Products",
              isPage: false,
            },
          ]}
        />

        <Button
          onClick={handleContinue}
          className="px-2"
          disabled={isContinueDisabled}
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
        {/* Store Selection */}
        <div className="space-y-2 h-table">
          <div className="flex items-center space-x-2">
            <Label htmlFor="stores" className="font-normal text-base">
              Store
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshStores}
              disabled={isLoadingStores}
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
              className="overflow-y-auto rounded-md p-2 space-y-2"
              value={selectedStore ?? undefined}
              onValueChange={(value) => setSelectedStore(value)}
            >
              {stores?.length > 0 ? (
                stores.map((store) => (
                  <div
                    key={store.id}
                    className="flex items-center space-x-2 rounded-md hover:bg-gray-100"
                  >
                    <RadioGroupItem id={`store-${store.id}`} value={store.id} />
                    <Label
                      htmlFor={`store-${store.id}`}
                      className="text-sm w-full py-2"
                    >
                      {store.name}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No stores available</p>
              )}
            </RadioGroup>
          )}
        </div>

        {/* Storage Type Selection */}
        <div className="space-y-2 h-table">
          <div className="flex items-center space-x-2">
            <Label htmlFor="storageTypes" className="font-normal text-base">
              Storage Type
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshStorageTypes}
              disabled={isLoadingStorageTypes}
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
              className="h-table overflow-y-auto rounded-md p-2 space-y-1"
              value={selectedStorageType ?? undefined}
              onValueChange={(value) => setSelectedStorageType(value)}
            >
              {storageTypes?.length > 0 ? (
                storageTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center space-x-2 rounded-md hover:bg-gray-100"
                  >
                    <RadioGroupItem
                      id={`storageType-${type.id}`}
                      value={type.id}
                    />
                    <Label
                      htmlFor={`storageType-${type.id}`}
                      className="text-sm w-full py-2"
                    >
                      {type.name}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No storage types available
                </p>
              )}
            </RadioGroup>
          )}
        </div>

        {/* Supplier Selection */}
        <div className="space-y-2 h-table">
          <div className="flex items-center space-x-2">
            <Label htmlFor="suppliers" className="font-normal text-base">
              Suppliers
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshSuppliers}
              disabled={isLoadingSuppliers}
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
              className="h-full overflow-y-auto rounded-md p-2 space-y-2"
            >
              {suppliers?.length > 0 ? (
                suppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="flex items-center space-x-2 rounded-md hover:bg-gray-100"
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
                      className="text-sm py-2 w-full"
                    >
                      {supplier.full_name}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No suppliers available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessProductsPage;
