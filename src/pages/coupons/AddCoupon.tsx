import { ChevronLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import AddCouponComponent from "./components/AddCouponComponent";
import { useNavigate } from "react-router-dom";

const AddCoupon = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="bg-background py-2 sticky top-16">
        <Button
          variant="link"
          className="hover:underline"
          onClick={handleBack}
        >
          <ChevronLeft className="size-4" />
          <span>Back</span>
        </Button>
      </div>

      <div className="mt-4 p-4 bg-white rounded h-full">
        <AddCouponComponent />
      </div>
    </>
  );
};

export default AddCoupon;
