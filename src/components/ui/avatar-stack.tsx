import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback } from "./avatar";

interface AvatarStackProps {
  items: string[];
  limit?: number;
  className?: string;
}

export function AvatarStack({ items, limit = 3, className }: AvatarStackProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const visibleItems = items.slice(0, limit);
  const remainingCount = Math.max(0, items.length - limit);

  return (
    <div className={cn("flex -space-x-3", className)}>
      {visibleItems.map((item, index) => (
        <Avatar
          key={index}
          className="h-8 w-8 border-2 border-white relative inline-block"
        >
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(item)}
          </AvatarFallback>
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <Avatar className="h-8 w-8 border-2 border-white relative inline-block">
          <AvatarFallback className="bg-muted text-muted-foreground">
            +{remainingCount}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
