export interface CreateStoreRequest {
  name: string;
  description: string;
  address: string;
  building_name: string;
  points: [number, number];
  is_store: boolean;
  is_warehouse: boolean;
  is_active: boolean;
}
