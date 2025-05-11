import OrdersTable from "./components/OrdersTable";
import { Button } from "../../components/ui/button";
import { Download, RefreshCcw } from "lucide-react";
import Breadcrumbs from "../../components/breadcrumbs";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectIsFetchingOrders } from "../../store/features/orders/orderSelectors";

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const isFetchingOrders = useAppSelector(selectIsFetchingOrders);

  const handleRefresh = () => {
    // dispatch(fetchOrders({}));
  };

  const handleExport = () => {
    // Logic to export the orders
    console.log("Orders exported");
  };

  return (
    <>
      <div className="flex justify-between items-center py-2 sticky top-16 z-10 bg-background">
        <Breadcrumbs
          items={[
            {
              label: "Orders",
              isPage: true,
            },
          ]}
        />

        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="px-2"
            onClick={handleRefresh}
            disabled={isFetchingOrders}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetchingOrders ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button className="px-2" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="mt-2 card h-table">
        <OrdersTable />
      </div>
    </>
  );
};

export default OrdersPage;
