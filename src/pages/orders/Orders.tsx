import OrdersTable from "./components/OrdersTable";
import { Button } from "../../components/ui/button";
import { Download, RefreshCcw } from "lucide-react";

const Orders = () => {
  const handleRefresh = () => {
    // Logic to refresh the orders
    console.log("Orders refreshed");
  };

  const handleExport = () => {
    // Logic to export the orders
    console.log("Orders exported");
  };

  return (
    <>
      <div className="flex justify-between items-center py-2 sticky top-0 z-10 bg-background">
        <h4 className="text-base font-bold">Orders</h4>

        <div className="flex space-x-2">
          <Button variant="outline" className="px-2" onClick={handleRefresh}>
            <RefreshCcw className={`h-4 w-4`} />
            Refresh
          </Button>
          <Button className="px-2" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="mt-2">
        <OrdersTable />
      </div>
    </>
  );
};

export default Orders;
