import EditRecipeComponent from "./components/EditRecipeComponent";
import BackButton from "../../components/BackButton";

const EditRecipe = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <BackButton />
        <h4 className="text-base font-bold">Edit Recipe</h4>
      </div>

      <div className="bg-white rounded h-full">
        <EditRecipeComponent />
      </div>
    </>
  );
};

export default EditRecipe;
