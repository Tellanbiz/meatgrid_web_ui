import OrdersTable from "./components/OrdersTable";

const OrdersPage = () => {
  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      <div className="h-table">
        <OrdersTable />
      </div>
    </div>
  );
};

export default OrdersPage;
