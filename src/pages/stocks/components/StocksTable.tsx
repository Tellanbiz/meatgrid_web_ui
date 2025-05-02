import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ProgressBar } from "primereact/progressbar";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useEffect } from "react";
import { fetchStocks } from "../../../store/features/stock/stockThunks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { MoreVertical, Pencil } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Stock } from "../../../store/features/stock/stockTypes";

const StocksTable = () => {
  const dispatch = useAppDispatch();
  const { stocks, status, currentOperation } = useAppSelector(
    (state) => state.stocks
  );

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  const statusTemplate = (rowData: Stock) => {
    return (
      <span
        className={`text-xs font-semibold px-2 py-1 rounded ${
          rowData.status === "available"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {rowData.status}
      </span>
    );
  };

  const handleEdit = (stock: Stock) => {
    // Logic for editing product
    console.log("Edit stock:", stock);
  };

  const actionsBodyTemplate = (stock: Stock) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => handleEdit(stock)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" /> Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="h-full">
      {status === "loading" && currentOperation === "fetch" && (
        <ProgressBar mode="indeterminate" style={{ height: "6px" }} />
      )}

      <DataTable
        value={stocks}
        dataKey="id"
        tableStyle={DataTableStyle}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        scrollable
        scrollHeight="flex"
        size="small"
      >
        <Column
          header="Product"
          body={(stock) => stock.product.name}
          headerStyle={TableHeaderStyle}
        />
        <Column
          header="Store"
          body={(stock) => stock.store?.name ?? "N/A"}
          headerStyle={TableHeaderStyle}
        />
        <Column
          field="quantity"
          header="Quantity"
          headerStyle={TableHeaderStyle}
        />
        <Column
          header="Status"
          body={statusTemplate}
          headerStyle={TableHeaderStyle}
        />
        <Column
          header="Created At"
          body={(stock) =>
            new Date(stock.created_at).toLocaleDateString("en-KE", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          }
          headerStyle={TableHeaderStyle}
        />

        <Column
          header="Actions"
          body={actionsBodyTemplate}
          headerStyle={TableHeaderStyle}
        ></Column>
      </DataTable>
    </div>
  );
};

export default StocksTable;
