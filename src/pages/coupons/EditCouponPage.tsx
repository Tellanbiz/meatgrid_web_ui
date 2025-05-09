import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectCouponById,
  selectCouponError,
  selectCouponSuccessMessage,
  selectIsUpdatingCoupon,
} from "../../store/features/coupons/couponSelectors";
import {
  updateCoupon,
  fetchCoupons,
} from "../../store/features/coupons/couponThunks";
import { clearCouponMessages } from "../../store/features/coupons/couponSlice";
import Breadcrumbs from "../../components/breadcrumbs";
import { toast } from "sonner";
import CouponForm, { CouponFormData } from "./components/CouponForm";
import { Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";

const EditCouponPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const coupon = useAppSelector((state) =>
    id ? selectCouponById(id)(state) : undefined
  );
  const isUpdating = useAppSelector(selectIsUpdatingCoupon);
  const error = useAppSelector(selectCouponError);
  const successMessage = useAppSelector(selectCouponSuccessMessage);

  // Make sure we have the coupons data
  useEffect(() => {
    if (!coupon) {
      dispatch(fetchCoupons())
        .unwrap()
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [coupon, dispatch]);

  // Error and success handling
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

  // Handle form submit
  const handleSubmit = (formData: CouponFormData) => {
    if (!id) return;

    const updateData = {
      ...formData,
      id: id,
    };

    dispatch(updateCoupon(updateData));
  };

  const handleCancel = () => {
    navigate("/coupons");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!coupon && !isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold text-red-500">Coupon not found</h2>
        <Button className="mt-4" onClick={() => navigate("/coupons")}>
          Back to Coupons
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center py-2 sticky top-16 z-10 bg-background">
        <Breadcrumbs
          items={[
            { label: "Coupons", to: "/coupons" },
            { label: "Edit Coupon", isPage: true },
          ]}
        />
      </div>

      <div className="mt-6">
        {coupon && (
          <CouponForm
            initialValues={{
              id: coupon.id,
              name: coupon.name,
              description: coupon.description,
              coupon_key: coupon.coupon_key,
              active: coupon.active,
              amount: coupon.amount,
              max_used: coupon.max_used,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isUpdating}
            isEditMode={true}
          />
        )}
      </div>
    </div>
  );
};

export default EditCouponPage;
