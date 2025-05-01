import ProductsTable from "./components/ProductsTable";
import Breadcrumbs from "../../components/breadcrumbs";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectIsFetchingProducts } from "../../store/features/products/productSelectors";
import { fetchProducts } from "../../store/features/products/productThunks";

const Products = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isFetchingProducts = useAppSelector(selectIsFetchingProducts);

  const handleAddProduct = () => {
    navigate("/products/new");
  };

  const handleRefresh = () => {
    dispatch(fetchProducts());
  };

  return (
    <div>
      <div className="flex justify-between items-center py-2 sticky top-16 z-10 bg-background">
        <Breadcrumbs
          items={[
            {
              label: "Products",
              isPage: true,
            },
          ]}
        />
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isFetchingProducts}
            className="items-center gap-2"
          >
            <RefreshCw
              className={`size-4 ${isFetchingProducts ? "animate-spin" : null}`}
            />
            Refresh
          </Button>

          <Button onClick={handleAddProduct}>
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <ProductsTable />
      </div>
    </div>
  );
};

export default Products;
