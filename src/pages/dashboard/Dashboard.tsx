import StatisticsGrid from "./components/StatisticsGrid";
import OrderStatistics from "./components/OrderStatistics";
import RevenueStatistics from "./components/RevenueStatistics";
import ProductStatusStatistics from "./components/ProductStatusStatistics";
import TopSelling from "./components/TopSelling";
import TopCustomer from "./components/TopCustomer";
import TopStores from "./components/TopStores";
import OrderStatus from "./components/OrderStatus";
import OrderSummary from "./components/OrderSummary";
import LatestOnlineOrders from "./components/LatestOnlineOrders";

const Dashboard = () => {
  return (
    <div className="w-full flex flex-col gap-y-4">
      {/* Statistics Grid */}
      <StatisticsGrid />

      {/* Order and Sales Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <OrderStatistics />
        </div>
        <OrderSummary />
      </div>

      {/* Order Status */}
      <OrderStatus />

      {/* Revenue and Product Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RevenueStatistics />
        <ProductStatusStatistics />
      </div>

      {/* Latest Online Orders */}
      <LatestOnlineOrders />

      {/* Top Selling, Stores, and Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TopSelling />
        <TopStores />
        <TopCustomer />
      </div>
    </div>
  );
};

export default Dashboard;
