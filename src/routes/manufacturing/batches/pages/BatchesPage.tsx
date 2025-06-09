import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectIsFetchingBatches } from "@/store/features/batches/batchSelectors";
import { fetchBatches } from "@/store/features/batches/batchThunks";
import { RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BatchesTable from "../components/BatchesTable";

const BatchesPage = () => {
  const dispatch = useAppDispatch();
  const [searchString, setSearchString] = useState<string>("");
  const isFetchingBatches = useAppSelector(selectIsFetchingBatches);

  const handleRefresh = () => {
    dispatch(fetchBatches());
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col bg-background border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search batches..."
                value={searchString}
                onChange={handleSearchChange}
                className="pl-9 h-10 border-gray-200 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isFetchingBatches}
              size="sm"
              className="px-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetchingBatches ? "animate-spin" : ""}`}
              />
              <span className="ml-2">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="h-table">
        <BatchesTable searchString={searchString} />
      </div>
    </div>
  );
};

export default BatchesPage;
