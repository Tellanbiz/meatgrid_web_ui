import ProductsTable from "./components/ProductsTable";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectIsFetchingProducts,
  selectProducts,
} from "../../store/features/products/productSelectors";
import ExportButton from "../../components/ExportButton";
import ExportService from "../../service/ExportService";
import ReportService from "../../service/ReportService";
import { fetchProducts } from "../../store/features/products/productThunks";

import { fetchStores } from "../../store/features/stores/storeThunks";
import { selectStores } from "../../store/features/stores/storeSelectors";
import { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const ProductsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchString, setSearchString] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const isFetchingProducts = useAppSelector(selectIsFetchingProducts);
  const stores = useAppSelector(selectStores);

  const products = useAppSelector(selectProducts);

  const handleAddProduct = () => {
    navigate("/products/new");
  };

  const handleRefresh = () => {
    dispatch(fetchProducts());
  };

  const handleExportExcel = () => {
    const config = ReportService.getConfig("products");
    ExportService.exportToExcel(products, config);
  };

  const handleExportPDF = async () => {
    const config = ReportService.getConfig("products");
    await ExportService.exportToPDF(products, config);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const handleStoreChange = (value: string) => {
    if (value === "all") {
      setSelectedStore(null);
      dispatch(fetchProducts());
    } else {
      setSelectedStore(value);
      dispatch(fetchProducts({ store_id: value }));
    }
  };

  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col bg-background border-b border-gray-100">
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

      <div className=" h-table rounded-md shadow-sm border border-gray-100 overflow-hidden bg-white">
        <ProductsTable
          searchString={searchString}
          selectedStore={selectedStore}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
