import { FiDollarSign, FiShoppingCart } from "react-icons/fi";
import StatisticsBox from "./components/StatisticsBox";
import OrderStatistics from "./components/OrdersStatistics";
import Last7DaysSales from "./components/Last7DaysSales";
import RecentTransactions from "../../components/RecentTransactions";
import TopProducts from "./components/TopProducts";
import Breadcrumbs from "../../components/breadcrumbs";

const Dashboard = () => {
  return (
    <div className="w-full flex flex-col space-y-8 p-1">
      <div className="flex justify-between items-center sticky top-16 bg-background py-3">
        <Breadcrumbs items={[{ label: "Dashboard", isPage: true }]} />
      </div>

      <div className="space-y-4 m">
        <div className="grid grid-cols-5 gap-4">
          <StatisticsBox
            name="Total Revenue"
            value="$50,000"
            percentage={12}
            isPositive={true}
            icon={<FiDollarSign className="text-blue-500 text-2xl" />}
          />
          <StatisticsBox
            name="Orders"
            value="1,200"
            percentage={8.3}
            isPositive={true}
            icon={<FiShoppingCart className="text-blue-500 text-2xl" />}
          />
          <StatisticsBox
            name="Unique Visitors"
            value="15,000"
            percentage={5.9}
            isPositive={true}
            icon={
              <img
                src="/images/chart-yellow.png"
                alt="Chart Icon"
                className="w-10 h-10"
              />
            }
          />

          <StatisticsBox
            name="New Users"
            value="500"
            percentage={10}
            isPositive={false}
            icon={
              <img
                src="/images/chart-green.png"
                alt="Chart Icon"
                className="w-10 h-10"
              />
            }
          />
          <StatisticsBox
            name="Existing Users"
            value="4,500"
            percentage={1.65}
            isPositive={true}
            icon={
              <img
                src="/images/chart-blue.png"
                alt="Chart Icon"
                className="w-10 h-10"
              />
            }
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <OrderStatistics />
          </div>
          <Last7DaysSales />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <RecentTransactions />

          <TopProducts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
