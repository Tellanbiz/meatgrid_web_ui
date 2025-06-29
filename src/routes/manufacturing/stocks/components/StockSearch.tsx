import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface StockSearchProps {
  onSearch: (searchTerm: string, startDate: Date | undefined, endDate: Date | undefined) => void;
  onClear: () => void;
}

const StockSearch = ({ onSearch, onClear }: StockSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleSearch = () => {
    onSearch(searchTerm, startDate, endDate);
  };

  const handleClear = () => {
    setSearchTerm("");
    setStartDate(undefined);
    setEndDate(undefined);
    onClear();
  };

  const hasFilters = searchTerm || startDate || endDate;

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg bg-white">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={handleSearch} className="px-6">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>

        {hasFilters && (
          <Button variant="outline" onClick={handleClear}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Active filters:</span>
          {searchTerm && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Product: {searchTerm}
            </span>
          )}
          {startDate && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              From: {format(startDate, "MMM dd, yyyy")}
            </span>
          )}
          {endDate && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              To: {format(endDate, "MMM dd, yyyy")}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch; 