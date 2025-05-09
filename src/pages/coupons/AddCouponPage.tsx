import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectCouponError,
  selectCouponSuccessMessage,
  selectIsCreatingCoupon,
} from "../../store/features/coupons/couponSelectors";
import {
  createCoupon,
  fetchCoupons,
} from "../../store/features/coupons/couponThunks";
import { clearCouponMessages } from "../../store/features/coupons/couponSlice";
import { toast } from "sonner";
import Breadcrumbs from "../../components/breadcrumbs";
import CouponForm, { CouponFormData } from "./components/CouponForm";

const AddCouponPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isCreating = useAppSelector(selectIsCreatingCoupon);
  const error = useAppSelector(selectCouponError);
  const successMessage = useAppSelector(selectCouponSuccessMessage);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearCouponMessages());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearCouponMessages());
      navigate("/coupons");
      setTimeout(() => {
        dispatch(fetchCoupons());
      }, 100);
    }
  }, [successMessage, dispatch, navigate]);

  const handleSubmit = (formData: CouponFormData) => {
    dispatch(createCoupon(formData));
  };

  const handleCancel = () => {
    navigate("/coupons");
  };

  return (
    <div>
      <div className="flex justify-between items-center py-2 sticky top-16 z-10 bg-background">
        <Breadcrumbs
          items={[
            { label: "Coupons", to: "/coupons" },
            { label: "Add New Coupon", isPage: true },
          ]}
        />
      </div>

      <div className="mt-6">
        <CouponForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isCreating}
        />
      </div>
    </div>
  );
};

export default AddCouponPage;
