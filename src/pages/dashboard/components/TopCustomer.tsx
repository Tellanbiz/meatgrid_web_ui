import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "../../../components/ui/badge";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";

interface TopCustomerItem {
  name: string;
  orders: number;
  profileImage: string;
}

const TopCustomer = () => {
  const customers: TopCustomerItem[] = [
    {
      name: "Alex Martin",
      orders: 20,
      profileImage: "/images/unsplash-avatar.jpg",
    },
    {
      name: "John Doe",
      orders: 15,
      profileImage: "/images/unsplash-avatar.jpg",
    },
    {
      name: "Jane Smith",
      orders: 10,
      profileImage: "/images/unsplash-avatar.jpg",
    },
    {
      name: "Emily Davis",
      orders: 8,
      profileImage: "/images/unsplash-avatar.jpg",
    },
    {
      name: "Michael Brown",
      orders: 5,
      profileImage: "/images/unsplash-avatar.jpg",
    },
  ];

  const nameTemplate = (rowData: TopCustomerItem) => (
    <div className="flex items-center space-x-3">
      <img
        src={rowData.profileImage}
        alt={rowData.name}
        className="w-8 h-8 rounded-full"
      />
      <span>{rowData.name}</span>
    </div>
  );

  const ordersTemplate = (rowData: TopCustomerItem) => (
    <Badge className="bg-green-100 text-green-800 rounded-md px-2 py-1">
      Orders: {rowData.orders}
    </Badge>
  );

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-medium">Top Customers</h3>
        <a href="#" className="text-sm text-gray-500 hover:underline">
          View All
        </a>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <DataTable
          value={customers}
          tableStyle={{
            ...DataTableStyle,
            borderCollapse: "separate",
            borderSpacing: "0 10px",
          }}
          className="w-full"
        >
          <Column
            field="name"
            header="Customer Name"
            body={nameTemplate}
            headerStyle={{
              ...TableHeaderStyle,
              background: "none",
            }}
          />
          <Column
            field="orders"
            header="Total Orders"
            body={ordersTemplate}
            headerStyle={{
              ...TableHeaderStyle,
              background: "none",
              display: "flex",
              justifyContent: "center",
            }}
            style={{ textAlign: "center" }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default TopCustomer;
