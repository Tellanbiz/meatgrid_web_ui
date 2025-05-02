import { useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";
import StatusBadge from "../../../components/StatusBadge";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";
import { fetchCoupons } from "../../../store/features/coupons/couponThunks.ts";
import { Coupon } from "../../../store/features/coupons/couponTypes.ts";
import LoadingPage from "../../../components/LoadingPage.tsx";

const CouponsTable = () => {
  const dispatch = useAppDispatch();
  const { coupons, status, error } = useAppSelector((state) => state.coupons);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCoupons());
    }
  }, [status, dispatch]);

  const activeTemplate = (rowData: Coupon) => (
    <StatusBadge
      text={rowData.active ? "Active" : "Used"}
      className={
        rowData.active
          ? "bg-green-500 text-white font-extrabold"
          : "bg-red-400 text-white"
      }
    />
  );

  const dateTemplate = (rowData: Coupon) => {
    const formattedDate = new Date(rowData.created_at).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return <span>{formattedDate}</span>;
  };

  const amountTemplate = (rowData: Coupon) => (
    <span>KES {rowData.amount.toFixed(2)}</span>
  );

  if (status === "loading") {
    return <LoadingPage />;
  }

  if (status === "failed") {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="h-full">
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
      >
        <Column field="name" header="Name" headerStyle={TableHeaderStyle} />
        <Column
          field="description"
          header="Description"
          headerStyle={TableHeaderStyle}
        />
        <Column
          field="coupon_key"
          header="Coupon Key"
          headerStyle={TableHeaderStyle}
        />
        <Column
          field="active"
          header="Status"
          body={activeTemplate}
          headerStyle={TableHeaderStyle}
        />
        <Column
          field="amount"
          header="Amount"
          body={amountTemplate}
          headerStyle={TableHeaderStyle}
        />
        <Column field="used" header="Used" headerStyle={TableHeaderStyle} />
        <Column
          field="max_used"
          header="Max Used"
          headerStyle={TableHeaderStyle}
        />
        <Column
          field="created_at"
          header="Created At"
          body={dateTemplate}
          headerStyle={TableHeaderStyle}
        />
      </DataTable>
    </div>
  );
};

export default CouponsTable;
