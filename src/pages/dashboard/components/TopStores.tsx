import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "../../../components/ui/badge";
import { Search, Loader2 } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "../../../components/ui/date-range-picker";
import { Button } from "../../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { format } from "date-fns";
import { DurationOption, getDateRange } from "../../../utils/dateUtils";
import { DataTableStyle, TableHeaderStyle } from "../../../constants/TableStyles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { fetchTopStores } from "../../../store/features/reports/reportThunks";
import { selectTopStores, selectIsFetchingTopStores } from "../../../store/features/reports/reportSelectors";

interface TopStoreItem {
  name: string;
  orders: number;
  revenue: number;
}

const TopStores = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>("last_7_days");
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const topStores = useSelector(selectTopStores);
  const isLoading = useSelector(selectIsFetchingTopStores);

  const fetchData = () => {
    if (selectedDuration === "custom" && dateRange?.from && dateRange?.to) {
      dispatch(fetchTopStores({
        start_date: format(dateRange.from, "yyyy-MM-dd"),
        end_date: format(dateRange.to, "yyyy-MM-dd")
      }));
    } else {
      const [start_date, end_date] = getDateRange(selectedDuration);
      dispatch(fetchTopStores({
        start_date,
        end_date
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDuration, dateRange]);

  const quickDateOptions = [
    { label: "Today", value: "today" },
    { label: "Last 7 days", value: "last_7_days" },
    { label: "Last 30 days", value: "last_30_days" },
    { label: "This Week", value: "this_week" },
    { label: "Last Week", value: "last_week" },
    { label: "This Month", value: "this_month" },
    { label: "Last Month", value: "last_month" },
  ];

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      setSelectedDuration("custom");
      setDatePopoverOpen(false);
    }
  };

  const handleQuickDateSelect = (value: DurationOption) => {
    setSelectedDuration(value);
    const [start_date, end_date] = getDateRange(value);
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    setDateRange({
      from: startDateObj,
      to: endDateObj,
    });
    setDatePopoverOpen(false);
  };

  const getSelectedDateLabel = () => {
    if (selectedDuration === "custom" && dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, "LLL dd, y")} - ${format(
        dateRange.to,
        "LLL dd, y"
      )}`;
    }

    const [start_date, end_date] = getDateRange(selectedDuration);
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    return `${format(startDate, "LLL dd, y")} - ${format(endDate, "LLL dd, y")}`;
  };

  const items: TopStoreItem[] = topStores.map(store => ({
    name: store.store_name,
    orders: store.order_count,
    revenue: store.total_revenue
  }));

  const storeNameTemplate = (rowData: TopStoreItem) => (
    <div className="flex items-center">
      <span className="font-medium text-gray-900">{rowData.name}</span>
    </div>
  );

  const ordersTemplate = (rowData: TopStoreItem) => (
    <Badge className="bg-green-100 text-green-800 rounded-md px-2 py-1">
      Orders: {rowData.orders}
    </Badge>
  );

  const revenueTemplate = (rowData: TopStoreItem) => (
    <div className="text-center">
      KES {rowData.revenue.toLocaleString()}
    </div>
  );

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-medium">Top Stores</h3>
          <div className="w-[200px]">
            <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 px-3 bg-white w-full text-sm"
                >
                  {getSelectedDateLabel()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-2 border-b">
                  <div className="font-medium mb-2">Quick Select</div>
                  <div className="grid grid-cols-2 gap-2">
                    {quickDateOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={
                          selectedDuration === option.value
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          handleQuickDateSelect(option.value as DurationOption)
                        }
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="p-2">
                  <div className="font-medium mb-2">Custom Range</div>
                  <DateRangePicker
                    date={dateRange}
                    onDateChange={handleDateRangeChange}
                    className="w-full"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full bg-white border-gray-200"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden relative min-h-[200px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          )}
          <DataTable
            value={filteredItems}
            tableStyle={{
              ...DataTableStyle,
              borderCollapse: "separate",
              borderSpacing: "0 10px",
            }}
            className="w-full"
            emptyMessage="No stores found"
            scrollable
            scrollHeight="400px"
            style={{ height: '400px' }}
          >
            <Column
              field="name"
              header="Store Name"
              headerStyle={{
                ...TableHeaderStyle,
                background: "white",
                textAlign: "left",
                position: "sticky",
                top: 0,
                zIndex: 1,
                paddingLeft: '1rem'
              }}
              style={{ 
                minWidth: '300px',
                paddingLeft: '1rem'
              }}
              body={storeNameTemplate}
            />

            <Column
              field="revenue"
              header="Total Revenue"
              headerStyle={{
                ...TableHeaderStyle,
                background: "white",
                textAlign: "center",
                position: "sticky",
                top: 0,
                zIndex: 1
              }}
              body={revenueTemplate}
            />

            <Column
              field="orders"
              header="Total Orders"
              headerStyle={{
                ...TableHeaderStyle,
                background: "white",
                display: "flex",
                justifyContent: "center",
                position: "sticky",
                top: 0,
                zIndex: 1
              }}
              style={{ textAlign: "center" }}
              body={ordersTemplate}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default TopStores; 