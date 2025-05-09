import { RefreshCcw } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useState, useEffect } from "react";
import { fetchRiders } from "../../store/features/riders/riderThunks";
import { Rider } from "../../store/features/riders/riderTypes";
import { selectIsFetchingRiders } from "../../store/features/riders/riderSelectors";
import Breadcrumbs from "../../components/breadcrumbs";
import RidersTable from "./components/RidersTable";
import VerifyRiderDialog from "./components/VerifyRiderDialog";
import { useModal } from "../../hooks/use-modal";

const RidersPage = () => {
  const dispatch = useAppDispatch();
  const isFetchingRiders = useAppSelector(selectIsFetchingRiders);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useModal();
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);

  useEffect(() => {
    dispatch(fetchRiders());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchRiders());
  };

  const handleVerifyDialogOpen = (rider: Rider) => {
    setSelectedRider(rider);
    setIsVerifyDialogOpen(true);
  };

  const handleVerifySuccess = () => {
    dispatch(fetchRiders());
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center py-2 sticky top-16 z-10 bg-background">
          <Breadcrumbs items={[{ label: "Riders", isPage: true }]} />

          <div className="flex space-x-2">
            <Button
              variant="outline"
              className=""
              onClick={handleRefresh}
              disabled={isFetchingRiders}
            >
              <RefreshCcw
                className={`${isFetchingRiders && "animate-spin"} h-4 w-4 mr-2`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="mt-2 card h-table">
          <RidersTable onVerify={handleVerifyDialogOpen} />
        </div>

        <VerifyRiderDialog
          open={isVerifyDialogOpen}
          onOpenChange={setIsVerifyDialogOpen}
          rider={selectedRider}
          onVerifySuccess={handleVerifySuccess}
        />
      </div>
    </>
  );
};

export default RidersPage;
