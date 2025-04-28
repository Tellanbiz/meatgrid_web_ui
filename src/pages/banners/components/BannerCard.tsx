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
import { Loader2, MoreHorizontal } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface BannerCardProps {
  id: string;
  name: string;
  imageUrl: string;
  active: boolean;
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
  toggleActiveLoading,
  onEdit,
  onDelete,
  onToggleActive,
}: BannerCardProps) => {
  return (
    <Card className="shadow-md border rounded-lg">
      <CardHeader className="p-0">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-40 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-medium truncate">{name}</CardTitle>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          {toggleActiveLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Switch
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
            <DropdownMenuItem onClick={() => onEdit(id)}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(id)}
              className="text-red-500"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default BannerCard;
