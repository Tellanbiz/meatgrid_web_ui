import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "../../components/ui/button";
import SupplierDialog from "./components/SupplierDialog";
import SuppliersTable from "./components/SuppliersTable";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchSuppliers } from "../../store/features/suppliers/supplierThunks";
import { Supplier } from "../../store/features/suppliers/supplierTypes";
import { useModal } from "../../hooks/use-modal";
import { useState } from "react";
import { selectIsFetchingSuppliers } from "../../store/features/suppliers/supplierSelectors";

const SupplierPage = () => {
  const { isOpen: isDialogOpen, openModal, closeModal } = useModal();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );

  const isFetching = useAppSelector(selectIsFetchingSuppliers);

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
    await openModal();
  };

  const handleCloseDialog = async () => {
    setSelectedSupplier(null);
    closeModal();
  };

  return (
    <>
      <div className="h-full overflow-hidden">
        <div className="flex justify-between items-center relative">
          <h4 className="text-md">Suppliers</h4>
          <div className="flex space-x-2">
            <Button variant="outline" className="" onClick={handleRefresh}>
              <RefreshCcw className={`${isFetching && "animate-spin"}`} />
              Refresh
            </Button>
            <Button
              className="btn"
              onClick={() => handleOpenDialog(false, null)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Supplier
            </Button>
          </div>
        </div>

        <div className="pt-4">
          <SuppliersTable
            onEdit={(supplier) => handleOpenDialog(true, supplier)}
          />
        </div>

        <SupplierDialog
          open={isDialogOpen}
          onOpenChange={handleCloseDialog}
          isEditMode={isEditMode}
          initialValues={selectedSupplier || undefined}
        />
      </div>
    </>
  );
};

export default SupplierPage;
