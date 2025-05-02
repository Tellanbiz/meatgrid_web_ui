import RecipeTable from "./components/RecipeTable";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/breadcrumbs";
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
    <>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center py-2 bg-background sticky top-16 z-10">
          <Breadcrumbs items={[{ label: "Recipes", isPage: true }]} />

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              aria-label="Refresh"
              disabled={isFetchingRecipes}
            >
              <RefreshCcw
                className={`size-4 ${isFetchingRecipes ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>

            <Button onClick={handleAddRecipe}>
              <Plus className="size-4" />
              <span>Add Recipe</span>
            </Button>
          </div>
        </div>

        <div className=" card mt-2 h-[calc(100vh-10rem)]">
          <RecipeTable />
        </div>
      </div>
    </>
  );
};
export default Recipes;
