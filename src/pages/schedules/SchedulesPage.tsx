import { Button } from "@/components/ui/button";
import SchedulesTable from "./components/SchedulesTable";
import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchSchedules } from "../../store/features/schedules/scheduleThunks";
import {
  selectIsFetchingSchedules,
  selectScheduleError,
  selectScheduleSuccessMessage,
} from "../../store/features/schedules/scheduleSelectors";
import { Schedule } from "../../store/features/schedules/scheduleTypes";
import NewScheduleDialog from "./components/NewScheduleDialog";
import EditScheduleDialog from "./components/EditScheduleDialog";
import { useModal } from "../../hooks/use-modal";
import { toast } from "sonner";
import { clearScheduleMessages } from "../../store/features/schedules/scheduleSlice";

const SchedulesPage = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsFetchingSchedules);
  const error = useAppSelector(selectScheduleError);
  const successMessage = useAppSelector(selectScheduleSuccessMessage);
  const [isNewDialogOpen, setIsNewDialogOpen] = useModal();
  const [isEditDialogOpen, setIsEditDialogOpen] = useModal();
  const [scheduleToEdit, setScheduleToEdit] = useState<Schedule | null>(null);

  const handleRefresh = () => {
    dispatch(fetchSchedules());
  };

  const handleEdit = (schedule: Schedule) => {
    setScheduleToEdit(schedule);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setScheduleToEdit(null);
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearScheduleMessages());
    }
    if (error) {
      toast.error(error);
      dispatch(clearScheduleMessages());
    }
  }, [successMessage, error, dispatch]);

  return (
    <div className="w-full p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Delivery Schedules</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="ml-2">Refresh</span>
          </Button>
          <Button size="sm" onClick={() => setIsNewDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Schedule
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <SchedulesTable onEdit={handleEdit} />
      </div>

      <NewScheduleDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onSuccess={handleRefresh}
      />

      <EditScheduleDialog
        schedule={scheduleToEdit}
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogClose}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default SchedulesPage;
