import { useEffect } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectCategories,
  selectIsFetchingCategories,
} from "../../store/features/categories/categorySelectors";
import { fetchCategories } from "../../store/features/categories/categoryThunks";
import CategoryCard from "./components/CategoryCard";
import { ProgressBar } from "primereact/progressbar";
import { useNavigate } from "react-router-dom";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.categories);

  const categories = useAppSelector(selectCategories);
  const isFetchingCategories = useAppSelector(selectIsFetchingCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchCategories());
  };

  const handleAddCategory = () => {
    navigate("/categories/new");
  };

  const getCategoryById = (parentId: string) =>
    categories.find((category) => category.id === parentId);

  return (
    <div className="h-full overflow-hidden p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <div className="flex gap-x-2">
          <Button
            variant="outline"
            size="sm"
            className="px-2"
            onClick={handleRefresh}
            disabled={isFetchingCategories}
          >
            <RefreshCcw
              className={`h-4 w-4 ${
                isFetchingCategories ? "animate-spin" : ""
              }`}
            />
            <span className="ml-2">Refresh</span>
          </Button>
          <Button size="sm" onClick={handleAddCategory}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="h-full overflow-hidden">
        {/* Loading state */}
        {status === "loading" && (
          <ProgressBar mode="indeterminate" style={{ height: "4px" }} />
        )}

        {/* Content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              parentCategory={getCategoryById(category.parent_id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
