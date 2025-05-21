export interface Batch {
  id: string;
  batch_number: string;
  expiry_at: string;
  product: string;
  storage_type: string;
  store: string;
  bar_code_url: string;
  qr_code_url: string;
  suppliers: string[];
}
