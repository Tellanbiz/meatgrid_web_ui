import React, { useState } from "react";
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
  const hours = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ["AM", "PM"];

  const [open, setOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(10);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("AM");

  React.useEffect(() => {
    if (value) {
      const timeParts = value.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeParts) {
        setSelectedHour(parseInt(timeParts[1]));
        setSelectedMinute(parseInt(timeParts[2]));
        setSelectedPeriod(timeParts[3].toUpperCase());
      }
    }
  }, [value]);

  const handleApply = () => {
    const timeString = `${selectedHour}:${selectedMinute
      .toString()
      .padStart(2, "0")} ${selectedPeriod}`;
    onChange?.(timeString);
    setOpen(false);
  };

  const handleCancel = () => {
    onChange?.("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[130px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || "Pick a time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0" align="start">
        <div className="w-full bg-white rounded-xl">
          <div className="flex gap-2 justify-center px-2 pt-4 pb-2">
            {/* Hours */}
            <div className="h-32 overflow-y-auto flex flex-col items-center scrollbar-hide">
              {hours.map((h) => (
                <button
                  key={h}
                  className={`w-12 h-10 flex items-center justify-center rounded-lg mb-1 transition-all
                    ${
                      selectedHour === h
                        ? "bg-primary-100 text-primary-500 font-bold"
                        : "text-gray-500 hover:bg-gray-100"
                    }
                  `}
                  onClick={() => setSelectedHour(h)}
                  type="button"
                >
                  {h.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
            {/* Minutes */}
            <div className="h-32 overflow-y-auto flex flex-col items-center scrollbar-hide">
              {minutes.map((m) => (
                <button
                  key={m}
                  className={`w-12 h-10 flex items-center justify-center rounded-lg mb-1 transition-all
                    ${
                      selectedMinute === m
                        ? "bg-primary-100 text-primary-500 font-bold"
                        : "text-gray-500 hover:bg-gray-100"
                    }
                  `}
                  onClick={() => setSelectedMinute(m)}
                  type="button"
                >
                  {m.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
            {/* AM/PM */}
            <div className="flex flex-col gap-2 ml-2 justify-center">
              {periods.map((period) => (
                <button
                  key={period}
                  className={`w-12 h-10 flex items-center justify-center rounded-lg transition-all
                    ${
                      selectedPeriod === period
                        ? "bg-primary-100 text-primary-500 font-bold"
                        : "text-gray-500 hover:bg-gray-100"
                    }
                  `}
                  onClick={() => setSelectedPeriod(period as "AM" | "PM")}
                  type="button"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-gray-100 mt-2 px-4 py-3">
            <Button
              size="sm"
              variant="outline"
              className=""
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="rounded-lg px-4 py-2 bg-primary-500 text-white font-medium"
              onClick={handleApply}
              type="button"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
