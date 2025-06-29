import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    onChange(start, end);
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    } else if (startDate) {
      return startDate.toLocaleDateString();
    }
    return "Select date range";
  };

  return (
    <div className="relative">
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
    </div>
  );
};

export default DashboardDateRangePicker; 