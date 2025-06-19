import axios from "@/service/api";
import { CreateOrderPurchaseParams, CreatePurchaseParams } from "./models";


export async function createPurchasable(params: CreatePurchaseParams): Promise<string | undefined> {
    const response = await axios.post("/purchasables/new", params);
    return response.data.error;
}

export async function updatePurchasable(params: CreatePurchaseParams): Promise<string | undefined> {
    const response = await axios.post("/purchasables/update", params);
    return response.data.error;
}

export async function createPurchaseOrder(params: CreateOrderPurchaseParams) {
    const response = await axios.post("/purchasables/order", params);
    return response.data.error
}
