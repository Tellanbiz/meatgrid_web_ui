import { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectCouponError,
  selectIsDeletingCoupon,
} from "../../../store/features/coupons/couponSelectors";
import DeleteDialog from "@/components/dialogs/DeleteDialog.tsx";
import {
  deleteCoupon,
  fetchCoupons,
} from "../../../store/features/coupons/couponThunks";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { ProgressBar } from "primereact/progressbar";
import { Coupon } from "../../../store/features/coupons/couponTypes";
import {
  TableHeaderStyle,
  DataTableStyle,
} from "../../../shared/constants/TableStyles.ts";
import { useModal } from "../../../shared/hooks/use-modal.ts";
import { clearCouponMessages } from "../../../store/features/coupons/couponSlice.ts";

const CouponsTable = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { coupons, status } = useAppSelector((state) => state.coupons);
  const couponError = useAppSelector(selectCouponError);

  const isDeletingCoupon = useAppSelector(selectIsDeletingCoupon);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useModal();

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleDeleteConfirm = async () => {
    if (!couponToDelete) return;

    try {
      await dispatch(deleteCoupon(couponToDelete.id)).unwrap();
      toast.success("Coupon deleted successfully");
      setOpenDeleteDialog(false);
      setCouponToDelete(null);
      dispatch(fetchCoupons());
    } catch {
      console.log("Failed to delete coupon");
    }
  };

  useEffect(() => {
    if (couponError) {
      toast.error(couponError);
      dispatch(clearCouponMessages());
    }
  }, [couponError, dispatch]);

  const activeTemplate = (rowData: Coupon) => {
    const isActive = rowData.active;

    return (
      <div className="flex items-center">
        <div
          className={`w-2 h-2 rounded-full mr-2 ${
            isActive ? "bg-green-500" : "bg-gray-400"
          }`}
        />
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

  const actionsTemplate = (rowData: Coupon) => (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 focus-visible:ring-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigate(`/coupons/edit/${rowData.id}`)}
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onClick={() => {
              setCouponToDelete(rowData);
              setOpenDeleteDialog(true);
            }}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

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
          field="actions"
          header="Actions"
          body={actionsTemplate}
          headerStyle={TableHeaderStyle}
          style={{ width: "100px" }}
        />
      </DataTable>

      <DeleteDialog
        open={openDeleteDialog}
        isLoading={isDeletingCoupon}
        onOpenChange={() => {
          setOpenDeleteDialog(false);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Coupon"
        description={`Are you sure you want to delete the coupon "${couponToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default CouponsTable;
