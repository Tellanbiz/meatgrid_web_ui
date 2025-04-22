import ProductsTable from "./components/ProductsTable";
import { PrimaryButton, SecondaryButton } from "../../components/Button";
import { FiPlus } from "react-icons/fi";
import Breadcrumbs from "../../components/breadcrumbs";
import { toast } from "sonner";

const Products = () => {
  const handleAddProduct = () => {
    console.log("Add Product clicked");
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
          <SecondaryButton
            text="Export"
            className="mr-2 font-bold"
            onClick={handleExport}
          />

          <PrimaryButton
            text="Add Product"
            className="font-bold"
            icon={<FiPlus />}
            onClick={handleAddProduct}
          />
        </div>
      </div>

      <div className="mt-4">
        <ProductsTable />
      </div>
    </div>
  );
};

export default Products;
