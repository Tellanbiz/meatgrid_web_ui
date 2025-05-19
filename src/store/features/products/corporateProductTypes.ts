export interface CorporateProduct {
  id: string;
  image: string;
  name: string;
  regular_price: number;
  weight: number;
  unit_type: string;
  org: {
    id: string;
    full_name: string;
  };
}
