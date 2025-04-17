import { useState, useEffect, useRef } from "react";
import ProductsTable from "./components/ProductsTable";
import { generateProducts } from "../../service/ProductService";
import { OldProduct } from "../../types/OldProduct";
import { DataTable } from "primereact/datatable";
import { PrimaryButton, SecondaryButton } from "../../components/Button";
import { FiPlus } from "react-icons/fi";

const Products = () => {
  const [products, setProducts] = useState<OldProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<OldProduct[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const dt = useRef<DataTable<OldProduct[]>>(null!);

  useEffect(() => {
    generateProducts().then((data) => setProducts(data));
  }, []);

  const handleAddProduct = () => {
    console.log("Add Product clicked");
  };

  const handleDeleteSelectedProducts = () => {
    console.log("Delete Selected Products clicked");
    const remainingProducts = products.filter(
      (product) => !selectedProducts.includes(product)
    );
    setProducts(remainingProducts);
    setSelectedProducts([]);
  };

  const handleExport = () => {
    if (dt.current) {
      dt.current.exportCSV();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center py-2 sticky top-0 z-10 bg-background">
        <h4 className="text-base font-bold">Products</h4>
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
        <ProductsTable
          products={products}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          globalFilter={globalFilter}
          dtRef={dt}
          setGlobalFilter={setGlobalFilter}
          onDeleteClicked={handleDeleteSelectedProducts}
          onEditClicked={() => console.log("Edit clicked")}
        />
      </div>
    </div>
  );
};

export default Products;
