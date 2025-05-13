import { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import ProgressIndicator from "../../../components/ProgressIndicator.tsx";
import { PrimaryButton } from "../../../components/Button.tsx";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  deleteRecipe,
  fetchRecipes,
} from "../../../store/features/recipe/recipeThunks.ts";
import { Recipe } from "../../../store/features/recipe/recipeTypes.ts";

const RecipeTable = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { recipes, status, error } = useAppSelector((state) => state.recipes);
  const { deleteStatus, deleteError } = useAppSelector(
    (state) => state.recipes
  );
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [deletionInProgress, setDeletionInProgress] = useState(false);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  useEffect(() => {
    if (!deletionInProgress) return;

    if (deleteStatus === "succeeded") {
      toast.success("Recipe deleted successfully.");
      setOpenDialog(false);
      setDeletionInProgress(false);
    }

    if (deleteStatus === "failed") {
      toast.error(deleteError || "Failed to delete recipe.");
      setDeletionInProgress(false);
    }
  }, [deleteStatus, deletionInProgress, deleteError]);

  const imageTemplate = (rowData: Recipe) => (
    <img
      src={rowData.image}
      alt={rowData.name}
      className="w-10 h-10 object-cover rounded"
    />
  );

  if (status === "loading") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <ProgressIndicator />
      </div>
    );
  }

  if (status === "failed") {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  const handleEdit = (id: string) => {
    navigate(`/recipes/${id}/edit`);
  };

  const handleDeleteConfirm = () => {
    if (recipeToDelete) {
      setDeletionInProgress(true);
      dispatch(deleteRecipe(recipeToDelete.id));
    }
  };

  return (
    <div className="h-full">
      <DataTable
        value={recipes}
        dataKey="id"
        tableStyle={DataTableStyle}
        selection={selectedRecipes}
        selectionMode="checkbox"
        size="small"
        onSelectionChange={(e) => {
          const selected = Array.isArray(e.value) ? e.value : [e.value];
          setSelectedRecipes(selected);
        }}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        scrollable
        scrollHeight="flex"
      >
        <Column
          field="image"
          header="Image"
          body={imageTemplate}
          headerStyle={TableHeaderStyle}
        />
        <Column field="name" header="Name" headerStyle={TableHeaderStyle} />
        <Column
          field="short_description"
          header="Description"
          headerStyle={TableHeaderStyle}
        />
        <Column
          header="Actions"
          body={(rowData: Recipe) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  aria-label="Actions"
                >
                  <EllipsisVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto">
                <DropdownMenuItem onClick={() => handleEdit(rowData.id)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => {
                    setRecipeToDelete(rowData);
                    setOpenDialog(true);
                  }}
                >
                  <Trash className="mr-2 h-4 w-4 text-red-600" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          headerStyle={TableHeaderStyle}
        />
      </DataTable>

      {/* ShadCN Dialog for delete confirmation */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recipe</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-black">
                {recipeToDelete?.name}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <button
              onClick={() => setOpenDialog(false)}
              className="text-sm px-4 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>

            <PrimaryButton
              text={deleteStatus === "loading" ? "Deleting..." : "Yes, Delete"}
              disabled={deleteStatus === "loading"}
              onClick={handleDeleteConfirm}
              className="text-sm py-1 rounded bg-red-600 text-white hover:bg-red-700"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipeTable;
