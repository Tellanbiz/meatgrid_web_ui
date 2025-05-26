import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectCouponError,
  selectCouponSuccessMessage,
  selectIsCreatingCoupon,
} from "../../store/features/coupons/couponSelectors";
import { createCoupon } from "../../store/features/coupons/couponThunks";
import { clearCouponMessages } from "../../store/features/coupons/couponSlice";
import { toast } from "sonner";
import CouponForm, { CouponFormData } from "./components/CouponForm";
import BackButton from "@/components/buttons/BackButton";

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
    }
  }, [successMessage, dispatch, navigate]);

  const handleSubmit = async (formData: CouponFormData) => {
    dispatch(createCoupon(formData));
  };

  const handleCancel = () => {
    navigate("/coupons");
  };

  return (
    <div className="p-6">
      <div className="flex items-center py-2 mb-4">
        <BackButton />
        <h1 className="text-xl font-semibold ml-4">Create New Coupon</h1>
      </div>

      <CouponForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isCreating}
      />
    </div>
  );
};

export default AddCouponPage;
