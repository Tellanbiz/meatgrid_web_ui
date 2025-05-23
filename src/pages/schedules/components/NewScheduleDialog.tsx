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
  selectCreateScheduleSuccess,
  selectIsCreatingSchedule,
} from "../../../store/features/schedules/scheduleSelectors";
import { createSchedule } from "../../../store/features/schedules/scheduleThunks";
import ScheduleForm, { ScheduleFormData } from "./ScheduleForm";
import { Loader2 } from "lucide-react";

interface NewScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const initialFormData: ScheduleFormData = {
  time: "12:00PM",
  max: 40,
  active: true,
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
  sunday: true,
};

const NewScheduleDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: NewScheduleDialogProps) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsCreatingSchedule);
  const [formData, setFormData] = useState<ScheduleFormData>(initialFormData);
  const createSuccess = useAppSelector(selectCreateScheduleSuccess);

  useEffect(() => {
    if (createSuccess) {
      onOpenChange(false);
      onSuccess();
    }
  }, [createSuccess, onOpenChange, onSuccess]);

  const handleSubmit = async () => {
    await dispatch(createSchedule(formData));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Schedule</DialogTitle>
          <DialogDescription>
            Create a new delivery time slot and set its availability.
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
            Save Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewScheduleDialog;
