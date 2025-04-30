import { Download, Plus, RefreshCcw } from "lucide-react";
import Breadcrumbs from "../../components/breadcrumbs";
import StocksTable from "./components/StocksTable";
import { Button } from "../../components/ui/button";

const StocksPage = () => {
  return (
    <>
      <div className="flex justify-between items-center py-3 sticky top-16 z-20 bg-background">
        <Breadcrumbs
          items={[
            {
              label: "Stock",
              isPage: true,
            },
          ]}
        />
        <div className="flex space-x-2">
          <Button variant="outline" className="px-2" onClick={() => null}>
            <RefreshCcw className={`h-4 w-4`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export
          </Button>

          <Button variant="default" className="px-2" onClick={() => null}>
            <Plus className="h-4 w-4" />
            Add Stock
          </Button>
        </div>
      </div>

      <div className="mt-2">
        <StocksTable />
      </div>
    </>
  );
};

export default StocksPage;
