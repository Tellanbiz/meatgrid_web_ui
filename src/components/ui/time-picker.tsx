import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  const [selectedHour, setSelectedHour] = React.useState("10");
  const [selectedMinute, setSelectedMinute] = React.useState("00");
  const [selectedPeriod, setSelectedPeriod] = React.useState("AM");

  React.useEffect(() => {
    if (value) {
      const timeParts = value.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeParts) {
        setSelectedHour(timeParts[1]);
        setSelectedMinute(timeParts[2]);
        setSelectedPeriod(timeParts[3].toUpperCase());
      }
    }
  }, [value]);

  const handleApply = () => {
    const timeString = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
    onChange?.(timeString);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-9 px-3 py-2 justify-start text-left text-sm font-normal bg-background hover:bg-background",
            !value && "text-muted-foreground"
          )}
        >
          <span className="w-full flex items-center justify-between">
            {value || "Select time"}
            <Clock className="h-4 w-4 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <div className="flex p-1">
          <div className="flex w-full">
            <div className="grid grid-cols-3 gap-1 w-full">
              {/* Hours */}
              <div className="flex flex-col overflow-y-auto max-h-[200px] scrollbar-thin">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    variant="ghost"
                    className={cn(
                      "h-8 rounded-none justify-center hover:bg-accent",
                      selectedHour === hour.toString() && "bg-primary/10 text-primary font-medium"
                    )}
                    onClick={() => setSelectedHour(hour.toString().padStart(2, '0'))}
                  >
                    {hour.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              {/* Minutes */}
              <div className="flex flex-col overflow-y-auto max-h-[200px] scrollbar-thin">
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    variant="ghost"
                    className={cn(
                      "h-8 rounded-none justify-center hover:bg-accent",
                      selectedMinute === minute && "bg-primary/10 text-primary font-medium"
                    )}
                    onClick={() => setSelectedMinute(minute)}
                  >
                    {minute}
                  </Button>
                ))}
              </div>
              {/* AM/PM */}
              <div className="flex flex-col">
                {periods.map((period) => (
                  <Button
                    key={period}
                    variant="ghost"
                    className={cn(
                      "h-8 rounded-none justify-center hover:bg-accent",
                      selectedPeriod === period && "bg-primary/10 text-primary font-medium"
                    )}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t p-2">
          <Button 
            variant="ghost" 
            className="h-8 px-3 text-xs"
            onClick={() => onChange?.("")}
          >
            Cancel
          </Button>
          <Button 
            className="h-8 px-3 text-xs bg-primary"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
