import { Product } from "../../../store/features/orders/request/response/FetchOrderByIdResponse";

const OrderProduct = ({
  product,
  quantity = 1,
}: {
  product: Product;
  quantity?: number;
}) => {
  return (
    <>
      <div className="card shadow-xs p-4 flex items-center space-x-2">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div className="flex flex-col items-start justify-around text-start flex-1">
          <h3 className="font-medium">{product.name}</h3>
          <div className="flex items-center space-x-2 py-1">
            <p className="text-sm text-gray-700">KES {product.price}</p>{" "}
            <span className="text-sm font-semibold">x {quantity}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderProduct;
