import { Order, Recipient, Store } from "../../orderTypes";

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  promotional_price: number;
}

export interface StoreDetails extends Store {
  address: string;
  building_name: string;
  points: [number, number];
}

export interface Driver {
  id: string;
  full_name: string;
  phone_number: string;
}

export interface ContactDetails {
  full_name: string;
  email: string;
  phone_number: string;
}

export interface RecipientDetails extends Recipient {
  phone_number: string;
}

export interface OrderDetails
  extends Omit<Order, "store" | "payment_method" | "recipient"> {
  store: StoreDetails;
  products: Product[];
  driver: Driver | null;
  contact_details: ContactDetails;
  recipient: RecipientDetails;
  delivery_fee: number;
  note: string;
  building_name: string;
  points: [number, number];
}
