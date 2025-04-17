import { FiPlus } from "react-icons/fi";
import { PrimaryButton, SecondaryButton } from "../../components/Button";
import RecipeTable from "./components/RecipeTable";
import { useNavigate } from "react-router-dom";

const Recipes = () => {
  const navigate = useNavigate();

  function handleExport(): void {
    throw new Error("Function not implemented.");
  }

  function handleAddRecipe(): void {
    navigate("/recipes/new");
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center py-2 bg-background sticky top-0 z-10">
          <h4 className="text-base font-bold">Recipes</h4>
          <div className="flex space-x-2">
            <SecondaryButton
              text="Export"
              className="mr-2 font-bold"
              onClick={handleExport}
            />

            <PrimaryButton
              text="Add Recipe"
              className="font-bold"
              icon={<FiPlus />}
              onClick={handleAddRecipe}
            />
          </div>
        </div>

        <div className="mt-4 h-full">
          <RecipeTable />
        </div>
      </div>
    </>
  );
};
export default Recipes;
