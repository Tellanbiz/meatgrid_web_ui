import { PrimaryButton } from "../../components/Button";
import { FiDownload } from "react-icons/fi";
import CustomerGrowth from "./components/CustomerGrowth";
import CustomerStatistics from "./components/CustomerStatistics";
import CardComponent from "./components/CardComponent";
import AverageOrderComponent from "./components/AverageOrderComponent";
import { Button } from "../../components/ui/button";
import { Download } from "lucide-react";
import Breadcrumbs from "../../components/breadcrumbs";

const Reports = () => {
  const handleDownload = () => {};
  const salesGoalData = {
    title: "Sales Goal",
    value: 75,
    totalValue: 100,
    color: "#FFC700",
    statistics: [
      { label: "Sold for", value: "$70.90" },
      { label: "Month goal", value: "$75.23" },
      { label: "Left", value: "$25.50" },
    ],
  };

  const conversionRateData = {
    title: "Conversion Rate",
    value: 75,
    totalValue: 100,
    color: "#1FD286",
    statistics: [
      { label: "Cart", value: "35$" },
      { label: "Checkout", value: "75%" },
      { label: "Purchase", value: "25%" },
    ],
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <Breadcrumbs
          items={[
            {
              label: "Reports",
              isPage: true,
            },
          ]}
        />

        <Button className="space-x-2" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>

      <div className="space-y-4 mt-4">
        <CustomerStatistics />

        <CustomerGrowth />

        <div className="grid grid-cols-4 gap-3">
          <CardComponent
            title={salesGoalData.title}
            value={salesGoalData.value}
            totalValue={salesGoalData.totalValue}
            color={salesGoalData.color}
            statistics={salesGoalData.statistics}
          />
          <CardComponent
            title={conversionRateData.title}
            value={conversionRateData.value}
            totalValue={conversionRateData.totalValue}
            color={conversionRateData.color}
            statistics={conversionRateData.statistics}
          />

          <div className="col-span-2">
            <AverageOrderComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
