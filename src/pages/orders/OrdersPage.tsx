import OrdersTable from "./components/OrdersTable";
import { Button } from "../../components/ui/button";
import { RefreshCcw } from "lucide-react";
import Breadcrumbs from "../../components/breadcrumbs";
import { useAppSelector } from "../../store/hooks";
import { selectIsFetchingOrders } from "../../store/features/orders/orderSelectors";

const OrdersPage = () => {
  const isFetchingOrders = useAppSelector(selectIsFetchingOrders);

  const handleRefresh = () => {
    // dispatch(fetchOrders({}));
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
        </div>
      </div>

      <div className="mt-2 card h-table">
        <OrdersTable />
      </div>
    </>
  );
};

export default OrdersPage;
