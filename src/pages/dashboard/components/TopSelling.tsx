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
import { fetchTopProducts } from "../../../store/features/reports/reportThunks";
import { selectTopProducts, selectIsFetchingTopProducts } from "../../../store/features/reports/reportSelectors";

interface TopSellingItem {
  name: string;
  sold: number;
  weight: string;
  price: number;
  images?: string;
}

const TopSelling = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>("last_7_days");
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const topProducts = useSelector(selectTopProducts);
  const isLoading = useSelector(selectIsFetchingTopProducts);

  const fetchData = () => {
    if (selectedDuration === "custom" && dateRange?.from && dateRange?.to) {
      dispatch(fetchTopProducts({
        start_date: format(dateRange.from, "yyyy-MM-dd"),
        end_date: format(dateRange.to, "yyyy-MM-dd")
      }));
    } else {
      const [start_date, end_date] = getDateRange(selectedDuration);
      dispatch(fetchTopProducts({
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

  const items: TopSellingItem[] = topProducts.map(product => ({
    name: product.name,
    sold: product.order_count,
    weight: product.unit_type,
    price: product.regular_price,
    images: product.images || '/placeholder-product.png'
  }));

  const itemNameTemplate = (rowData: TopSellingItem) => (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={rowData.images} 
          alt={rowData.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-product.png';
          }}
        />
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{rowData.name}</span>
        <span className="text-sm text-gray-500">{rowData.weight}</span>
      </div>
    </div>
  );

  const soldTemplate = (rowData: TopSellingItem) => (
    <Badge className="bg-green-100 text-green-800 rounded-md px-2 py-1">
      Sold: {rowData.sold}
    </Badge>
  );

  const revenueTemplate = (rowData: TopSellingItem) => (
    <div className="text-center">
      KES {(rowData.price * rowData.sold).toLocaleString()}
    </div>
  );

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-medium">Top Selling</h3>
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
              placeholder="Search products..."
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
            emptyMessage="No products found"
            scrollable
            scrollHeight="400px"
            style={{ height: '400px' }}
          >
            <Column
              field="name"
              header="Item Name"
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
              body={itemNameTemplate}
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
              field="sold"
              header="Total Sold"
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
              body={soldTemplate}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default TopSelling;
