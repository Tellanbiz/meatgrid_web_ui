import { useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";
import { fetchCoupons } from "../../../store/features/coupons/couponThunks.ts";
import { Coupon } from "../../../store/features/coupons/couponTypes.ts";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { MoreVertical, Pencil } from "lucide-react";
import { ProgressBar } from "primereact/progressbar";

const CouponsTable = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { coupons, status, error } = useAppSelector((state) => state.coupons);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const activeTemplate = (rowData: Coupon) => {
    const isActive = rowData.active;

    return (
      <div className="flex items-center">
        {/* Status indicator dot */}
        <div
          className={`w-2 h-2 rounded-full mr-2 ${
            isActive ? "bg-green-500" : "bg-gray-400"
          }`}
        />

        {/* Status text */}
        <span
          className={`text-sm ${
            isActive ? "text-green-700 font-medium" : "text-gray-600"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>
    );
  };

  const dateTemplate = (rowData: Coupon) => {
    // Format the date part (more prominent)
    const date = new Date(rowData.created_at).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Format the time part (less prominent)
    const time = new Date(rowData.created_at).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return (
      <div className="flex flex-col">
        <span className="textxs font-medium">{date}</span>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
    );
  };

  const amountTemplate = (rowData: Coupon) => (
    <span>KES {rowData.amount.toFixed(2)}</span>
  );

  const usageTemplate = (rowData: Coupon) => {
    if (!rowData.max_used) {
      return <span>{rowData.used || 0} / Unlimited</span>;
    }

    const usagePercentage = ((rowData.used || 0) / rowData.max_used) * 100;

    const getProgressBarColor = () => {
      if (usagePercentage >= 100) {
        return "bg-red-500"; // Full usage - red
      } else if (usagePercentage > 90) {
        return "bg-amber-500"; // Near full usage - amber/yellow
      } else {
        return "bg-blue-600"; // Normal usage - blue
      }
    };

    return (
      <div>
        <div>
          <span>
            {(rowData.used || 0).toLocaleString()} /{" "}
            {rowData.max_used.toLocaleString()}
          </span>
          {usagePercentage >= 100 && (
            <span className="ml-2 text-xs font-medium text-red-500">
              (Used)
            </span>
          )}
        </div>

        {rowData.max_used > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className={`${getProgressBarColor()} h-2 rounded-full`}
              style={{
                width: `${Math.min(usagePercentage, 100)}%`,
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const actionsBodyTemplate = (rowData: Coupon) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => navigate(`/coupons/edit/${rowData.id}`)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" /> Edit Coupon
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (status === "failed") {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="h-full">
      {status === "loading" && (
        <ProgressBar mode="indeterminate" style={{ height: "4px" }} />
      )}

      <DataTable
        value={coupons}
        dataKey="id"
        tableStyle={DataTableStyle}
        selection={[]}
        size="small"
        selectionMode="checkbox"
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        scrollable
        scrollHeight="flex"
        className="bg-white p-2 rounded-md"
      >
        <Column field="name" header="Name" headerStyle={TableHeaderStyle} />
        <Column
          field="coupon_key"
          header="Coupon Key"
          headerStyle={TableHeaderStyle}
        />
        <Column
          field="description"
          header="Description"
          headerStyle={TableHeaderStyle}
        />
        <Column
          field="amount"
          header="Amount"
          body={amountTemplate}
          headerStyle={TableHeaderStyle}
        />
        <Column
          field="active"
          header="Status"
          body={activeTemplate}
          headerStyle={TableHeaderStyle}
        />
        <Column
          header="Usage"
          body={usageTemplate}
          headerStyle={TableHeaderStyle}
        />

        <Column
          field="created_at"
          header="Created At"
          body={dateTemplate}
          headerStyle={TableHeaderStyle}
        />
        <Column
          header="Actions"
          body={actionsBodyTemplate}
          headerStyle={TableHeaderStyle}
          style={{ width: "100px" }}
        />
      </DataTable>
    </div>
  );
};

export default CouponsTable;
