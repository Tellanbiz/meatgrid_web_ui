import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "../../../components/ui/badge";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";
import { Link } from "react-router-dom";

type Order = {
  id: string;
  customer: string;
  phone: string;
  deliveryDate: string;
  amount: string;
  paymentStatus: "Paid" | "Unpaid";
  orderStatus: "Confirmed" | "Pending" | "Delivered" | "Failed" | "Packaging";
  profilePhoto: string | null;
};

const LatestOnlineOrders = () => {
  const orders: Order[] = [
    {
      id: "100108",
      customer: "Alex Martin",
      phone: "254712345678",
      deliveryDate: "15 Feb, 2023",
      amount: "$136.00",
      paymentStatus: "Paid",
      orderStatus: "Confirmed",
      profilePhoto: null,
    },
    {
      id: "100107",
      customer: "John Doe",
      phone: "254712345678",
      deliveryDate: "15 Feb, 2023",
      amount: "$136.00",
      paymentStatus: "Paid",
      orderStatus: "Pending",
      profilePhoto: "/images/unsplash-avatar.jpg",
    },
    {
      id: "100106",
      customer: "Lana Steiner",
      phone: "254712345678",
      deliveryDate: "15 Feb, 2023",
      amount: "$136.00",
      paymentStatus: "Unpaid",
      orderStatus: "Delivered",
      profilePhoto: null,
    },
  ];

  const paymentStatusTemplate = (rowData: Order) => {
    const statusColors = {
      Paid: "bg-green-100 text-green-800",
      Unpaid: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={`rounded-md ${statusColors[rowData.paymentStatus]}`}>
        {rowData.paymentStatus}
      </Badge>
    );
  };

  const orderStatusTemplate = (rowData: Order) => {
    const statusColors = {
      Confirmed: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Delivered: "bg-blue-100 text-blue-800",
      Failed: "bg-red-100 text-red-800",
      Packaging: "bg-purple-100 text-purple-800",
    };

    return (
      <Badge className={`rounded-md ${statusColors[rowData.orderStatus]}`}>
        {rowData.orderStatus}
      </Badge>
    );
  };

  const customerNameTemplate = (rowData: Order) => (
    <div className="flex items-center space-x-3">
      {rowData.profilePhoto ? (
        <img
          src={rowData.profilePhoto}
          alt={rowData.customer}
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
          {rowData.customer.charAt(0).toUpperCase()}
        </div>
      )}
      <span>{rowData.customer}</span>
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium">Latest Online Orders</h3>
        <Link to="/orders" className="text-sm text-gray-500 hover:underline">
          View All
        </Link>
      </div>
      <hr className="border-gray-200 mt-4" />
      <div className="border border-gray-200 overflow-hidden mt-4 rounded-md">
        <DataTable
          value={orders}
          tableStyle={{
            ...DataTableStyle,
            borderCollapse: "separate",
            borderSpacing: "0 10px",
          }}
          className="w-full"
        >
          <Column
            field="id"
            header="Order ID"
            style={{ ...TableHeaderStyle, background: "none" }}
          />
          <Column
            field="customer"
            header="Customer Name"
            body={customerNameTemplate}
            style={{ ...TableHeaderStyle, background: "none" }}
          />
          <Column
            field="phone"
            header="Phone Number"
            style={{ ...TableHeaderStyle, background: "none" }}
          />
          <Column
            field="deliveryDate"
            header="Delivery Date"
            style={{ ...TableHeaderStyle, background: "none" }}
          />
          <Column
            field="amount"
            header="Amount"
            style={{ ...TableHeaderStyle, background: "none" }}
          />
          <Column
            field="paymentStatus"
            header="Payment Status"
            body={paymentStatusTemplate}
            style={{ ...TableHeaderStyle, background: "none" }}
          />
          <Column
            field="orderStatus"
            header="Order Status"
            body={orderStatusTemplate}
            style={{ ...TableHeaderStyle, background: "none" }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default LatestOnlineOrders;
