import { useEffect } from "react";
import { Plus } from "lucide-react";
import Breadcrumbs from "../../components/breadcrumbs";
import { PrimaryButton, SecondaryButton } from "../../components/Button";
import CategoryCard from "./components/CategoryCard";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchCategories } from "../../store/features/categories/categoryThunks";
import LoadingPage from "../../components/LoadingPage";

const Categories = () => {
  const dispatch = useAppDispatch();
  const { categories, status, error } = useAppSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleExport = () => {
    // Handle export logic
  };

  const handleAddCategory = () => {
    // Handle add new category logic
  };

  const getCategoryById = (parentId: string) =>
    categories.find((category) => category.id === parentId);

  return (
    <div>
      {/* Top Bar */}
      <div className="flex justify-between items-center py-3 sticky top-0 z-10 bg-background">
        <Breadcrumbs items={[{ label: "Categories", isPage: true }]} />
        <div className="flex gap-2">
          <SecondaryButton
            text="Export"
            className="font-semibold"
            onClick={handleExport}
          />
          <PrimaryButton
            text="New Category"
            icon={<Plus size={16} />}
            className="font-semibold"
            onClick={handleAddCategory}
          />
        </div>
      </div>

      {/* Category List */}
      <div className="mt-4">
        {status === "loading" ? (
          <LoadingPage />
        ) : error ? (
          <div className="text-center text-red-500 font-medium py-4">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

export default Categories;
