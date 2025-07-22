import {
  RefreshCcw,
  FileSpreadsheet,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePurchasables } from "../hooks/usePurchasables";
import { getPurchasableStocks } from "../domain/purchasable-get";
import type { PurchasableStock } from "../domain/models";
import PurchasableStocksTable from "../components/PurchasableStocksTable";
import StockDateRangePicker from "@/routes/manufacturing/stocks/components/StockDateRangePicker";
import { convertUTCToLocal, formatLocalDateTime, isDateInRange } from "../utils/dateUtils";

const PurchasableStockPage = () => {
  const navigate = useNavigate();
  const { stores, fetchStores } = usePurchasables();
  
  // Stock data state
  const [stocks, setStocks] = useState<PurchasableStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>("all");

  // Search and date range state
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Fetch stores and stocks on mount
  useEffect(() => {
    fetchStores();
    fetchStocks();
  }, [fetchStores]);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const data = await getPurchasableStocks();
      setStocks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch purchasable stocks:', error);
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStocks();
  };

  const handleProcessStock = () => {
    navigate("/purchasable-stocks/process");
  };

  const getFilteredStocks = () => {
    // Filter out any invalid stock items - check for both 'purchasable' and 'product' properties
    let filtered = stocks.filter(stock => stock && (stock.purchasable || stock.product));

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((stock) => {
        const purchasable = stock.purchasable || stock.product;
        return purchasable?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Filter by date range with UTC to local time conversion
    if (startDate || endDate) {
      filtered = filtered.filter((stock) => {
        // Convert UTC date to local date for comparison
        const localDate = convertUTCToLocal(stock.created_at);
        return isDateInRange(localDate, startDate, endDate);
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
      const purchasable = stock.purchasable || stock.product;
      if (!purchasable) continue;
      
      const key = purchasable.id + "-" + (stock.store?.id || "");
      if (!productMap.has(key)) {
        productMap.set(key, {
          Product: purchasable.name || "Unknown",
          Quantity: 0,
          Unit: purchasable.unit_type || "pieces",
          Status: stock.status || "Unknown",
          Store: stock.store?.name || "N/A",
          "Created At": stock.created_at ? formatLocalDateTime(stock.created_at) : "N/A",
        });
      }
      const entry = productMap.get(key);
      entry.Quantity += stock.quantity || 0;
    }
    
    // Convert grams to kilograms if needed
    for (const entry of productMap.values()) {
      if (
        (entry.Unit === "gram" || entry.Unit === "grams" || entry.Unit === "kilograms" || entry.Unit === "kilogram") &&
        entry.Quantity >= 1000
      ) {
        entry.Quantity = (entry.Quantity / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 });
        entry.Unit = "kg";
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
    exportToExcel(data, "purchasable-stocks-report");
  };

  const handleExportPDF = () => {
    const data = aggregateStocks();
    exportToPDF(data, "purchasable-stocks-report");
  };

  return (
    <div className="h-full p-6 bg-white">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search by purchasable name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <StockDateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
            />
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="instock">In Stock</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="migrated">Migrated</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="damaged">Damaged</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCcw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
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
            <Button variant="default" size="sm" onClick={handleProcessStock}>
              <Package className="h-4 w-4" />
              <span className="ml-2">Process Stock</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="h-table">
        <PurchasableStocksTable 
          stocks={getFilteredStocks()}
          loading={loading}
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

export default PurchasableStockPage;
