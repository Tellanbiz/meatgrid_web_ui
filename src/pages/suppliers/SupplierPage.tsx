import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import SupplierDialog from "./components/SupplierDialog";
import SuppliersTable from "./components/SuppliersTable";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchSuppliers } from "../../store/features/suppliers/supplierThunks";
import { Supplier } from "../../store/features/suppliers/supplierTypes";
import { useModal } from "../../shared/hooks/use-modal";
import { useState } from "react";
import { selectIsFetchingSuppliers } from "../../store/features/suppliers/supplierSelectors";

const SupplierPage = () => {
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useModal();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );

  const isFetchingSuppliers = useAppSelector(selectIsFetchingSuppliers);

  const dispatch = useAppDispatch();

  const handleRefresh = () => {
    dispatch(fetchSuppliers());
  };

  const handleOpenDialog = async (
    isEdit: boolean,
    supplier: Supplier | null = null
  ) => {
    setIsEditMode(isEdit);
    setSelectedSupplier(supplier);
    setIsSupplierDialogOpen(true);
  };

  const handleCloseDialog = async () => {
    setSelectedSupplier(null);
    setIsSupplierDialogOpen(false);
  };

  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Suppliers</h1>
        <div className="flex gap-x-2">
          <Button
            variant="outline"
            size="sm"
            className="px-2"
            onClick={handleRefresh}
            disabled={isFetchingSuppliers}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetchingSuppliers ? "animate-spin" : ""}`}
            />
            <span className="ml-2">Refresh</span>
          </Button>
          <Button size="sm" onClick={() => handleOpenDialog(false, null)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      <div className="mt-2 card h-table">
        <SuppliersTable
          onEdit={(supplier) => handleOpenDialog(true, supplier)}
        />
      </div>

      <SupplierDialog
        open={isSupplierDialogOpen}
        onOpenChange={handleCloseDialog}
        isEditMode={isEditMode}
        initialValues={selectedSupplier || undefined}
      />
    </div>
  );
};

export default SupplierPage;
