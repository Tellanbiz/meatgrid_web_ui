import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ProgressBar } from "primereact/progressbar";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useEffect, useState } from "react";
import {
  fetchStocks,
  updateStockQuantity,
} from "../../../store/features/stock/stockThunks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { MoreVertical, Pencil } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Stock } from "../../../store/features/stock/stockTypes";
import { stockStatusColors } from "../../../constants/StatusColors";
import { Badge } from "../../../components/ui/badge";
import {
  selectIsFetchingStocks,
  selectStocks,
} from "../../../store/features/stock/stockSelectors";
import { useModal } from "../../../hooks/use-modal";
import UpdateStockDialog from "./UpdateStockDialog";
import { toast } from "sonner";
import { UpdateStockQuantityRequest } from "../../../store/features/stock/request/UpdateStockQuantityRequest";

const StocksTable = () => {
  const dispatch = useAppDispatch();
  const isFetchingStocks = useAppSelector(selectIsFetchingStocks);
  const stocks = useAppSelector(selectStocks);
  const [isModalOpen, setIsModalOpen] = useModal();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log("render");
  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  const statusTemplate = (rowData: Stock) => {
    const colorClass = stockStatusColors[rowData.status] || "bg-gray-500";
    return (
      <Badge variant="outline" className={`${colorClass}`}>
        {rowData.status}
      </Badge>
    );
  };

  const handleEdit = (stock: Stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedStock(null);
    setIsModalOpen(false);
  };
  const handleUpdateStock = async (newQuantity: number) => {
    setIsLoading(true);
    try {
      if (!selectedStock) {
        return;
      }

      const request: UpdateStockQuantityRequest = {
        id: selectedStock.id,
        quantity: newQuantity,
      };

      const message = await dispatch(updateStockQuantity(request)).unwrap();
      toast.success(message);
      setIsModalOpen(false);
      dispatch(fetchStocks());
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred while updating the stock.");
      }
    } finally {
      setIsLoading(false);
    }
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
            <Pencil className="h-4 w-4" /> Update Stock
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="h-full">
      {isFetchingStocks && (
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
          header="Quantity"
          body={(stock: Stock) =>
            `${stock.quantity.toLocaleString()} ${stock.product.unit_type}`
          }
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

      <UpdateStockDialog
        isLoading={isLoading}
        open={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdateStock}
        stock={selectedStock}
      />
    </div>
  );
};

export default StocksTable;
