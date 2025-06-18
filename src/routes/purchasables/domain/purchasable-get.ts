import axios from "@/service/api";
import { Purchasable, PurchasableOrder } from "./models";

export async function getPurchasables(): Promise<Purchasable[]> {
    const response = await axios.get("/purchasables");
    return response.data as Purchasable[];
}

export async function getPurchasableOrders(): Promise<PurchasableOrder[]> {
    const response = await axios.get("/purchasables");
    return response.data as PurchasableOrder[];
}

