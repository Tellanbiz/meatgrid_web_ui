import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "../../../components/ui/button";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";
import { StorageType } from "../../../store/features/storages/storageTypes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import LoadingPage from "../../../components/LoadingPage";

interface StorageTypeTableProps {
  storageTypes: StorageType[];
  isLoading: boolean;
  onEdit: (storageTypeId: string) => void;
  onDelete: (storageTypeId: string) => void;
}

const StorageTypeTable: React.FC<StorageTypeTableProps> = ({
  storageTypes,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const actionsBodyTemplate = (rowData: StorageType) => {
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
          <DropdownMenuItem onClick={() => onEdit(rowData.id)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => onDelete(rowData.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="mt-2 card bg-background h-11/12">
      {!isLoading && (
        <DataTable
          value={storageTypes}
          loading={isLoading}
          className="h-full"
          dataKey="id"
          paginator
          rows={25}
          rowsPerPageOptions={[10, 25, 50]}
          emptyMessage="No storage types found."
          loadingIcon="pi pi-spin pi-spinner"
          stripedRows
          rowHover
          scrollable
          scrollHeight="flex"
          paginatorPosition="bottom"
          size="small"
          tableStyle={DataTableStyle}
        >
          <Column field="name" header="Name" headerStyle={TableHeaderStyle} />
          <Column
            field="description"
            header="Description"
            headerStyle={TableHeaderStyle}
          />
          <Column
            field="duration_type"
            header="Duration Type"
            headerStyle={TableHeaderStyle}
          />
          <Column
            field="expected_duration"
            header="Expected Duration (days)"
            headerStyle={TableHeaderStyle}
          />

          <Column
            header="Temp Range (°C)"
            body={(rowData: StorageType) => {
              return (
                <div>
                  {rowData.min_temp} - {rowData.max_temp}
                </div>
              );
            }}
            headerStyle={TableHeaderStyle}
          />
          <Column
            header="Actions"
            headerStyle={TableHeaderStyle}
            body={actionsBodyTemplate}
          />
        </DataTable>
      )}
    </div>
  );
};

export default StorageTypeTable;
