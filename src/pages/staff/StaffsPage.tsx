import { RefreshCcw } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import { fetchStaffs } from "../../store/features/staff/staffThunks";
import { Staff } from "../../store/features/staff/staffTypes";
import StaffsTable from "./components/StaffsTable";
import UpdateStaffPermissionsDialog from "../accounts/components/UpdateStaffPermissionsDialog";
import { selectIsFetchingStaffs } from "../../store/features/staff/staffSelectors";
import { selectStores } from "../../store/features/stores/storeSelectors";
import { useModal } from "../../hooks/use-modal";
import { fetchStores } from "../../store/features/stores/storeThunks";
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
    <>
      <div>
        <div className="flex justify-between items-center py-2 sticky top-16 z-10 bg-background">
          <Breadcrumbs items={[{ label: "Staff", isPage: true }]} />

          <div className="flex space-x-2">
            <Button
              variant="outline"
              className=""
              onClick={handleRefresh}
              disabled={isFetchingStaffs}
            >
              <RefreshCcw className={`${isFetchingStaffs && "animate-spin"}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="mt-2 card h-table">
          <StaffsTable
            onUpdatePermissions={(staff) => handleOpenDialog(staff)}
          />
        </div>

        <UpdateStaffPermissionsDialog
          open={isStaffDialogOpen}
          onOpenChange={handleCloseDialog}
          account={selectedStaff}
          stores={stores}
          onUpdateSuccess={handleUpdateSuccess}
        />
      </div>
    </>
  );
};

export default StaffsPage;
