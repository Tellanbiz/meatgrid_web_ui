import { useEffect } from "react";
import { Download, Plus } from "lucide-react";
import Breadcrumbs from "../../components/breadcrumbs";
import CategoryCard from "./components/CategoryCard";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchCategories } from "../../store/features/categories/categoryThunks";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "../../components/ui/button";
import { selectCategories } from "../../store/features/categories/categorySelectors";
import { useNavigate } from "react-router-dom";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.categories);

  const categories = useAppSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleExport = () => {
    // Handle export logic
  };

  const handleAddCategory = () => {
    navigate("/categories/new");
  };

  const getCategoryById = (parentId: string) =>
    categories.find((category) => category.id === parentId);

  return (
    <div>
      <div className="flex justify-between items-center py-3 sticky top-16 z-20 bg-background">
        <Breadcrumbs items={[{ label: "Categories", isPage: true }]} />
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button variant="default" onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Category List */}
      <div className="mt-2">
        {status === "loading" && (
          <ProgressBar mode="indeterminate" style={{ height: "6px" }} />
        )}

        {error ? (
          <div className="text-center text-red-500 font-medium py-4">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                parentCategory={getCategoryById(category.parent_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
