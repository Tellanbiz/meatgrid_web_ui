import CouponsTable from "./components/CouponsTable";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import Breadcrumbs from "../../components/breadcrumbs";

const Coupons = () => {
  const navigate = useNavigate();
  const handleAddNewCoupon = () => {
    navigate("/coupons/new");
  };
  const handleRefresh = () => {
    // Logic to refresh the coupons list
    console.log("Refresh coupons list");
  };

  return (
    <>
      <div className="flex justify-between items-center py-2 bg-background sticky top-0 z-10">
        <Breadcrumbs
          items={[
            {
              label: "Coupons",
              isPage: true,
            },
          ]}
        />

        <div className="flex justify-end items-center gap-x-2">
          <Button
            variant="outline"
            className="items-center gap-2"
            onClick={handleRefresh}
          >
            <RefreshCcw className="size-4" />
            Refresh
          </Button>

          <Button
            variant="default"
            className="items-center gap-2"
            onClick={handleAddNewCoupon}
          >
            <Plus className="size-4" />
            New Coupon
          </Button>
        </div>
      </div>

      <div className="mt-4 p-4 bg-white rounded h-full">
        <CouponsTable />
      </div>
    </>
  );
};

export default Coupons;
