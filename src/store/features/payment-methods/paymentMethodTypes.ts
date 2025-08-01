export interface PaymentMethod {
  id: string;
  name: string;
  tag: string;
  active: boolean;
  disable_total: boolean;
  created_at: string;
}
