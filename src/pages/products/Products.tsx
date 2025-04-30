import ProductsTable from "./components/ProductsTable";
import Breadcrumbs from "../../components/breadcrumbs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Download, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";

const Products = () => {
  const navigate = useNavigate();
  const handleAddProduct = () => {
    navigate("/products/new");
  };

  const handleExport = () => {
    toast.success("Export successfully");
  };

  return (
    <div>
      <div className="flex justify-between items-center py-2 sticky top-0 z-10 bg-background">
        <Breadcrumbs
          items={[
            {
              label: "Products",
              isPage: true,
            },
          ]}
        />
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
            <span>Export</span>
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
