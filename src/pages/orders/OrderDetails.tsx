import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { fetchOrderById } from "../../store/features/orders/orderThunks";
import OrderDetailsComponent from "./components/OrderDetailsComponent";
import { Badge } from "@/components/ui/badge.tsx";
import BackButton from "@/components/buttons/BackButton.tsx";
import { orderStatusColors } from "@/shared/constants/StatusColors.ts";
import LoadingPage from "@/components/navigation/LoadingPage.tsx";

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedOrderDetails, status, error } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between py bg-background z-20">
        <BackButton />
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm">MG{selectedOrderDetails?.order_id}</span>
            <Badge
              className={
                orderStatusColors[selectedOrderDetails?.status || "pending"]
              }
            >
              {selectedOrderDetails?.status}
            </Badge>
          </div>

          <span className="text-xs font-light text-gray-500">
            {selectedOrderDetails?.created_at &&
              new Date(selectedOrderDetails.created_at).toLocaleString(
                "en-US",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }
              )}
          </span>
        </div>
      </div>

      <div className="mt-2 bg-background rounded">
        {status === "loading" && <LoadingPage />}

        {error && <p className="text-red-500">{error}</p>}

        {selectedOrderDetails && (
          <OrderDetailsComponent order={selectedOrderDetails} />
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
