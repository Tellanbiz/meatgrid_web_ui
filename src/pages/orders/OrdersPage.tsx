import OrdersTable from "./components/OrdersTable";

const OrdersPage = () => {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      <div className="">
        <OrdersTable />
      </div>
    </div>
  );
};

export default OrdersPage;
