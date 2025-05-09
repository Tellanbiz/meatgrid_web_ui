import { CreateCouponRequest } from "./CreateCouponRequest";

export interface UpdateCouponRequest extends CreateCouponRequest {
  id: string;
}
