import { RefreshCcw, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useState, useEffect } from "react";
import { fetchRiders } from "../../store/features/riders/riderThunks";
import { Rider } from "../../store/features/riders/riderTypes";
import { selectIsFetchingRiders } from "../../store/features/riders/riderSelectors";
import RidersTable from "./components/RidersTable";
import VerifyRiderDialog from "./components/VerifyRiderDialog";
import { useModal } from "../../hooks/use-modal";
import { useNavigate } from "react-router-dom";

const RidersPage = () => {
  const dispatch = useAppDispatch();
  const isFetchingRiders = useAppSelector(selectIsFetchingRiders);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useModal();
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRiders());
  }, [dispatch]);

  const handleVerifyDialogOpen = (rider: Rider) => {
    setSelectedRider(rider);
    setIsVerifyDialogOpen(true);
  };

  const handleVerifySuccess = () => {
    dispatch(fetchRiders());
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center flex-none">
        <h1 className="text-2xl font-semibold">Riders</h1>
        <div className="flex gap-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(fetchRiders())}
            disabled={isFetchingRiders}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetchingRiders ? "animate-spin" : ""}`}
            />
            <span className="ml-2">Refresh</span>
          </Button>
          <Button size="sm" onClick={() => navigate("/riders/add")}>
            <Plus className="h-4 w-4" />
            <span className="ml-2">Add Rider</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 mt-4 min-h-0 card">
        <RidersTable onVerify={handleVerifyDialogOpen} />
      </div>

      <VerifyRiderDialog
        open={isVerifyDialogOpen}
        onOpenChange={setIsVerifyDialogOpen}
        rider={selectedRider}
        onVerifySuccess={handleVerifySuccess}
      />
    </div>
  );
};

export default RidersPage;
