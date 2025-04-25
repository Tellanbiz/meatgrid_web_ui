import {
  EllipsisVertical,
  Pencil,
  Plus,
  RefreshCcw,
  XCircle,
} from "lucide-react";
import Breadcrumbs from "../../components/breadcrumbs";
import { Button } from "../../components/ui/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DataTableStyle, TableHeaderStyle } from "../../constants/TableStyles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const WareHousePage = () => {
  const navigate = useNavigate();

  const stores = [
    {
      id: 1,
      name: "Warehouse A",
      address: "123 Main St, City, Country",
      building: "Building 1",
      created_at: "2023-01-01",
    },
    {
      id: 2,
      name: "Warehouse B",
      address: "456 Elm St, City, Country",
      building: "Building 2",
      created_at: "2023-02-01",
    },
  ];

  const handleEdit = (rowData) => {
    // Logic for editing warehouse
    console.log("Edit warehouse:", rowData);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            aria-label="Actions"
          >
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuItem onClick={() => handleEdit(order)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  return (
    <div className="h-full overflow-hidden">
      <div className="flex justify-between items-center py-2 sticky top-0 z-10 bg-background">
        <Breadcrumbs
          items={[
            {
              label: "Warehouses",
              isPage: true,
            },
          ]}
        />

        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="hover:bg-gray-200"
            onClick={() => null}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            className="hover:bg-blue-800"
            onClick={() => navigate("/warehouses/new")}
          >
            <Plus className="h-4 w-4" />
            Add Store
          </Button>
        </div>
      </div>

      <div className="mt-4 h-full mb-2">
        <DataTable
          value={stores}
          paginator
          rows={10}
          className="bg-background h-full"
          emptyMessage="No warehouses found."
          loading={false}
          loadingIcon="pi pi-spin pi-spinner"
          showGridlines
          stripedRows
          rowHover
          globalFilterFields={["name", "location"]}
          scrollable
          scrollHeight="flex"
          size="small"
          dataKey="id"
          tableStyle={DataTableStyle}
        >
          {/* Define your columns here */}
          <Column field="name" header="Name" headerStyle={TableHeaderStyle} />
          <Column
            field="address"
            header="Address"
            headerStyle={TableHeaderStyle}
          />
          <Column
            field="building"
            header="Building"
            headerStyle={TableHeaderStyle}
          />
          <Column
            field="created_at"
            header="Created At"
            headerStyle={TableHeaderStyle}
          />
          <Column header="Actions" body={actionBodyTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default WareHousePage;
