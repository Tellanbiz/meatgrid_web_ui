import AddCouponComponent from "./components/AddCouponComponent";

const AddCoupon = () => {
  return (
    <>
      <div className="bg-background py-2 sticky top-0">
        <h4 className="text-base font-bold">New Coupon</h4>
      </div>

      <div className="mt-4 p-4 bg-white rounded h-full">
        <AddCouponComponent />
      </div>
    </>
  );
};

export default AddCoupon;
