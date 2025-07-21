import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface DashboardDateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DashboardDateRangePicker: React.FC<DashboardDateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState<"single" | "range">(
    "range"
  );

  const handleDateChange = (
    dates: Date | [Date | null, Date | null] | null
  ) => {
    if (selectionMode === "single") {
      const singleDate = dates as Date | null;
      onChange(singleDate, singleDate);
    } else {
      const [start, end] = dates as [Date | null, Date | null];
      onChange(start, end);
    }
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      if (
        selectionMode === "single" ||
        startDate.getTime() === endDate.getTime()
      ) {
        return startDate.toLocaleDateString();
      }
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    } else if (startDate) {
      return startDate.toLocaleDateString();
    }
    return "Select date";
  };

  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onChange(start, end);
    setSelectionMode("range");
  };

  const handleToday = () => {
    const today = new Date();
    onChange(today, today);
    setSelectionMode("single");
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {selectionMode === "range" ? (
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            open={isOpen}
            onInputClick={() => setIsOpen(true)}
            onCalendarOpen={() => setIsOpen(true)}
            onCalendarClose={() => setIsOpen(false)}
            customInput={
              <Button
                variant="outline"
                className={cn(
                  "w-[220px] justify-start text-left font-normal",
                  !startDate && !endDate && "text-muted-foreground"
                )}
                onClick={() => setIsOpen(!isOpen)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange()}
              </Button>
            }
            dateFormat="MMM dd, yyyy"
            placeholderText="Select date range"
            className="w-full"
            popperClassName="z-50"
            popperPlacement="bottom-start"
          />
        ) : (
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            open={isOpen}
            onInputClick={() => setIsOpen(true)}
            onCalendarOpen={() => setIsOpen(true)}
            onCalendarClose={() => setIsOpen(false)}
            customInput={
              <Button
                variant="outline"
                className={cn(
                  "w-[220px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
                onClick={() => setIsOpen(!isOpen)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange()}
              </Button>
            }
            dateFormat="MMM dd, yyyy"
            placeholderText="Select date"
            className="w-full"
            popperClassName="z-50"
            popperPlacement="bottom-start"
          />
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Quick Select
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleToday}>Today</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleQuickSelect(7)}>
            Last 7 days
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleQuickSelect(30)}>
            Last 30 days
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleQuickSelect(60)}>
            Last 60 days
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleQuickSelect(90)}>
            Last 90 days
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setSelectionMode("single");
              setIsOpen(true);
            }}
          >
            Single Date
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setSelectionMode("range");
              setIsOpen(true);
            }}
          >
            Date Range
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DashboardDateRangePicker;
