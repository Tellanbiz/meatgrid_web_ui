import * as React from "react";
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

export interface TimeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "prefix"> {
  prefix?: React.ReactNode;
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ className, prefix, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          type="time"
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
        />
        {prefix === undefined ? (
          <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        ) : (
          prefix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
              {prefix}
            </div>
          )
        )}
      </div>
    );
  }
);

TimeInput.displayName = "TimeInput";

export { TimeInput };
