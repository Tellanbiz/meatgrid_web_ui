import { EllipsisVertical, Pencil, Plus, RefreshCcw } from "lucide-react";
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
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectStores,
  selectIsFetchingStores,
} from "../../store/features/stores/storeSelectors";
import { fetchStores } from "../../store/features/stores/storeThunks";
import { Store } from "../../store/features/stores/storeTypes";
import { useEffect } from "react";
import LoadingPage from "../../components/LoadingPage";

const WareHousePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const stores = useAppSelector(selectStores);
  const isFetchingStores = useAppSelector(selectIsFetchingStores);

  const handleRefresh = () => {
    dispatch(fetchStores());
  };

  const handleEdit = (store: Store) => {
    navigate(`/warehouses/${store.id}/edit`);
  };

  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  const actionBodyTemplate = (store: Store) => {
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
          <DropdownMenuItem onClick={() => handleEdit(store)}>
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
            disabled={isFetchingStores}
            onClick={handleRefresh}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetchingStores ? "animate-spin" : ""}`}
            />
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

      <div className="mt-2 card h-table">
        {isFetchingStores && <LoadingPage />}

        {!isFetchingStores && (
          <DataTable
            value={stores}
            paginator
            rows={10}
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
            <Column field="name" header="Name" headerStyle={TableHeaderStyle} />
            <Column
              field="address"
              header="Address"
              headerStyle={TableHeaderStyle}
            />
            <Column
              field="building_name"
              header="Building"
              headerStyle={TableHeaderStyle}
            />
            <Column
              field="created_at"
              header="Created At"
              headerStyle={TableHeaderStyle}
              body={(store) =>
                new Date(store.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              }
            />
            <Column
              header="Actions"
              body={actionBodyTemplate}
              headerStyle={TableHeaderStyle}
            />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default WareHousePage;
