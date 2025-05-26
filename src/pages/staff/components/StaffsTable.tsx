import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ProgressBar } from "primereact/progressbar";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../shared/constants/TableStyles";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Settings, Check, X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { fetchStaffs } from "../../../store/features/staff/staffThunks";
import { toast } from "sonner";
import { Staff } from "../../../store/features/staff/staffTypes";
import {
  selectIsFetchingStaffs,
  selectStaffError,
  selectStaffs,
} from "../../../store/features/staff/staffSelectors";
import { clearStaffMessages } from "../../../store/features/staff/staffSlice";

interface StaffsTableProps {
  onUpdatePermissions: (staff: Staff) => void;
}

const StaffsTable = ({ onUpdatePermissions }: StaffsTableProps) => {
  const dispatch = useAppDispatch();

  const staffs = useAppSelector(selectStaffs);
  const isFetchingStaffs = useAppSelector(selectIsFetchingStaffs);
  const staffError = useAppSelector(selectStaffError);

  const staffWithUniqueIds = useMemo(() => {
    return staffs.map((staff, index) => ({
      ...staff,
      tempId: `${staff.id}-${index}`,
    }));
  }, [staffs]);

  useEffect(() => {
    dispatch(fetchStaffs());
  }, [dispatch]);

  useEffect(() => {
    if (staffError) {
      toast.error(staffError);
      dispatch(clearStaffMessages());
    }
  }, [staffError, dispatch]);

  const actionsBodyTemplate = (staff: Staff) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => onUpdatePermissions(staff)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" /> Update Permissions
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const booleanTemplate = (rowData: Staff, field: keyof Staff) => {
    return rowData[field] ? (
      <div className="flex justify-start">
        <Check className="h-5 w-5 text-green-500" />
      </div>
    ) : (
      <div className="flex justify-start">
        <X className="h-5 w-5 text-red-500" />
      </div>
    );
  };

  return (
    <>
      <div className="h-full">
        {isFetchingStaffs && (
          <ProgressBar mode="indeterminate" style={{ height: "4px" }} />
        )}
        <div className="card h-table">
          <DataTable
            value={staffWithUniqueIds}
            dataKey="tempId"
            tableStyle={DataTableStyle}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} staff"
            scrollable
            scrollHeight="flex"
            className="rounded-md"
            size="small"
          >
            <Column
              header="Full Name"
              body={(staff: Staff) => staff.profile.full_name}
              headerStyle={TableHeaderStyle}
            ></Column>
            <Column
              header="Store Name"
              body={(staff: Staff) => staff.store?.name ?? "N/A"}
              headerStyle={TableHeaderStyle}
            ></Column>
            <Column
              field="can_claim"
              header="Can Claim"
              headerStyle={TableHeaderStyle}
              body={(rowData) => booleanTemplate(rowData, "can_claim")}
            ></Column>
            <Column
              field="can_dispatch"
              header="Can Dispatch"
              headerStyle={TableHeaderStyle}
              body={(rowData) => booleanTemplate(rowData, "can_dispatch")}
            ></Column>
            <Column
              header="Actions"
              body={actionsBodyTemplate}
              headerStyle={TableHeaderStyle}
            ></Column>
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default StaffsTable;
