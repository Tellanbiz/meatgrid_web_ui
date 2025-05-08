import RecentTransactions from "../../components/RecentTransactions";
import TopProducts from "./components/TopProducts";
import Breadcrumbs from "../../components/breadcrumbs";

const Dashboard = () => {
  return (
    <div className="w-full flex flex-col gap-y-6 p-1">
      <div className="flex justify-between items-center sticky top-16 z-20 bg-background py-3">
        <Breadcrumbs items={[{ label: "Dashboard", isPage: true }]} />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-80 overflo">
            <TopProducts />
          </div>
          <div className="h-80 overflow-auto">
            <RecentTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
