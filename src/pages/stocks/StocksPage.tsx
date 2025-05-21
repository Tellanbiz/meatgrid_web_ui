import { Forward, RedoDot, RefreshCcw, WandSparkles } from "lucide-react";
import StocksTable from "./components/StocksTable";
import { Button } from "../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchStocks } from "../../store/features/stock/stockThunks";
import { selectIsFetchingStocks } from "../../store/features/stock/stockSelectors";
import { useNavigate } from "react-router-dom";

const StocksPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isFetchingStocks = useAppSelector(selectIsFetchingStocks);

  const handleRefresh = () => {
    dispatch(fetchStocks());
  };

  const handleTransferStock = () => {
    navigate("/stock/transfer");
  };

  const handleRestock = () => {
    navigate("/stock/restock");
  };

  const handleProcessProducts = () => {
    navigate("/stock/process");
  };

  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Stock</h1>
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

          <Button variant="outline" size="sm" onClick={handleTransferStock}>
            <Forward className="h-4 w-4" />
            <span className="ml-2">Transfer Stock</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleProcessProducts}>
            <WandSparkles className="h-4 w-4" />
            <span className="ml-2">Process Products</span>
          </Button>

          <Button variant="default" size="sm" onClick={handleRestock}>
            <RedoDot className="h-4 w-4" />
            <span className="ml-2">Restock</span>
          </Button>
        </div>
      </div>

      <div className="h-table">
        <StocksTable />
      </div>
    </div>
  );
};

export default StocksPage;
