export interface StoreProduct {
  id: string;
  image: string;
  name: string;
  regular_price: number;
  weight: number;
  unit_type: string;
  store: {
    id: string;
    name: string;
  };
}
