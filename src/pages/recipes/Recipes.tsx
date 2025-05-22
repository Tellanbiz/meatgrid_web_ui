import RecipeTable from "./components/RecipeTable";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectIsFetchingRecipes } from "../../store/features/recipe/recipeSelectors";
import { fetchRecipes } from "../../store/features/recipe/recipeThunks";

const Recipes = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isFetchingRecipes = useAppSelector(selectIsFetchingRecipes);

  const handleRefresh = () => {
    dispatch(fetchRecipes());
  };

  function handleAddRecipe(): void {
    navigate("/recipes/new");
  }

  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Recipes</h1>
        <div className="flex gap-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetchingRecipes}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetchingRecipes ? "animate-spin" : ""}`}
            />
            <span className="ml-2">Refresh</span>
          </Button>
          <Button size="sm" onClick={handleAddRecipe}>
            <Plus className="w-4 h-4 mr-2" />
            Add Recipe
          </Button>
        </div>
      </div>

      <div className="mt-2 h-table">
        <RecipeTable />
      </div>
    </div>
  );
};
export default Recipes;
