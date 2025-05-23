import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Button } from "../../../components/ui/button";
import { MoreVertical, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Schedule } from "../../../store/features/schedules/scheduleTypes";
import {
  selectIsFetchingSchedules,
  selectSchedules,
  selectIsDeletingSchedule,
  selectIsUpdatingSchedule,
} from "../../../store/features/schedules/scheduleSelectors";
import { Badge } from "../../../components/ui/badge";
import {
  updateSchedule,
  deleteSchedule,
  fetchSchedules,
} from "../../../store/features/schedules/scheduleThunks";
import { Switch } from "@/components/ui/switch";
import DeleteDialog from "../../../components/DeleteDialog";
import { useModal } from "../../../hooks/use-modal";
import { ProgressBar } from "primereact/progressbar";

interface SchedulesTableProps {
  onEdit: (schedule: Schedule) => void;
}

const SchedulesTable = ({ onEdit }: SchedulesTableProps) => {
  const dispatch = useAppDispatch();
  const schedules = useAppSelector(selectSchedules);
  const isLoading = useAppSelector(selectIsFetchingSchedules);
  const isDeleting = useAppSelector(selectIsDeletingSchedule);
  const isUpdating = useAppSelector(selectIsUpdatingSchedule);
  const [updatingScheduleId, setUpdatingScheduleId] = useState<string | null>(
    null
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useModal();
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  const timeTemplate = (schedule: Schedule) => {
    return <div className="font-medium">From {schedule.time}</div>;
  };

  const maxOrdersTemplate = (schedule: Schedule) => {
    return (
      <Badge variant="outline" className="bg-blue-50">
        {schedule.max}
      </Badge>
    );
  };

  const daysTemplate = (schedule: Schedule) => {
    return (
      <div className="flex gap-1">
        {[
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ].map((day, index) => {
          const dayLabel = ["M", "T", "W", "T", "F", "S", "S"][index];
          return (
            <span
              key={day}
              className={
                schedule[day as keyof Schedule]
                  ? "text-green-500 font-medium"
                  : "text-gray-300"
              }
            >
              {dayLabel}
            </span>
          );
        })}
      </div>
    );
  };

  const statusTemplate = (schedule: Schedule) => {
    const isUpdatingThis = updatingScheduleId === schedule.id;

    const handleStatusChange = async () => {
      setUpdatingScheduleId(schedule.id);
      await dispatch(updateSchedule({ ...schedule, active: !schedule.active }));
      await dispatch(fetchSchedules());
      setUpdatingScheduleId(null);
    };

    if (isUpdatingThis) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    return (
      <Switch
        checked={schedule.active}
        onCheckedChange={handleStatusChange}
        disabled={!!updatingScheduleId}
      />
    );
  };

  const actionsTemplate = (schedule: Schedule) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            aria-label="Actions"
            disabled={isDeleting || isUpdating}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(schedule)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setScheduleToDelete(schedule);
              setIsDeleteDialogOpen(true);
            }}
            className="text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const handleDelete = async () => {
    if (scheduleToDelete) {
      await dispatch(deleteSchedule(scheduleToDelete.id));
      setScheduleToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div>
      {isLoading && (
        <ProgressBar mode="indeterminate" style={{ height: "4px" }} />
      )}

      <div className="h-table">
        <DataTable
          value={schedules}
          dataKey="id"
          tableStyle={DataTableStyle}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} schedules"
          scrollable
          scrollHeight="flex"
          size="small"
          className="bg-white p-2 rounded-md"
          emptyMessage="No schedules found"
        >
          <Column
            field="time"
            header="Time"
            headerStyle={TableHeaderStyle}
            body={timeTemplate}
          />
          <Column
            field="max"
            header="Max Orders"
            headerStyle={TableHeaderStyle}
            body={maxOrdersTemplate}
          />
          <Column
            header="Days Available"
            headerStyle={TableHeaderStyle}
            body={daysTemplate}
          />
          <Column
            field="active"
            header="Active"
            headerStyle={TableHeaderStyle}
            body={statusTemplate}
          />
          <Column
            header="Actions"
            headerStyle={TableHeaderStyle}
            body={actionsTemplate}
          />
        </DataTable>
      </div>

      <DeleteDialog
        title="Delete Schedule"
        description="Are you sure you want to delete this schedule? This action cannot be undone."
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default SchedulesTable;
