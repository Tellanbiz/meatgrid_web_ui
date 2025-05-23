import {
  EllipsisVertical,
  Pencil,
  Plus,
  RefreshCcw,
  Package,
} from "lucide-react";
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
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectStores,
  selectIsFetchingStores,
} from "../../store/features/stores/storeSelectors";
import { fetchStores } from "../../store/features/stores/storeThunks";
import { Store } from "../../store/features/stores/storeTypes";
import { useEffect } from "react";
import { ProgressBar } from "primereact/progressbar";

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

  const handleViewStoreProducts = (store: Store) => {
    navigate(`/warehouses/${store.id}/products`);
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
          <DropdownMenuItem onClick={() => handleViewStoreProducts(store)}>
            <Package className="mr-2 h-4 w-4" /> View Store Products
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const viewProductsBodyTemplate = (warehouse: Store) => {
    return (
      <Link
        to={`/warehouses/${warehouse.id}/products`}
        className="underline text-primary-500 hover:text-primary-700"
      >
        View Products
      </Link>
    );
  };

  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">WareHouses</h1>
        <div className="flex gap-x-2">
          <Button
            variant="outline"
            size="sm"
            className="px-2"
            onClick={handleRefresh}
            disabled={isFetchingStores}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetchingStores ? "animate-spin" : ""}`}
            />
            <span className="ml-2">Refresh</span>
          </Button>
          <Button size="sm" onClick={() => navigate("/warehouses/new")}>
            <Plus className="h-4 w-4" />
            Add Store
          </Button>
        </div>
      </div>
      
      {isFetchingStores && (
        <ProgressBar mode="indeterminate" style={{ height: "4px" }} />
      )}

      <div className="h-table">
        <DataTable
          value={stores}
          paginator
          rows={10}
          emptyMessage="No warehouses found."
          loading={false}
          loadingIcon="pi pi-spin pi-spinner"
          rowHover
          globalFilterFields={["name", "location"]}
          scrollable
          scrollHeight="flex"
          size="small"
          dataKey="id"
          tableStyle={DataTableStyle}
          className="h-full bg-white p-2 rounded-md"
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
            header="Store Products"
            body={viewProductsBodyTemplate}
            headerStyle={TableHeaderStyle}
          />
          <Column
            header="Actions"
            body={actionBodyTemplate}
            headerStyle={TableHeaderStyle}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default WareHousePage;
