import { Forward, Plus, RefreshCcw } from "lucide-react";
import Breadcrumbs from "../../components/breadcrumbs";
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

  return (
    <>
      <div className="flex justify-between items-center py-3 sticky top-16 z-20 bg-background">
        <Breadcrumbs
          items={[
            {
              label: "Stock",
              isPage: true,
            },
          ]}
        />
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="px-2"
            onClick={handleRefresh}
            disabled={isFetchingStocks}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetchingStocks && "animate-spin"}`}
            />
            Refresh
          </Button>

          <Button
            variant="outline"
            className="px-2"
            onClick={handleTransferStock}
          >
            <Forward className="h-4 w-4" />
            Transfer Stock
          </Button>

          <Button variant="default" className="px-2" onClick={() => null}>
            <Plus className="h-4 w-4" />
            Add Stock
          </Button>
        </div>
      </div>

      <div className="mt-2 card h-table ">
        <StocksTable />
      </div>
    </>
  );
};

export default StocksPage;
