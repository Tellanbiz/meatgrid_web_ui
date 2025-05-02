import AddCouponComponent from "./components/AddCouponComponent";
import Breadcrumbs from "../../components/breadcrumbs";

const AddCoupon = () => {
  return (
    <>
      <div className="bg-background py-2 sticky top-16">
        <Breadcrumbs
          items={[
            { label: "Coupons", to: "/coupons" },
            { label: "Add Coupon", isPage: true },
          ]}
        />
      </div>

      <div className="mt-4 p-4 bg-white rounded h-full">
        <AddCouponComponent />
      </div>
    </>
  );
};

export default AddCoupon;
