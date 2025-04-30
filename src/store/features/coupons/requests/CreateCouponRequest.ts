export interface CreateCouponRequest {
  name: string;
  coupon_key: string;
  description: string;
  active: boolean;
  amount: number;
  max_used: number;
}
