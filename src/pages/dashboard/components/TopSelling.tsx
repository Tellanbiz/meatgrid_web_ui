import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "../../../components/ui/badge";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";

interface TopSellingItem {
  name: string;
  sold: number;
  weight: string;
}

const TopSelling = () => {
  const items: TopSellingItem[] = [
    { name: "Tomato", sold: 20, weight: "500gm" },
    { name: "Capsicum", sold: 20, weight: "500gm" },
    { name: "Red Cabbage", sold: 20, weight: "500gm" },
    { name: "Broccoli", sold: 20, weight: "500gm" },
    { name: "Korean Ramen", sold: 20, weight: "500gm" },
  ];

  const soldTemplate = (rowData: TopSellingItem) => (
    <Badge className="bg-green-100 text-green-800 rounded-md px-2 py-1">
      Sold: {rowData.sold}
    </Badge>
  );

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium">Top Selling</h3>
        <a href="#" className="text-sm text-gray-500 hover:underline">
          View All
        </a>
      </div>
      <hr className="border-gray-100 my-4" />
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <DataTable
          value={items}
          tableStyle={{
            ...DataTableStyle,
            borderCollapse: "separate",
            borderSpacing: "0 10px",
          }}
          className="w-full"
        >
          <Column
            field="name"
            header="Item Name"
            headerStyle={{
              ...TableHeaderStyle,
              background: "none",
              textAlign: "center",
            }}
            body={(rowData: TopSellingItem) => (
              <div className="flex items-center space-x-2">
                <span>{rowData.name}</span>
                <span className="text-gray-500 text-sm">{rowData.weight}</span>
              </div>
            )}
          />

          <Column
            field="sold"
            header="Total Sold"
            headerStyle={{
              ...TableHeaderStyle,
              background: "none",
              display: "flex",
              justifyContent: "center",
            }}
            style={{ textAlign: "center" }}
            body={soldTemplate}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default TopSelling;
