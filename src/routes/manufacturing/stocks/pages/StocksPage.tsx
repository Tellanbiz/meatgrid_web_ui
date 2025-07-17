import { Forward, RedoDot, RefreshCcw, FileSpreadsheet } from "lucide-react";
import StocksTable from "../components/StocksTable";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchStocks } from "@/store/features/stock/stockThunks";
import {
  selectIsFetchingStocks,
  selectStocks,
} from "@/store/features/stock/stockSelectors";
import { useNavigate } from "react-router-dom";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";
import { Input } from "@/components/ui/input";
import StockDateRangePicker from "../components/StockDateRangePicker";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StockStatus } from "@/store/features/stock/stockTypes";
import { selectStores } from "@/store/features/stores/storeSelectors";
import { fetchStores } from "@/store/features/stores/storeThunks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StocksPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isFetchingStocks = useAppSelector(selectIsFetchingStocks);
  const stocks = useAppSelector(selectStocks);
  const stores = useAppSelector(selectStores);
  const [selectedStore, setSelectedStore] = useState<string>("all");

  // Search and date range state
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Fetch stores on mount
  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchStocks());
  };

  const handleTransferStock = () => {
    navigate("/stock/transfer");
  };

  const handleRestock = () => {
    navigate("/stock/restock");
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const getFilteredStocks = () => {
    let filtered = stocks;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((stock) =>
        stock.product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate || endDate) {
      filtered = filtered.filter((stock) => {
        const stockDate = new Date(stock.created_at);
        // Remove time for date-only comparison
        const stockLocalDate = new Date(
          stockDate.getFullYear(),
          stockDate.getMonth(),
          stockDate.getDate()
        );

        let afterStart = true;
        let beforeEnd = true;

        if (startDate) {
          const startLocal = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
          );
          afterStart = stockLocalDate >= startLocal;
        }

        if (endDate) {
          const endLocal = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
          );
          beforeEnd = stockLocalDate <= endLocal;
        } else if (startDate) {
          // If only start date is selected, treat it as single day filter
          const startLocal = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
          );
          beforeEnd = stockLocalDate <= startLocal;
        }

        return afterStart && beforeEnd;
      });
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((stock) => stock.status === selectedStatus);
    }

    // Filter by store
    if (selectedStore !== "all") {
      filtered = filtered.filter((stock) => stock.store?.id === selectedStore);
    }

    return filtered;
  };

  const aggregateStocks = () => {
    const filteredStocks = getFilteredStocks();
    const productMap = new Map();

    for (const stock of filteredStocks) {
      const key = stock.product.id + "-" + (stock.store?.id || "");
      if (!productMap.has(key)) {
        productMap.set(key, {
          Product: stock.product.name,
          Quantity: 0,
          Unit: stock.product.unit_type,
          Status: stock.status,
          Store: stock.store?.name || "N/A",
          // Use local time for Created At
          "Created At": new Date(stock.created_at).toLocaleString(),
        });
      }
      const entry = productMap.get(key);
      entry.Quantity += stock.quantity;
    }

    // Convert grams to kilograms if needed
    for (const entry of productMap.values()) {
      if (
        (entry.Unit === "gram" || entry.Unit === "grams") &&
        entry.Quantity >= 1000
      ) {
        entry.Quantity = (entry.Quantity / 1000).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        });
        entry.Unit = "kilograms";
      } else {
        entry.Quantity = entry.Quantity.toLocaleString();
      }
    }

    return Array.from(productMap.values()).map((entry) => ({
      Product: entry.Product,
      Quantity: `${entry.Quantity} ${entry.Unit}`,
      Status: entry.Status,
      Store: entry.Store,
      "Created At": entry["Created At"],
    }));
  };

  const handleExportExcel = () => {
    const data = aggregateStocks();
    exportToExcel(data, "stocks-report");
  };

  const handleExportPDF = () => {
    const data = aggregateStocks();
    exportToPDF(data, "stocks-report");
  };

  return (
    <div className="h-full p-6 bg-white">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <StockDateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateRangeChange}
            />
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={StockStatus.InStock}>In Stock</SelectItem>
                <SelectItem value={StockStatus.Sold}>Sold</SelectItem>
                <SelectItem value={StockStatus.Migrated}>Migrated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isFetchingStocks}
            >
              <RefreshCcw
                className={`h-4 w-4 ${isFetchingStocks ? "animate-spin" : ""}`}
              />
              <span className="ml-2">Refresh</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="ml-2">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleExportExcel}>
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleExportPDF}>
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={handleTransferStock}>
              <Forward className="h-4 w-4" />
              <span className="ml-2">Transfer Stock</span>
            </Button>
            <Button variant="default" size="sm" onClick={handleRestock}>
              <RedoDot className="h-4 w-4" />
              <span className="ml-2">Restock</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="h-table">
        <StocksTable
          searchTerm={searchTerm}
          startDate={startDate}
          endDate={endDate}
          selectedStatus={selectedStatus}
          selectedStore={selectedStore}
        />
      </div>
    </div>
  );
};

export default StocksPage;
