import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectIsUpdatingSchedule,
  selectUpdateScheduleSuccess,
} from "../../../store/features/schedules/scheduleSelectors";
import { updateSchedule } from "../../../store/features/schedules/scheduleThunks";
import ScheduleForm, { ScheduleFormData } from "./ScheduleForm";
import { Schedule } from "../../../store/features/schedules/scheduleTypes";
import { Loader2 } from "lucide-react";

interface EditScheduleDialogProps {
  schedule: Schedule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditScheduleDialog = ({
  schedule,
  open,
  onOpenChange,
  onSuccess,
}: EditScheduleDialogProps) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsUpdatingSchedule);
  const updateScheduleSuccess = useAppSelector(selectUpdateScheduleSuccess);

  const [formData, setFormData] = useState<ScheduleFormData>({
    time: "",
    max: 0,
    active: true,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  useEffect(() => {
    if (schedule) {
      setFormData({
        time: schedule.time,
        max: schedule.max,
        active: schedule.active,
        monday: schedule.monday,
        tuesday: schedule.tuesday,
        wednesday: schedule.wednesday,
        thursday: schedule.thursday,
        friday: schedule.friday,
        saturday: schedule.saturday,
        sunday: schedule.sunday,
      });
    }
  }, [schedule]);

  useEffect(() => {
    if (updateScheduleSuccess) {
      onSuccess();
      onOpenChange(false);
    }
  }, [updateScheduleSuccess, onSuccess, onOpenChange]);

  const handleSubmit = async () => {
    if (schedule) {
      await dispatch(updateSchedule({ ...formData, id: schedule.id }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Schedule</DialogTitle>
          <DialogDescription>
            Modify the delivery time slot and its availability.
          </DialogDescription>
        </DialogHeader>

        <ScheduleForm
          data={formData}
          onChange={setFormData}
          disabled={isLoading}
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            Update Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditScheduleDialog;
