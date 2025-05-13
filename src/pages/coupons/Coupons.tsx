import CouponsTable from "./components/CouponsTable";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchCoupons } from "../../store/features/coupons/couponThunks";
import { selectIsFetchingCoupons } from "../../store/features/coupons/couponSelectors";

const Coupons = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isFetchingCoupons = useAppSelector(selectIsFetchingCoupons);

  const handleAddNewCoupon = () => {
    navigate("/coupons/new");
  };

  const handleRefresh = () => {
    dispatch(fetchCoupons());
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Coupons</h1>
        <div className="flex gap-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetchingCoupons}
          >
            <RefreshCcw className={`h-4 w-4 ${isFetchingCoupons ? "animate-spin" : ""}`} />
            <span className="ml-2">Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={handleAddNewCoupon}
          >
            <Plus className="h-4 w-4" />
            <span className="ml-2">New Coupon</span>
          </Button>
        </div>
      </div>

      <div className="h-table">
        <CouponsTable />
      </div>
    </div>
  );
};

export default Coupons;
