export interface Coupon {
  id: string;
  name: string;
  description: string;
  coupon_key: string;
  qr_image: string | null;
  active: boolean;
  used: number;
  amount: number;
  max_used: number;
  created_at: string;
}
