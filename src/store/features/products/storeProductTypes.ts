import { BaseProduct } from "./productTypes";

export interface StoreProduct extends BaseProduct {
  store: {
    id: string;
    name: string;
  };
}
