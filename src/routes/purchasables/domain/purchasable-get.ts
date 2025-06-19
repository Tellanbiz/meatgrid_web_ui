import axios from "@/service/api";
import { Purchasable, PurchasableOrder } from "./models";

export async function getPurchasables(): Promise<Purchasable[]> {
    const response = await axios.get("/purchasables");
    return response.data as Purchasable[];
}

/** so the date should be as dd-mm-yyyy */
export async function getPurchasableOrders(startDate: string, endDate: string): Promise<PurchasableOrder[]> {
    const response = await axios.get(`/purchasables/orders?start_date=${startDate}&end_date=${endDate}`);
    return response.data as PurchasableOrder[];
}

