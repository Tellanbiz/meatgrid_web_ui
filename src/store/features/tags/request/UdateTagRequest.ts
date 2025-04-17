export interface UpdateTagRequest {
  id: string;
  name: string;
  promotional_price: number;
  priority: number;
  is_pos: boolean;
  is_mobile: boolean;
  active: boolean;
}
