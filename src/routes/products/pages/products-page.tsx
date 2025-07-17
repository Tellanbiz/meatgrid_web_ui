import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectIsFetchingProducts,
  selectProducts,
} from "@/store/features/products/productSelectors";
import ExportService from "@/service/ExportService";
import ReportService from "@/service/ReportService";
import { fetchProducts } from "@/store/features/products/productThunks";

import { fetchStores } from "@/store/features/stores/storeThunks";
import { selectStores } from "@/store/features/stores/storeSelectors";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExportButton from "@/components/buttons/ExportButton";
import ProductsTable from "../components/ProductsTable";
import { Product } from "@/store/features/products/productTypes";
import StockDateRangePicker from "@/routes/manufacturing/stocks/components/StockDateRangePicker";

const ProductsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchString, setSearchString] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const isFetchingProducts = useAppSelector(selectIsFetchingProducts);
  const stores = useAppSelector(selectStores);

  const products = useAppSelector(selectProducts);

  // Helper function to convert local date to UTC date string
  const convertToUTCDateString = (localDate: Date): string => {
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    );
    return utcDate.toISOString().split("T")[0];
  };

  // Helper function to get total in stock
  const getTotalInStock = (product: Product) => {
    const stockInfo = product.stock_info;
    const totalIn = stockInfo.total_instock + stockInfo.total_reclaim;
    const totalOut =
      stockInfo.total_damaged +
      stockInfo.total_migrated +
      stockInfo.total_processed +
      stockInfo.total_sold;
    return totalIn - totalOut;
  };

  // Filter products based on search string and stock status
  const getFilteredProducts = () => {
    let filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchString.toLowerCase()) ||
        product.id.toLowerCase().includes(searchString.toLowerCase())
    );

    // Apply stock status filter
    if (selectedStockStatus !== "all") {
      filtered = filtered.filter((product) => {
        const inStock = getTotalInStock(product) > 0;
        return selectedStockStatus === "instock" ? inStock : !inStock;
      });
    }

    // Sort by stock status - in-stock products first
    filtered.sort((a, b) => {
      const aInStock = getTotalInStock(a) > 0;
      const bInStock = getTotalInStock(b) > 0;

      // If both have same stock status, maintain original order
      if (aInStock === bInStock) return 0;

      // In-stock products come first
      return bInStock ? 1 : -1;
    });

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const handleAddProduct = () => {
    navigate("/products/new");
  };

  const handleRefresh = () => {
    if (startDate) {
      const params = {
        ...(selectedStore && { store_id: selectedStore }),
        start_date: convertToUTCDateString(startDate),
        end_date: convertToUTCDateString(endDate || startDate),
      };
      dispatch(fetchProducts(params));
    } else {
      const params = {
        ...(selectedStore && { store_id: selectedStore }),
      };
      dispatch(
        fetchProducts(Object.keys(params).length > 0 ? params : undefined)
      );
    }
  };

  const handleExportExcel = () => {
    const config = ReportService.getConfig("products");
    ExportService.exportToExcel<Product>(filteredProducts, config);
  };

  const handleExportPDF = async () => {
    const config = ReportService.getConfig("products");
    await ExportService.exportToPDF<Product>(filteredProducts, config);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const handleStoreChange = (value: string) => {
    if (value === "all") {
      setSelectedStore(null);
      if (startDate) {
        const params = {
          start_date: convertToUTCDateString(startDate),
          end_date: convertToUTCDateString(endDate || startDate),
        };
        dispatch(fetchProducts(params));
      } else {
        dispatch(fetchProducts());
      }
    } else {
      setSelectedStore(value);
      if (startDate) {
        const params = {
          store_id: value,
          start_date: convertToUTCDateString(startDate),
          end_date: convertToUTCDateString(endDate || startDate),
        };
        dispatch(fetchProducts(params));
      } else {
        dispatch(fetchProducts({ store_id: value }));
      }
    }
  };

  const handleStockStatusChange = (value: string) => {
    setSelectedStockStatus(value);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);

    // Only trigger API call when we have at least a start date
    if (start) {
      const params = {
        ...(selectedStore && { store_id: selectedStore }),
        start_date: convertToUTCDateString(start),
        // If no end date, use start date as end date for single day selection
        end_date: convertToUTCDateString(end || start),
      };
      dispatch(fetchProducts(params));
    } else {
      // If no start date, fetch all products with current filters
      const params = {
        ...(selectedStore && { store_id: selectedStore }),
      };
      dispatch(
        fetchProducts(Object.keys(params).length > 0 ? params : undefined)
      );
    }
  };

  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  return (
    <div className="space-y-4 p-6 bg-white">
      <div className="flex flex-col ">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchString}
                onChange={handleSearchChange}
                className="pl-9 h-10 border-gray-200 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>

            <Select
              value={selectedStore || "all"}
              onValueChange={handleStoreChange}
            >
              <SelectTrigger className="w-48 h-10 border-gray-200 bg-white">
                <SelectValue placeholder="Select Store" />
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

            <Select
              value={selectedStockStatus}
              onValueChange={handleStockStatusChange}
            >
              <SelectTrigger className="w-40 h-10 border-gray-200 bg-white">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="instock">In Stock</SelectItem>
                <SelectItem value="outofstock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <StockDateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateRangeChange}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isFetchingProducts}
              size="sm"
              className="px-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isFetchingProducts ? "animate-spin" : ""
                }`}
              />
              <span className="ml-2">Refresh</span>
            </Button>

            <ExportButton
              onExportExcel={handleExportExcel}
              onExportPDF={handleExportPDF}
            />

            <Button onClick={handleAddProduct} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              <span>Add Product</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="h-table rounded-md border border-gray-200 overflow-hidden bg-white">
        <ProductsTable
          searchString={searchString}
          selectedStore={selectedStore}
          selectedStockStatus={selectedStockStatus}
          filteredProducts={filteredProducts}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
