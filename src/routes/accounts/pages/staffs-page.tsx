import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useEffect, useState } from "react";
import { fetchStaffs } from "../../../store/features/staff/staffThunks";
import { Staff } from "../../../store/features/staff/staffTypes";
import StaffsTable from "../components/StaffsTable";
import { selectIsFetchingStaffs } from "../../../store/features/staff/staffSelectors";
import { selectStores } from "../../../store/features/stores/storeSelectors";
import { useModal } from "../../../shared/hooks/use-modal";
import { fetchStores } from "../../../store/features/stores/storeThunks";
import UpdateStaffPermissionsDialog from "../components/UpdateStaffPermissionsDialog";

const StaffsPage = () => {
  const dispatch = useAppDispatch();
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useModal();
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const stores = useAppSelector(selectStores);

  const isFetchingStaffs = useAppSelector(selectIsFetchingStaffs);

  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchStaffs());
    dispatch(fetchStores());
  };

  const handleOpenDialog = async (staff: Staff | null = null) => {
    setSelectedStaff(staff);
    if (staff) {
      setIsStaffDialogOpen(true);
    }
  };

  const handleCloseDialog = async () => {
    setSelectedStaff(null);
    setIsStaffDialogOpen(false);
  };

  const handleUpdateSuccess = () => {
    dispatch(fetchStaffs());
  };

  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Staff</h1>
        <div className="flex gap-x-2">
          <Button
            variant="outline"
            size="sm"
            className="px-2"
            onClick={handleRefresh}
            disabled={isFetchingStaffs}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetchingStaffs ? "animate-spin" : ""}`}
            />
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="mt-2">
        <StaffsTable onUpdatePermissions={(staff) => handleOpenDialog(staff)} />
      </div>

      <UpdateStaffPermissionsDialog
        open={isStaffDialogOpen}
        onOpenChange={handleCloseDialog}
        account={selectedStaff}
        stores={stores}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default StaffsPage;
