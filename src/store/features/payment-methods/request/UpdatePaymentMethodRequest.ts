export interface UpdatePaymentMethodRequest {
  id: string;
  name: string;
  active: boolean;
  disable_total: boolean;
}
