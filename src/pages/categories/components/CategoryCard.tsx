import { CardContent, CardHeader } from "@/components/ui/card";
import { Category } from "../../../store/features/categories/categoryTypes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectIsDeletingCategory } from "../../../store/features/categories/categorySelectors";
import { deleteCategory } from "../../../store/features/categories/categoryThunks";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import { Badge } from "@/components/ui/badge";

interface CategoryCardProps {
  category: Category;
  parentCategory?: Category;
}

export default function CategoryCard({
  category,
  parentCategory,
}: CategoryCardProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [dialogOpen, setDialogOpen] = useState(false);
  const isDeleting = useAppSelector(selectIsDeletingCategory);

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteCategory(category.id)).unwrap();
      toast.success(`Deleted "${category.name}" successfully!`);
    } catch {
      toast.error("Failed to delete category.");
    }
  };

  const handleDeleteClick = () => {
    // Delay to allow dropdown to close first
    setTimeout(() => setDialogOpen(true), 100);
  };

  const handleEditClick = () => {
    navigate(`/categories/${category.id}/edit`);
  };

  return (
    <>
      <div className="w-full max-w-xs bg-white border  rounded-sm overflow-hidden transition text-sm pt-0 pb-3 gap-y-1.5">
        <CardHeader className="relative p-0">
          <div className="relative h-28 w-full p-2">
            <img
              src={category.image}
              alt={category.name}
              className="object-cover w-full h-full rounded border"
            />

            {/* Ellipsis Menu */}
            <div className="absolute top-2 right-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex flex-row space-y-2 p-2 items-center rounded border bg-white text-black transition">
                    <p className="font-semibold">Edit</p>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={4}>
                  <DropdownMenuItem onClick={handleEditClick}>
                    <Pencil className="mr-2 h-3 w-3" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={handleDeleteClick}
                  >
                    <Trash className="mr-2 h-3 w-3 text-red-600" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-1 px-2 pt-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold px-2 border w-fit bg-green-700 text-white uppercase">
              {category.name}
            </div>
            <Badge
              variant={category.active ? "default" : "secondary"}
              className={
                category.active
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }
            >
              {category.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-[13px] font-semibold text-black">
            {parentCategory?.name ?? "None"}
          </p>
          {category.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {category.description}
            </p>
          )}
        </CardContent>
      </div>

      <DeleteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={`Delete "${category.name}"?`}
        description="This action cannot be undone. Are you sure you want to continue?"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
