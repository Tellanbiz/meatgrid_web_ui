import { BaseProduct } from "./productTypes";

export interface CorporateProduct extends BaseProduct {
  org: {
    id: string;
    full_name: string;
  };
}
