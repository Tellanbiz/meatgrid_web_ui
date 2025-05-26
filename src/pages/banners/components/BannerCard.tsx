import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface BannerCardProps {
  id: string;
  name: string;
  imageUrl: string;
  active: boolean;
  categoryName: string;
  tagName: string;
  toggleActiveLoading?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

const BannerCard = ({
  id,
  name,
  imageUrl,
  active,
  categoryName,
  tagName,
  toggleActiveLoading,
  onEdit,
  onDelete,
  onToggleActive,
}: BannerCardProps) => {
  return (
    <Card className="shadow-sm border rounded-lg gap-y-0 p-0">
      <CardHeader className="p-0">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-24 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-3 space-y-1.5">
        <CardTitle className="font-medium truncate text-sm p-0">{name}</CardTitle>
        <div className="text-xs text-muted-foreground truncate">
          {categoryName}
        </div>
        <Badge variant="outline" className="text-[10px]">
          {tagName}
        </Badge>
      </CardContent>
      <CardFooter className="flex justify-between items-center py-2 px-3">
        <div className="flex items-center space-x-2">
          {toggleActiveLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin [animation-duration:0.7s]" />
          ) : (
            <Switch
              className="origin-left"
              checked={active}
              onCheckedChange={(checked) => onToggleActive(id, checked)}
            />
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(id)}>
              <Pencil className="w-4 h-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(id)}
              className="text-red-500"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default BannerCard;
