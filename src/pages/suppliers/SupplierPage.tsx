import { RefreshCcw } from "lucide-react";
import { Button } from "../../components/ui/button";
import CreateSupplierDialog from "./components/CreateSupplierDialog";
import { useState } from "react";
import SuppliersTable from "./components/SuppliersTable";
import { useAppDispatch } from "../../store/hooks";
import { fetchSuppliers } from "../../store/features/suppliers/supplierThunks";

const SupplierPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const handleRefresh = () => {
    dispatch(fetchSuppliers());
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h4 className="text-md">Suppliers</h4>
        <div className="flex space-x-2">
          <Button variant="outline" className="" onClick={handleRefresh}>
            <RefreshCcw /> Refresh
          </Button>
          <Button className="btn" onClick={() => setIsDialogOpen(true)}>
            New Supplier
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <SuppliersTable />
      </div>

      <CreateSupplierDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};

export default SupplierPage;
