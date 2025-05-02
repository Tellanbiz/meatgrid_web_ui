import CouponsTable from "./components/CouponsTable";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import Breadcrumbs from "../../components/breadcrumbs";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchCoupons } from "../../store/features/coupons/couponThunks";
import { selectIsFetchingCoupons } from "../../store/features/coupons/couponSelectors";

const Coupons = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch()

  const isFetchingCoupons = useAppSelector(selectIsFetchingCoupons);

  const handleAddNewCoupon = () => {
    navigate("/coupons/new");
  };

  const handleRefresh = () => {
    dispatch(fetchCoupons())
  };


  return (
    <>
      <div className="flex justify-between items-center py-2 bg-background sticky top-16 z-10">
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
            disabled={isFetchingCoupons}
          >
            <RefreshCcw className={`size-4 ${isFetchingCoupons? "animate-spin": ""}`} />
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

      <div className="mt-2 card h-table">
        <CouponsTable />
      </div>
    </>
  );
};

export default Coupons;
