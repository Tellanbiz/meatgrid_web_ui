import { PrimaryButton, SecondaryButton } from "../../components/Button";
import { FiPlus } from "react-icons/fi";
import OrdersTable from "./components/OrdersTable";

const Orders = () => {
  return (
    <>
      <div className="flex justify-between items-center py-2 sticky top-0 z-10 bg-background">
        <h4 className="text-base font-bold">Orders</h4>

        <div className="flex space-x-2">
          <SecondaryButton
            text="Export"
            className="mr-2 font-bold"
            onClick={() => console.log("Export clicked")}
          />

          <PrimaryButton
            text="Add Order"
            className="font-bold"
            icon={<FiPlus />}
            onClick={() => console.log("Add Order clicked")}
          />
        </div>
      </div>

      <div className="mt-4 bg-white rounded">
        <OrdersTable/>
      </div>
    </>
  );
};

export default Orders;
