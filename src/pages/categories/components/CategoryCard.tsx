import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Category } from "../../../store/features/categories/categoryTypes";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader as DialogHeaderBox,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CategoryCardProps {
  category: Category;
  parentCategory?: Category;
}

export default function CategoryCard({
  category,
  parentCategory,
}: CategoryCardProps) {
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      toast.success(`Deleted "${category.name}" successfully!`);
    } catch {
      toast.error("Failed to delete category.");
    } finally {
      setDialogOpen(false);
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
      <Card className="w-full max-w-xs rounded-xl overflow-hidden shadow-sm hover:shadow-md transition text-sm pt-0 pb-3 gap-y-1.5">
        <CardHeader className="relative p-0">
          <div className="relative h-24 w-full">
            <img
              src={category.image}
              alt={category.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1">
              <h3 className="text-white text-sm font-semibold truncate">
                {category.name}
              </h3>
            </div>

            {/* Ellipsis Menu */}
            <div className="absolute top-2 right-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition">
                    <MoreVertical size={14} />
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
          {category.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {category.description}
            </p>
          )}
          <p className="text-xs text-gray-500">
            Parent: {parentCategory?.name ?? "None"}
          </p>
          <Badge variant="secondary" className="text-xs lowercase">
            {category.tag}
          </Badge>
        </CardContent>
      </Card>

      {/* Separate Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeaderBox>
            <DialogTitle>Delete "{category.name}"?</DialogTitle>
          </DialogHeaderBox>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. Are you sure you want to continue?
          </p>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
