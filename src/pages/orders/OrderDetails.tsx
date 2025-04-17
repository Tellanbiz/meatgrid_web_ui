import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { fetchOrderById } from "../../store/features/orders/orderThunks";
import OrderDetailsComponent from "./components/OrderDetailsComponent";
import { FiChevronLeft } from "react-icons/fi";
import LoadingPage from "../../components/LoadingPage.tsx";

const OrderDetails = () => {
  const navigate = useNavigate();
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

  const handleBack = () => navigate(-1);

  return (
    <>
      <div className="flex items-center justify-between py-2 bg-background sticky top-0">
        <button
          onClick={handleBack}
          className="flex items-center text-medium text-primary hover:underline"
        >
          <FiChevronLeft className="mr-2" />
          Back
        </button>
        <h4 className="text-base font-bold">Order Details</h4>
      </div>

      <div className="mt-4 p-4 bg-background rounded">
        {status === "loading" && <LoadingPage />}

        {error && <p className="text-red-500">{error}</p>}

        {selectedOrderDetails && (
          <OrderDetailsComponent order={selectedOrderDetails} />
        )}
      </div>
    </>
  );
};

export default OrderDetails;
