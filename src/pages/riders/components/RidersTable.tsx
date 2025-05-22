import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "../../../components/ui/button";
import { MoreVertical, ShieldCheck, ShieldX } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";
import {
  selectIsFetchingRiders,
  selectRiderError,
  selectRiders,
  selectRiderSuccessMessage,
} from "../../../store/features/riders/riderSelectors";
import { useEffect } from "react";
import { Rider } from "../../../store/features/riders/riderTypes";
import { Badge } from "../../../components/ui/badge";
import { fetchRiders } from "../../../store/features/riders/riderThunks";
import { clearRiderMessages } from "../../../store/features/riders/riderSlice";
import { toast } from "sonner";

interface RidersTableProps {
  onVerify: (rider: Rider) => void;
}

const RidersTable = ({ onVerify }: RidersTableProps) => {
  const dispatch = useAppDispatch();
  const riders = useAppSelector(selectRiders);
  const isFetchingRiders = useAppSelector(selectIsFetchingRiders);
  const riderError = useAppSelector(selectRiderError);
  const successMessage = useAppSelector(selectRiderSuccessMessage);

  useEffect(() => {
    dispatch(fetchRiders());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearRiderMessages());
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (riderError) {
      toast.error(riderError);
      dispatch(clearRiderMessages());
    }
  }, [riderError, dispatch]);

  const verificationTemplate = (rowData: Rider) => {
    return (
      <Badge
        variant={rowData.verified ? "default" : "outline"}
        className={
          rowData.verified
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }
      >
        {rowData.verified ? "Verified" : "Unverified"}
      </Badge>
    );
  };

  const verificationDateTemplate = (rowData: Rider) => {
    if (!rowData.verified_on) return "N/A";

    return new Date(rowData.verified_on).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const profileTemplate = (rowData: Rider) => {
    return (
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 mr-3">
          {rowData.profile.picture && rowData.profile.picture !== "none" ? (
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={rowData.profile.picture}
              alt={`${rowData.profile.full_name}'s profile`}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
              {rowData.profile.full_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">
            {rowData.profile.full_name}
          </div>
        </div>
      </div>
    );
  };

  const actionsBodyTemplate = (rowData: Rider) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => onVerify(rowData)}
            className="flex items-center gap-2"
          >
            {rowData.verified ? (
              <>
                <ShieldX className="h-4 w-4 text-red-500" /> Unverify Rider
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 text-green-500" /> Verify Rider
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div>
      {isFetchingRiders && (
        <ProgressBar mode="indeterminate" style={{ height: "4px" }} />
      )}

      <div className="card h-table">
        <DataTable
          value={riders}
          dataKey="id"
          tableStyle={DataTableStyle}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} riders"
          scrollable
          scrollHeight="flex"
          size="small"
          className="bg-white"
        >
          <Column
            header="Rider"
            body={profileTemplate}
            headerStyle={TableHeaderStyle}
          />
          <Column
            header="Verification Status"
            body={verificationTemplate}
            headerStyle={TableHeaderStyle}
          />
          <Column
            header="Verified On"
            body={verificationDateTemplate}
            headerStyle={TableHeaderStyle}
          />
          <Column
            header="Actions"
            body={actionsBodyTemplate}
            headerStyle={TableHeaderStyle}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default RidersTable;
